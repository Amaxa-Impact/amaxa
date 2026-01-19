import { buildDownloadUrl } from "convex-fs";
import { v } from "convex/values";

import { api } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { fs } from "./fs";

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

export const getApplicationFileUrl = action({
  args: {
    blobId: v.string(),
    path: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw new Error("Not authorized");
    }

    const status = await ctx.runQuery(api.auth.getCurrentUserStatus);
    if (!status.isAdmin) {
      throw new Error("Not authorized");
    }

    const file = await fs.stat(ctx, args.path);
    if (file?.blobId !== args.blobId) {
      return null;
    }

    return await fs.getDownloadUrl(ctx, args.blobId);
  },
});

export const getApplicationFilePreview = action({
  args: {
    blobId: v.string(),
    path: v.string(),
  },
  returns: v.union(
    v.object({
      data: v.bytes(),
      contentType: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw new Error("Not authorized");
    }

    const status = await ctx.runQuery(api.auth.getCurrentUserStatus);
    if (!status.isAdmin) {
      throw new Error("Not authorized");
    }

    const file = await fs.stat(ctx, args.path);
    if (file?.blobId !== args.blobId) {
      return null;
    }

    const result = await fs.getFile(ctx, args.path);
    if (!result) {
      return null;
    }

    return {
      data: result.data,
      contentType: result.contentType,
    };
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
    const allFieldResponses = await ctx.db
      .query("applicationFieldResponses")
      .collect();

    const usedBlobIds = new Set<string>();
    for (const fr of allFieldResponses) {
      if (
        typeof fr.value === "object" &&
        "type" in fr.value 
      ) {
        for (const file of fr.value.files) {
          usedBlobIds.add(file.blobId);
        }
      }
    }

    const orphanedBlobs: { blobId: string; path: string }[] = [];
    let cursor: string | null = null;
    let isDone = false;

    while (!isDone) {
      const result = await fs.list(ctx, {
        prefix: "/applications/",
        paginationOpts: { numItems: 100, cursor },
      });

      for (const blob of result.page) {
        if (!usedBlobIds.has(blob.blobId)) {
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
