import React, { Suspense } from "react";
import Link from "next/link";

import { Button } from "@amaxa/ui/button";

import SearchBar from "~/app/(dashboard)/project/[id]/(root)/_components/search";
import { UserMenu } from "./UserMenu";

export const AppHeader = () => {
  return (
    <div className="w-max-screen  relative hidden h-[54px] flex-row items-center justify-between bg-secondary/40 px-10 md:flex lg:px-8">
      <SearchBar />

      <div className="flex flex-row items-center justify-evenly gap-4">
        <Button variant={"outline"}>Feedback</Button>
        <Link
          href={"/help"}
          className="text-muted-foreground hover:text-black dark:hover:text-white"
        >
          Help
        </Link>
        <Link
          href={"/docs"}
          className="text-muted-foreground hover:text-black dark:hover:text-white"
        >
          Docs
        </Link>
        <Suspense>
          <UserMenu />
        </Suspense>
      </div>
    </div>
  );
};
