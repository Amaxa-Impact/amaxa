import { NextResponse } from "next/server";
import { generatePresignedDownloadUrl } from "@/lib/s3";
import { type } from "arktype";

const inputSchema = type({
  s3Key: "string",
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = inputSchema(body);

    if (data instanceof type.errors) {
      return NextResponse.json({ error: data.summary }, { status: 400 });
    }

    const { s3Key } = data;

    // Generate presigned download URL
    const downloadUrl = await generatePresignedDownloadUrl(s3Key);

    return NextResponse.json({
      downloadUrl,
    });
  } catch (error) {
    console.error("Download URL error:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 },
    );
  }
}
