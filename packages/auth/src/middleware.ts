import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createAuthClient } from "better-auth/client";

export const client = createAuthClient();

export async function authMiddleware(request: NextRequest) {
  // Check if the request is for a public route
  const url = new URL(request.url);
  const publicPaths = ["/sign-in", "/sign-up", "/api/auth"];

  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  /**
   * This is an example of how you can use the client to get the session
   * from the request headers.
   *
   * You can then use this session to make decisions about the request
   */
  const { data: session } = await client.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  });
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}
