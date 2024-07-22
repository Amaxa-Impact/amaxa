import { api } from "~/trpc/server";
import { Flowchart } from "./_components/flowchart";

export default async function Page({
  params,
}: {
  params: { id: string; };
}) {
  const { id } = params;

  console.log("id" + id);
  const data = await api.tasks.getProjectTasks({
    projectId: id,
  });

  console.log("init" + data.tasks);
  const tasks = data?.tasks.length === 0 ? undefined : data.tasks;
  const edges = data?.edges.length === 0 ? undefined : data.edges;
  console.log(tasks, edges);

  return (
    <div>
      <Flowchart tasksInit={tasks} edgesInit={edges} />
    </div>
  );
}

export const dynamic = "force-dynamic";
