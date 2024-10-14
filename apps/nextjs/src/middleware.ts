import { NextResponse } from "next/server";

import { auth } from "@amaxa/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define public routes that don't require authentication
  const publicRoutes = ["/sign-in", "/unverified", "/schedule", "/apply"];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  // Allow access to API routes without redirection
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If not logged in and trying to access a protected route, redirect to sign-in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (
    isLoggedIn &&
    req.auth?.user.status === "Unverified" &&
    nextUrl.pathname !== "/unverified" &&
    nextUrl.pathname !== "/sign-out"
  ) {
    return NextResponse.redirect(new URL("/unverified", nextUrl));
  }

  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
