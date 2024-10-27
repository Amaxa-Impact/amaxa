import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@amaxa/auth";

export const checkAuth = cache(async () => {
  try {
    const session = await auth();

    if (!session) {
      redirect("/sign-in");
    }

    return session;
  } catch (error) {
    console.error("Authentication check failed:", error);
    redirect("/sign-in?error=auth_failed");
  }
});
