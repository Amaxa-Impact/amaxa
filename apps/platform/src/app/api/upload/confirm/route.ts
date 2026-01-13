import { NextResponse } from "next/server";
import { type } from "arktype";
import { fetchQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

const inputSchema = type({
  uploadToken: "string",
  s3Key: "string",
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = inputSchema(body);

    if (data instanceof type.errors) {
      return NextResponse.json({ error: data.summary }, { status: 400 });
    }

    const { uploadToken, s3Key } = data;

    // Verify upload record exists
    const uploadRecord = await fetchQuery(api.fileUpload.getByUploadToken, {
      uploadToken,
    });

    if (!uploadRecord) {
      return NextResponse.json(
        { error: "Upload record not found" },
        { status: 404 },
      );
    }

    if (uploadRecord.s3Key !== s3Key) {
      return NextResponse.json({ error: "S3 key mismatch" }, { status: 400 });
    }

    // Check if upload has expired
    if (uploadRecord.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: "Upload has expired" },
        { status: 410 },
      );
    }

    return NextResponse.json({
      success: true,
      fileMetadata: {
        s3Key: uploadRecord.s3Key,
        filename: uploadRecord.filename,
        contentType: uploadRecord.contentType,
        sizeBytes: uploadRecord.sizeBytes,
      },
    });
  } catch (error) {
    console.error("Confirm error:", error);
    return NextResponse.json(
      { error: "Failed to confirm upload" },
      { status: 500 },
    );
  }
}
