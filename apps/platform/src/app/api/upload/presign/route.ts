import { NextResponse } from "next/server";
import { generatePresignedUploadUrl, generateS3Key } from "@/lib/s3";
import { type } from "arktype";
import { fetchMutation } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

const inputSchema = type({
  fieldId: "string",
  formSlug: "string",
  filename: "string",
  contentType: "string",
  sizeBytes: "number",
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = inputSchema(body);

    if (data instanceof type.errors) {
      return NextResponse.json({ error: data.summary }, { status: 400 });
    }

    const { formSlug, filename, contentType, sizeBytes } = data;

    // Generate unique S3 key and upload token
    const s3Key = generateS3Key(formSlug, filename);
    const uploadToken = crypto.randomUUID();

    // Generate presigned upload URL
    const uploadUrl = await generatePresignedUploadUrl(s3Key, contentType);

    // Create upload record in Convex
    await fetchMutation(api.fileUpload.createUploadRecord, {
      s3Key,
      filename,
      contentType,
      sizeBytes,
      uploadToken,
    });

    return NextResponse.json({
      uploadUrl,
      s3Key,
      uploadToken,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
