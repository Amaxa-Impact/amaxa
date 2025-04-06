import { redirect } from "next/navigation";

import { getSession } from "@amaxa/auth";

export const checkAuth = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};
