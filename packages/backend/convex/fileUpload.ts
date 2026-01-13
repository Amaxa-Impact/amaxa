import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a record for a pending file upload.
 * Called before the client uploads directly to S3.
 */
export const createUploadRecord = mutation({
  args: {
    s3Key: v.string(),
    filename: v.string(),
    contentType: v.string(),
    sizeBytes: v.number(),
    uploadToken: v.string(),
  },
  returns: v.id("applicationFileUploads"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes

    return await ctx.db.insert("applicationFileUploads", {
      s3Key: args.s3Key,
      filename: args.filename,
      contentType: args.contentType,
      sizeBytes: args.sizeBytes,
      uploadedAt: now,
      uploadToken: args.uploadToken,
      expiresAt,
    });
  },
});

/**
 * Get a file upload record by its upload token.
 */
export const getByUploadToken = query({
  args: {
    uploadToken: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationFileUploads"),
      _creationTime: v.number(),
      s3Key: v.string(),
      filename: v.string(),
      contentType: v.string(),
      sizeBytes: v.number(),
      uploadedAt: v.number(),
      uploadToken: v.string(),
      expiresAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applicationFileUploads")
      .withIndex("by_uploadToken", (q) => q.eq("uploadToken", args.uploadToken))
      .unique();
  },
});

/**
 * Get a file upload record by its S3 key.
 */
export const getByS3Key = query({
  args: {
    s3Key: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("applicationFileUploads"),
      _creationTime: v.number(),
      s3Key: v.string(),
      filename: v.string(),
      contentType: v.string(),
      sizeBytes: v.number(),
      uploadedAt: v.number(),
      uploadToken: v.string(),
      expiresAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applicationFileUploads")
      .withIndex("by_s3Key", (q) => q.eq("s3Key", args.s3Key))
      .unique();
  },
});

/**
 * Delete expired upload records.
 * Should be called periodically via cron job.
 */
export const cleanupExpired = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const expiredUploads = await ctx.db
      .query("applicationFileUploads")
      .collect();

    let deletedCount = 0;
    for (const upload of expiredUploads) {
      if (upload.expiresAt < now) {
        await ctx.db.delete(upload._id);
        deletedCount++;
      }
    }

    return deletedCount;
  },
});
