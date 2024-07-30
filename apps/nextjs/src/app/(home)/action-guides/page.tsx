import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { checkAuth, getUserAuth } from "@/server/auth";
import { api } from "@/trpc/server";
import { z } from "zod";
import Search from "@/components/Search";
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CreateProjects } from "@/components/CreateProjects";
import { FilterProject } from "./filters/project";
import { FilterSkill } from "./filters/skill";
import { CreateActionGuide } from "@/components/CreateActionGuide";


const searchParamsSchema = z.object({
  name: z.string().optional(),
  projectId: z.string().optional(),
  skillId: z.string().optional(),
});


export default async function Home(props: {

  searchParams: Record<string, string | string[] | undefined>;
}) {
  noStore();
  await checkAuth()
  const { session } = await getUserAuth()
  const { name, projectId, skillId } = searchParamsSchema.parse(props.searchParams);


  const data = await api.actionGuides.all.query({
    name: name,
    projectId: projectId ? parseInt(projectId) : undefined,
    skillId: skillId ? parseInt(skillId) : undefined
  })
  return (
    <div className="flex flex-col gap-10 p-20">
      <div className="flex flex-row justify-between">
        <Search />
        <div className="flex flex-row gap-3">
          <FilterProject />
          <FilterSkill />
          {
            session?.user.permissions.includes("add:action_guide") ? (
              <div>
                <CreateActionGuide />
              </div>
            ) : null
          }
        </div>

      </div>
      <div className="grid grid-rows-1 gap-10 md:grid-cols-2 md:grid-rows-2">
        {data.map((subject) => {
          return (
            <Link key={subject.id} href={`/action-guides/${subject.id}`}>
              <Card className=" col-span-1 row-span-1 bg-primary-foreground transition-transform duration-200 hover:scale-105 hover:bg-muted">
                <CardContent className="py-5 text-5xl font-bold">
                  {subject.name} Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.
                </CardContent>
                <CardFooter className="justify-center text-center font-bold md:text-2xl">
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );

}
