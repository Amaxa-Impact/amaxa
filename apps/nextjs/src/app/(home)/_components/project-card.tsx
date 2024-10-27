import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@amaxa/ui/card";

export function ProjectCard({
  project,
  isPending = false,
  message = "",
}: {
  project?: {
    id: string;
    image: string | null;
    name: string;
  };
  isPending?: boolean;
  message?: string;
}) {
  if (isPending) {
    return (
      <Card className="col-span-1 row-span-1 flex h-[500px] w-[500px] flex-col items-center justify-center border-dashed bg-secondary/10 transition-transform duration-200">
        <CardContent>{message}</CardContent>
      </Card>
    );
  }

  if (!project) return null;
  return (
    <Link href={`/project/${project.id}`}>
      <Card className="w-min-[500px] col-span-1 row-span-1 flex h-[500px] flex-col rounded-xl bg-secondary/10 transition-transform duration-200">
        <CardContent className="relative h-5/6 w-full py-5">
          <Image
            src={project.image ?? "/placeholder.svg"}
            className="w-full"
            fill
            alt={String(project.id)}
          />
        </CardContent>
        <CardFooter className="h-1/6 w-full justify-center text-center font-bold md:text-2xl">
          {project.name}
        </CardFooter>
      </Card>
    </Link>
  );
}
