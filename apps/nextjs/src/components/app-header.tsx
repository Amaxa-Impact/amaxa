import React, { Suspense } from "react";

import SearchBar from "~/app/(dashboard)/project/[id]/(root)/_components/search";
import { UserMenu } from "./UserMenu";

export const AppHeader = () => {
  return (
    <div className="w-max-screen  relative hidden h-[54px] flex-row items-center justify-between bg-secondary/40 px-10 md:flex lg:px-8">
      <SearchBar />

      <div className="flex flex-row items-center justify-evenly gap-4">
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>
    </div>
  );
};
