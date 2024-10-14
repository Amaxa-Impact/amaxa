import { NextResponse } from "next/server";

import { auth } from "@amaxa/auth";

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  if (
    !isLoggedIn &&
    nextUrl.pathname !== "/sign-in" &&
    nextUrl.pathname !== "/unverified" &&
    !nextUrl.pathname.includes("/schedule") &&
    !nextUrl.pathname.includes("/apply") &&
    !nextUrl.pathname.includes("/api")
  ) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  const status = req.auth?.user.status;

  if (status === "Unverified") {
    return NextResponse.redirect(new URL("/unverified", nextUrl));
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path",
  ],
};
