import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@amaxa/auth";

export const checkAuth = cache(async () => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
});
