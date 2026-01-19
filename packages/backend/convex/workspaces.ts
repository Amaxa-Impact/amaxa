import { ConvexError, v } from "convex/values";

import type { MutationCtx, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internalQuery, mutation, query } from "./_generated/server";
import { isSiteAdmin, requireAuth } from "./permissions";

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

type RateLimitError = {
  code: "RATE_LIMIT_EXCEEDED";
  limit: number;
  windowMs: number;
  remainingMs: number;
};

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
    throw new ConvexError<RateLimitError>({
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

// Workspace role type
export type WorkspaceRole = "owner" | "admin" | "member";

// Return validator for workspace document
const workspaceValidator = v.object({
  _id: v.id("workspaces"),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  domain: v.optional(v.string()),
  createdBy: v.string(),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
});

/**
 * Create a new workspace
 * - Validates slug format and uniqueness
 * - Creates owner membership for creator
 */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  returns: v.id("workspaces"),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Validate slug format
    const slugValidation = validateSlug(args.slug);
    if (!slugValidation.valid) {
      throw new Error(slugValidation.error);
    }

    // Check rate limit (site admins bypass)
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

    // Check slug uniqueness
    const existing = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error(`Workspace with slug "${args.slug}" already exists`);
    }

    // Create workspace
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      slug: args.slug,
      createdBy: userId,
      createdAt: Date.now(),
    });

    // Add creator as owner
    await ctx.db.insert("workspaceToUser", {
      workspaceId,
      userId,
      role: "owner",
    });

    return workspaceId;
  },
});

/**
 * Get workspace by ID
 * Requires membership or site admin
 */
export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  returns: v.union(workspaceValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      return null;
    }

    // Site admins can access any workspace
    if (await isSiteAdmin(ctx, userId)) {
      return workspace;
    }

    // Check membership
    const membership = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId_and_workspaceId", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId),
      )
      .unique();

    if (!membership) {
      throw new Error("You do not have access to this workspace");
    }

    return workspace;
  },
});

/**
 * Get workspace by slug
 * Requires membership or site admin
 */
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

    // Site admins can access any workspace
    if (await isSiteAdmin(ctx, userId)) {
      return workspace;
    }

    // Check membership
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

/**
 * Internal query to get workspace by domain (for middleware)
 */
export const getByDomain = internalQuery({
  args: {
    domain: v.string(),
  },
  returns: v.union(workspaceValidator, v.null()),
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .unique();

    if (!workspace || workspace.deletedAt) {
      return null;
    }

    return workspace;
  },
});

/**
 * Internal query to get workspace by slug (for middleware, no auth check)
 */
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

/**
 * Update workspace (name only - slug is immutable)
 * Requires admin+ role or site admin
 */
export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
    domain: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Check permissions (site admin or workspace admin+)
    const isAdmin = await isSiteAdmin(ctx, userId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", userId).eq("workspaceId", args.workspaceId),
        )
        .unique();

      if (!membership || membership.role === "member") {
        throw new Error("You must be a workspace admin to update settings");
      }
    }

    // Build update object
    const updates: Partial<Doc<"workspaces">> = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }
    if (args.domain !== undefined) {
      // Check domain uniqueness if setting
      if (args.domain) {
        const existingDomain = await ctx.db
          .query("workspaces")
          .withIndex("by_domain", (q) => q.eq("domain", args.domain))
          .unique();

        if (existingDomain && existingDomain._id !== args.workspaceId) {
          throw new Error(`Domain "${args.domain}" is already in use`);
        }
      }
      updates.domain = args.domain || undefined;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.workspaceId, updates);
    }

    return null;
  },
});

/**
 * Soft delete workspace
 * Requires owner role or site admin
 */
export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || workspace.deletedAt) {
      throw new Error("Workspace not found");
    }

    // Check permissions (site admin or workspace owner)
    const isAdmin = await isSiteAdmin(ctx, userId);
    if (!isAdmin) {
      const membership = await ctx.db
        .query("workspaceToUser")
        .withIndex("by_userId_and_workspaceId", (q) =>
          q.eq("userId", userId).eq("workspaceId", args.workspaceId),
        )
        .unique();

      if (!membership || membership.role !== "owner") {
        throw new Error("Only the workspace owner can delete a workspace");
      }
    }

    // Soft delete - set deletedAt timestamp
    await ctx.db.patch(args.workspaceId, {
      deletedAt: Date.now(),
    });

    return null;
  },
});

/**
 * List all workspaces (site admin only)
 */
export const list = internalQuery({
  args: {},
  returns: v.array(workspaceValidator),
  handler: async (ctx) => {
    const workspaces = await ctx.db.query("workspaces").order("desc").collect();

    // Filter out soft-deleted workspaces
    return workspaces.filter((w) => !w.deletedAt);
  },
});

/**
 * List workspaces for current user
 */
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

    // Get all memberships for user
    const memberships = await ctx.db
      .query("workspaceToUser")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    // Fetch workspaces
    const results: Array<{
      workspace: Doc<"workspaces">;
      role: WorkspaceRole;
    }> = [];

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

/**
 * Check if slug is available
 */
export const checkSlugAvailable = query({
  args: {
    slug: v.string(),
  },
  returns: v.object({
    available: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Validate format first
    const validation = validateSlug(args.slug);
    if (!validation.valid) {
      return { available: false, error: validation.error };
    }

    // Check if exists
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
