import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { withAuth } from "@workos-inc/authkit-nextjs";

const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(
  ".convex.cloud",
  ".convex.site",
);

export async function POST(request: NextRequest) {
  const { accessToken } = await withAuth({ ensureSignedIn: true });

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType =
    request.headers.get("content-type") ?? "application/octet-stream";

  const body = await request.arrayBuffer();

  const uploadResponse = await fetch(`${CONVEX_SITE_URL}/fs/upload`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,

      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    return NextResponse.json(
      { error: `Upload failed: ${errorText}` },
      { status: uploadResponse.status },
    );
  }

  const result: unknown = await uploadResponse.json();
  return NextResponse.json(result);
}
