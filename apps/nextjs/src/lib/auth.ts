import { redirect } from "next/navigation";

import { auth } from "@amaxa/auth";

export const checkAuth = async () => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};
