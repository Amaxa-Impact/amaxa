import { Suspense } from "react";

import { checkAuth } from "~/lib/auth";
import { api, HydrateClient } from "~/trpc/server";
import Guides from "./_components/GuideCard";
import GuidesSkeleton from "./_components/GuideCardSkeleton";

export default async function Page() {
  await checkAuth();
  void api.actionGuides.getActionGuides.prefetch();

  return (
    <div className="w-full">
      <HydrateClient>
        <Suspense fallback={<GuidesSkeleton />}>
          <Guides />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
