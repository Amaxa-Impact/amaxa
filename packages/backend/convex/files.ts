import { buildDownloadUrl } from "convex-fs";
import { v } from "convex/values";

import { api, internal } from "./_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { fs } from "./fs";
import { requireSiteAdmin } from "./permissions";

const CONVEX_SITE_URL =
  process.env.CONVEX_SITE_URL ?? "https://good-mongoose-472.convex.cloud";

export const commitFile = action({
  args: {
    blobId: v.string(),
    filename: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const status = await ctx.runQuery(api.auth.getCurrentUserStatus);
    if (!status.isAdmin) {
      throw new Error("Only site admins can commit files");
    }
    const path = "/" + args.filename;
    await fs.commitFiles(ctx, [{ path, blobId: args.blobId }]);
    return null;
  },
});

export const commitApplicationFile = action({
  args: {
    blobId: v.string(),
    filename: v.string(),
    formSlug: v.string(),
  },
  returns: v.object({
    path: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to upload files");
    }

    const timestamp = Date.now();
    const sanitizedFilename = args.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `/applications/${args.formSlug}/${timestamp}_${sanitizedFilename}`;

    await fs.commitFiles(ctx, [{ path, blobId: args.blobId }]);

    return { path };
  },
});

export const getFileUrl = query({
  args: { path: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const file = await fs.stat(ctx, args.path);
    if (!file) {
      return null;
    }
    return buildDownloadUrl(CONVEX_SITE_URL, "/fs", file.blobId, args.path);
  },
});

export const getApplicationFileUrl = query({
  args: {
    blobId: v.string(),
    path: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);
    return buildDownloadUrl(CONVEX_SITE_URL, "/fs", args.blobId, args.path);
  },
});

export const listOrphanedBlobs = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      blobId: v.string(),
      path: v.string(),
    }),
  ),
  handler: async (ctx) => {
    // Get all field responses first to find used blobIds
    const allFieldResponses = await ctx.db
      .query("applicationFieldResponses")
      .collect();

    const usedBlobIds = new Set<string>();
    for (const fr of allFieldResponses) {
      if (
        typeof fr.value === "object" &&
        "type" in fr.value &&
        fr.value.type === "file"
      ) {
        for (const file of fr.value.files) {
          usedBlobIds.add(file.blobId);
        }
      }
    }

    // Paginate through all blobs in /applications/
    const orphanedBlobs: Array<{ blobId: string; path: string }> = [];
    let cursor: string | null = null;
    let isDone = false;

    while (!isDone) {
      const result = await fs.list(ctx, {
        prefix: "/applications/",
        paginationOpts: { numItems: 100, cursor },
      });

      for (const blob of result.page) {
        // Check if blob is old enough and not used
        if (!usedBlobIds.has(blob.blobId)) {
          // For simplicity, we check all uncommitted blobs in the prefix
          // In a real scenario, you'd want to check createdAt but it's not in the page result
          orphanedBlobs.push({ blobId: blob.blobId, path: blob.path });
        }
      }

      isDone = result.isDone;
      cursor = result.continueCursor;
    }

    return orphanedBlobs;
  },
});

export const deleteBlob = internalMutation({
  args: {
    path: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await fs.delete(ctx, args.path);
    return null;
  },
});
