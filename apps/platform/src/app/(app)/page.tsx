import { withAuth } from "@workos-inc/authkit-nextjs";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { HomeClient } from "../_components/home-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View and manage your projects on the Amaxa Platform",
};

export default async function Home() {
  const { accessToken } = await withAuth();

  const userStatus = accessToken
    ? await fetchQuery(
        api.auth.getCurrentUserStatus,
        {},
        { token: accessToken }
      )
    : null;

  const isAdmin = userStatus?.isAdmin ?? false;
  const userId = userStatus?.userId ?? null;

  if (!userId) {
    redirect("/sign-in");
  }

  const prefetchProjects = await preloadQuery(
    api.projects.listForUser,
    { userId },
    { token: accessToken }
  );

  return (
    <HomeClient
      isAdmin={isAdmin}
      prefetchProjects={prefetchProjects}
      userId={userId}
    />
  );
}
