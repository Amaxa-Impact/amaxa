import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalQuery, mutation, query } from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";
import { siteAdminMutation, siteAdminQuery, workspaceMutation, workspaceQuery } from "./custom";

// Slug validation: lowercase, alphanumeric + hyphens, 3-50 chars
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const RESERVED_SLUGS = [
  "app",
  "www",
  "api",
  "admin",
  "internal",
  "mail",
  "ftp",
  "smtp",
  "pop",
  "imap",
];

const WORKSPACE_CREATE_LIMIT = 5;
const WORKSPACE_CREATE_WINDOW_MS = 3600000; // 1 hour
const RATE_LIMIT_ACTION = "workspaceCreate" as const;

async function checkRateLimit(
  ctx: MutationCtx,
  userId: string,
  action: string,
  maxCount: number,
  windowMs: number,
): Promise<void> {
  const now = Date.now();

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_userId_and_action", (q) =>
      q.eq("userId", userId).eq("action", action),
    )
    .unique();

  if (!existing) {
    await ctx.db.insert("rateLimits", {
      userId,
      action,
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (now - existing.windowStart > windowMs) {
    await ctx.db.patch(existing._id, {
      count: 1,
      windowStart: now,
    });
    return;
  }

  if (existing.count >= maxCount) {
    const remainingMs = existing.windowStart + windowMs - now;
    throw new ConvexError({
      code: "RATE_LIMIT_EXCEEDED",
      limit: maxCount,
      windowMs,
      remainingMs,
    });
  }

  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
  });
}

async function skipRateLimitForSiteAdmin(
  ctx: QueryCtx | MutationCtx,
  userId: string,
): Promise<boolean> {
  const siteUser = await ctx.db
    .query("siteUser")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();

  return siteUser?.role === "admin";
}

function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!SLUG_REGEX.test(slug)) {
    return {
      valid: false,
      error:
        "Slug must be 3-50 characters, lowercase alphanumeric with hyphens, cannot start or end with hyphen",
    };
  }
  if (RESERVED_SLUGS.includes(slug)) {
    return {
      valid: false,
      error: `Slug "${slug}" is reserved and cannot be used`,
    };
  }
  return { valid: true };
}

export type WorkspaceRole = "owner" | "admin" | "member";

const workspaceValidator = v.object({
  _id: v.id("workspaces"),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  createdBy: v.string(),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
});

export const create = siteAdminMutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  returns: v.object({
    workspaceId: v.id("workspaces"),
    slug: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const slugValidation = validateSlug(args.slug);
    if (!slugValidation.valid) {
      throw new Error(slugValidation.error);
    }

    const isSiteAdminUser = await skipRateLimitForSiteAdmin(ctx, userId);
    if (!isSiteAdminUser) {
      await checkRateLimit(
        ctx,
        userId,
        RATE_LIMIT_ACTION,
        WORKSPACE_CREATE_LIMIT,
        WORKSPACE_CREATE_WINDOW_MS,
      );
    }

    const existing = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error(`Workspace with slug "${args.slug}" already exists`);
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      slug: args.slug,
      createdBy: userId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("workspaceToUser", {
      workspaceId,
      userId,
      role: "owner",
    });

    return {workspaceId, slug: args.slug};
  },
});

export const get = workspaceQuery({
  args: {
    workspaceSlug: v.string(),
  },
  returns: v.union(workspaceValidator, v.null()),
  role: "member",
  handler: (ctx) => {
    const {workspace} = ctx;

    return workspace;
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(workspaceValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!workspace || workspace.deletedAt) {
      return null;
    }

    if (await isSiteAdmin(ctx, userId)) {
      return workspace;
    }

    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", workspace._id),
      )
      .unique();

    if (!membership) {
      throw new Error("You do not have access to this workspace");
    }

    return workspace;
  },
});
/** Internal: for middleware, no auth */
export const getBySlugInternal = internalQuery({
  args: {
    slug: v.string(),
  },
  returns: v.union(workspaceValidator, v.null()),
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!workspace || workspace.deletedAt) {
      return null;
    }

    return workspace;
  },
});

export const update = workspaceMutation({
  args: {
    workspaceSlug: v.string(),
    name: v.optional(v.string()),
  },
  returns: v.null(),
  role: "admin",
  handler: async (ctx, args) => {
    const workspace = ctx.workspace;

    const updates: Partial<Doc<"workspaces">> = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(workspace._id, updates);
    }

    return null;
  },
});

export const remove = mutation({
  args: {
    slug: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Use workspaceMutation for permission check
    const userId = await requireAuth(ctx);
    const isAdmin = await isSiteAdmin(ctx, userId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", userId).eq("workspaceId", workspace._id),
        )
        .unique();

      if (membership?.role !== "owner") {
        throw new Error("Only the workspace owner can delete a workspace");
      }
    }

    await ctx.db.patch(workspace._id, {
      deletedAt: Date.now(),
    });

    return null;
  },
});

/** Site admin only - internal */
export const list = internalQuery({
  args: {},
  returns: v.array(workspaceValidator),
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").order("desc").collect();
    return workspaces.filter((w) => !w.deletedAt);
  },
});

/** Site admin only - public query */
export const listAll = siteAdminQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("workspaces"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      createdBy: v.string(),
      createdAt: v.number(),
      userCount: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").order("desc").collect();
    const activeWorkspaces = workspaces.filter((w) => !w.deletedAt);

    // Batch load all memberships to avoid N+1 queries
    const allMemberships = await ctx.db.query("workspaceToUser").collect();

    // Group memberships by workspace
    const membershipsByWorkspace = new Map<string, number>();
    for (const membership of allMemberships) {
      const wsId = membership.workspaceId.toString();
      membershipsByWorkspace.set(wsId, (membershipsByWorkspace.get(wsId) ?? 0) + 1);
    }

    return activeWorkspaces.map((workspace) => ({
      _id: workspace._id,
      _creationTime: workspace._creationTime,
      name: workspace.name,
      slug: workspace.slug,
      createdBy: workspace.createdBy,
      createdAt: workspace.createdAt,
      userCount: membershipsByWorkspace.get(workspace._id.toString()) ?? 0,
    }));
  },
});

export const listForUser = query({
  args: {},
  returns: v.array(
    v.object({
      workspace: workspaceValidator,
      role: v.union(
        v.literal("owner"),
        v.literal("admin"),
        v.literal("member"),
      ),
    }),
  ),
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);

    const memberships = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const results: {
      workspace: Doc<"workspaces">;
      role: WorkspaceRole;
    }[] = [];

    for (const membership of memberships) {
      const workspace = await ctx.db.get(membership.workspaceId);
      if (workspace && !workspace.deletedAt) {
        results.push({
          workspace,
          role: membership.role,
        });
      }
    }

    return results;
  },
});

export const checkSlugAvailable = query({
  args: {
    slug: v.string(),
  },
  returns: v.object({
    available: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Require authentication to prevent unauthenticated slug enumeration
    await requireAuth(ctx);

    const validation = validateSlug(args.slug);
    if (!validation.valid) {
      return { available: false, error: validation.error };
    }

    const existing = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing && !existing.deletedAt) {
      return { available: false, error: "This slug is already taken" };
    }

    return { available: true };
  },
});
