"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@amaxa/ui/card";

import { api } from "~/trpc/react";

export function ProjectCards() {
  const [data] = api.projects.findAll.useSuspenseQuery({});

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
      {data.map((project) => {
        return (
          <Link key={project.id} href={`/project/${project.id}`}>
            <Card className="col-span-1 row-span-1 bg-secondary/10 transition-transform duration-200">
              <CardContent className="py-5">
                <Image
                  src={project.image ?? ""}
                  width={1000}
                  height={500}
                  alt={String(project.id)}
                />
              </CardContent>
              <CardFooter className="justify-center text-center font-bold md:text-2xl">
                {project.name}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
