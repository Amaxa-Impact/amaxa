import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import { UserManagement } from "./_components/table";

export default async function Page() {
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
