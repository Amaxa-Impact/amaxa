import { NextResponse } from "next/server";

import { auth } from "@amaxa/auth";

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  if (
    !isLoggedIn &&
    nextUrl.pathname !== "/sign-in" &&
    !nextUrl.pathname.includes("/schedule")
  ) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path",
  ],
};
