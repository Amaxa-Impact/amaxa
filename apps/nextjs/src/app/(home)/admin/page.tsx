import { Suspense } from "react";

import { isAdmin } from "@amaxa/api";

import { checkAuth } from "~/lib/auth";
import { api, HydrateClient } from "~/trpc/server";
import { UserManagement } from "./_components/table";

export default async function Page() {
  const auth = await checkAuth();

  if (!isAdmin(auth)) {
    return <div>You are not an admin</div>;
  }

  void api.users.getUsers.prefetch();

  return (
    <div>
      <HydrateClient>
        <Suspense fallback="loading">
          <UserManagement />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
