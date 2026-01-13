import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

const s3Client = new S3Client({
  region: env.RAILWAY_REGION,
  endpoint: env.RAILWAY_ENDPOINT_URL,
  credentials: {
    accessKeyId: env.RAILWAY_ACCESS_ID_KEY,
    secretAccessKey: env.RAILWAY_ACCESS_SECRET_KEY,
  },
  // Force path style for Railway/non-AWS S3-compatible storage
  forcePathStyle: true,
});

/**
 * Generate a presigned URL for uploading a file directly to S3.
 * The client uploads directly to S3, avoiding service egress costs.
 *
 * @param key - The S3 object key (path)
 * @param contentType - MIME type of the file
 * @returns Presigned PUT URL valid for 15 minutes
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.RAILWAY_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // Sign the URL without checksum headers (browsers can't send them via CORS)
  return getSignedUrl(s3Client, command, {
    expiresIn: 900, // 15 minutes
    // Don't include SDK-added headers that browsers can't set
    unhoistableHeaders: new Set(["x-amz-checksum-crc32"]),
  });
}

/**
 * Generate a presigned URL for downloading a file directly from S3.
 * The client downloads directly from S3, avoiding service egress costs.
 *
 * @param key - The S3 object key (path)
 * @returns Presigned GET URL valid for 1 hour
 */
export async function generatePresignedDownloadUrl(
  key: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.RAILWAY_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}

/**
 * Generate a unique S3 key for an application file upload.
 *
 * @param formSlug - The form's slug
 * @param filename - Original filename
 * @returns Unique S3 key
 */
export function generateS3Key(formSlug: string, filename: string): string {
  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `applications/${formSlug}/${timestamp}_${uuid}_${sanitizedFilename}`;
}
