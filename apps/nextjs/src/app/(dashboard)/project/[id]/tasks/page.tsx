import { createId } from "@paralleldrive/cuid2";

import { EdgeType, NodeType } from "~/lib/types/flowcart";
import { api } from "~/trpc/server";
import { Flowchart } from "./_components/flowchart";
const rootNodeId = createId();
const child1NodeId = createId();
const child2NodeId = createId();

const initialNodes: NodeType[] = [
  {
    id: rootNodeId,
    data: {
      title: "Set Up Project",
      id: rootNodeId,
      status: "todo",
      assigne: {
        id: "system",
        name: "System",
        image:
          "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-operational-system-line-icon-vector-png-image_6691165.png",
      },
      assigneName: "System",
      projectId: "w93j0wvj4l5hkhh6550fpnll",
      parent: {
        id: rootNodeId,
      },
      doneBy: new Date(),
    },
    position: { x: 0, y: 0 },
    type: "task"
  },
];

const initialEdges: EdgeType[] = [

];

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const data = await api.tasks.getProjectTasks({
    projectId: id,
  });

  const tasks = data?.tasks.length === 0 ? initialNodes : data.tasks;
  const edges = data?.edges.length === 0 ? initialEdges : data.edges;
  console.log(tasks, edges);

  return (
    <div>
      <Flowchart tasksInit={tasks} edgesInit={edges} />
    </div>
  );
}

export const dynamic = "force-dynamic";
