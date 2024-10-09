/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";

import { api } from "~/trpc/react";
import CreateActionGuide from "./create-action-guide";

export default function Guides() {
  const [search, setSearch] = useState<string | null>();
  const { data: actionGuides } = api.actionGuides.getActionGuides.useQuery({
    title: search ?? undefined,
  });

  const filteredGuides = useMemo(() => {
    return actionGuides.filter((guide) => {
      const titleMatch =
        guide.title ?? "".toLowerCase().includes(search?.toLowerCase() ?? "");
      return titleMatch;
    });
  }, [search, actionGuides]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">Action Guides</h1>
      <div className="mb-6 flex flex-row justify-between">
        <Input
          placeholder="Search action guides..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
        <CreateActionGuide />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <Link href={`/guide/${guide.embedId}`} key={guide.id}>
            <Card className="h-[200px]">
              <CardHeader>
                <CardTitle>{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{guide.description}</p>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
