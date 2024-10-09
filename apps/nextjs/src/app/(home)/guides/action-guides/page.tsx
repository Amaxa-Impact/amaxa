import React, { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";
import Guides from "./_components/GuideCard";

export default function Page() {
  void api.actionGuides.getActionGuides.prefetch({});
  return (
    <div>
      <HydrateClient>
        <Suspense fallback="loading">
          <Guides />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
