/**
 * React Flow Integration Example
 *
 * This file demonstrates how to integrate the Convex backend with React Flow
 * on the frontend. It shows the data flow and structure expected.
 */

import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

/**
 * Example: Sync React Flow state to Convex
 *
 * This mutation shows how to sync the entire React Flow state (nodes and edges)
 * from the frontend to Convex. This is useful for bulk updates or initial saves.
 */
export const syncReactFlowState = mutation({
  args: {
    projectId: v.id("projects"),
    nodes: v.array(
      v.object({
        id: v.optional(v.string()), // Will be generated if not provided
        type: v.string(),
        position: v.object({
          x: v.number(),
          y: v.number(),
        }),
        data: v.object({
          label: v.string(),
          description: v.optional(v.string()),
          status: v.optional(
            v.union(
              v.literal("todo"),
              v.literal("in_progress"),
              v.literal("completed"),
              v.literal("blocked")
            )
          ),
          assignedTo: v.optional(v.string()),
          dueDate: v.optional(v.number()),
          priority: v.optional(
            v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
          ),
        }),
      })
    ),
    edges: v.array(
      v.object({
        source: v.string(),
        target: v.string(),
        type: v.string(),
        sourceHandle: v.optional(v.string()),
        targetHandle: v.optional(v.string()),
        label: v.optional(v.string()),
        animated: v.optional(v.boolean()),
      })
    ),
  },
  returns: v.object({
    nodeIds: v.array(v.id("tasks")),
    edgeIds: v.array(v.id("edges")),
  }),
  handler: async (ctx, args) => {
    // Create all nodes first
    const nodeIds: Id<"tasks">[] = [];
    const oldToNewIdMap: Record<string, Id<"tasks">> = {};

    for (const node of args.nodes) {
      // Create the task with core data
      const taskId = await ctx.db.insert("tasks", {
        projectId: args.projectId,
        label: node.data.label,
        description: node.data.description,
        status: node.data.status,
        assignedTo: node.data.assignedTo,
        dueDate: node.data.dueDate,
        priority: node.data.priority,
      });

      // Create the task node with visual properties
      await ctx.db.insert("taskNodes", {
        taskId,
        projectId: args.projectId,
        type: node.type,
        position: node.position,
      });

      nodeIds.push(taskId);

      if (node.id) {
        oldToNewIdMap[node.id] = taskId;
      }
    }

    // Create all edges, mapping old IDs to new IDs
    const edgeIds: Id<"edges">[] = [];
    for (const edge of args.edges) {
      // Map frontend IDs to Convex IDs
      const sourceId =
        oldToNewIdMap[edge.source] || (edge.source as Id<"tasks">);
      const targetId =
        oldToNewIdMap[edge.target] || (edge.target as Id<"tasks">);

      const edgeId = await ctx.db.insert("edges", {
        projectId: args.projectId,
        source: sourceId,
        target: targetId,
        type: edge.type,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
        animated: edge.animated,
      });
      edgeIds.push(edgeId);
    }

    return { nodeIds, edgeIds };
  },
});

/**
 * Example: Handle React Flow node drag
 *
 * This mutation is called when a user drags a node in React Flow.
 * It updates only the position for better performance.
 */
export const handleNodeDrag = mutation({
  args: {
    nodeId: v.id("tasks"),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.nodeId))
      .unique();

    if (node) {
      await ctx.db.patch(node._id, {
        position: args.position,
      });
    }
    return null;
  },
});

/**
 * Example: Handle React Flow edge connection
 *
 * This mutation is called when a user connects two nodes in React Flow.
 */
export const handleConnect = mutation({
  args: {
    projectId: v.id("projects"),
    source: v.id("tasks"),
    target: v.id("tasks"),
    sourceHandle: v.optional(v.string()),
    targetHandle: v.optional(v.string()),
  },
  returns: v.id("edges"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("edges", {
      projectId: args.projectId,
      source: args.source,
      target: args.target,
      sourceHandle: args.sourceHandle,
      targetHandle: args.targetHandle,
      type: "default",
    });
  },
});

/**
 * Example: Handle React Flow edge deletion
 *
 * This mutation is called when a user deletes an edge in React Flow.
 */
export const handleEdgeDelete = mutation({
  args: {
    edgeId: v.id("edges"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.edgeId);
    return null;
  },
});

/**
 * Example: Handle React Flow node deletion
 *
 * This mutation is called when a user deletes a node in React Flow.
 * It also deletes all connected edges and the task node.
 */
export const handleNodeDelete = mutation({
  args: {
    nodeId: v.id("tasks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Delete connected edges
    const outgoingEdges = await ctx.db
      .query("edges")
      .withIndex("by_source", (q) => q.eq("source", args.nodeId))
      .collect();

    const incomingEdges = await ctx.db
      .query("edges")
      .withIndex("by_target", (q) => q.eq("target", args.nodeId))
      .collect();

    for (const edge of [...outgoingEdges, ...incomingEdges]) {
      await ctx.db.delete(edge._id);
    }

    // Delete the task node
    const node = await ctx.db
      .query("taskNodes")
      .withIndex("by_task", (q) => q.eq("taskId", args.nodeId))
      .unique();

    if (node) {
      await ctx.db.delete(node._id);
    }

    // Delete the task
    await ctx.db.delete(args.nodeId);
    return null;
  },
});

/*
 * FRONTEND INTEGRATION EXAMPLE (React/TypeScript)
 *
 * This is pseudocode showing how to use these functions in your React Flow component:
 *
 * ```typescript
 * import ReactFlow, {
 *   useNodesState,
 *   useEdgesState,
 *   addEdge,
 *   Connection,
 *   Edge,
 *   NodeChange,
 *   EdgeChange
 * } from '@xyflow/react';
 * import { useQuery, useMutation } from 'convex/react';
 * import { api } from '../convex/_generated/api';
 *
 * function FlowChart({ projectId }: { projectId: string }) {
 *   // Load nodes and edges from Convex
 *   const convexNodes = useQuery(api.tasks.listForProject, { projectId });
 *   const convexEdges = useQuery(api.edges.listForProject, { projectId });
 *
 *   // Mutations
 *   const updatePosition = useMutation(api.tasks.updatePosition);
 *   const createEdge = useMutation(api.edges.create);
 *   const deleteEdge = useMutation(api.edges.remove);
 *   const deleteTask = useMutation(api.tasks.remove);
 *
 *   // Local state for React Flow
 *   const [nodes, setNodes, onNodesChange] = useNodesState(convexNodes || []);
 *   const [edges, setEdges, onEdgesChange] = useEdgesState(convexEdges || []);
 *
 *   // Sync Convex data to local state
 *   useEffect(() => {
 *     if (convexNodes) setNodes(convexNodes);
 *   }, [convexNodes]);
 *
 *   useEffect(() => {
 *     if (convexEdges) setEdges(convexEdges);
 *   }, [convexEdges]);
 *
 *   // Handle node drag end - save to Convex
 *   const handleNodeDragStop = useCallback(
 *     (event: React.MouseEvent, node: Node) => {
 *       updatePosition({
 *         taskId: node.id,
 *         position: node.position,
 *       });
 *     },
 *     [updatePosition]
 *   );
 *
 *   // Handle edge connection - save to Convex
 *   const onConnect = useCallback(
 *     (connection: Connection) => {
 *       createEdge({
 *         projectId,
 *         source: connection.source,
 *         target: connection.target,
 *         sourceHandle: connection.sourceHandle || undefined,
 *         targetHandle: connection.targetHandle || undefined,
 *       });
 *     },
 *     [createEdge, projectId]
 *   );
 *
 *   // Handle edge deletion - remove from Convex
 *   const onEdgesDelete = useCallback(
 *     (edges: Edge[]) => {
 *       edges.forEach((edge) => {
 *         deleteEdge({ edgeId: edge.id });
 *       });
 *     },
 *     [deleteEdge]
 *   );
 *
 *   // Handle node deletion - remove from Convex
 *   const onNodesDelete = useCallback(
 *     (nodes: Node[]) => {
 *       nodes.forEach((node) => {
 *         deleteTask({ taskId: node.id });
 *       });
 *     },
 *     [deleteTask]
 *   );
 *
 *   return (
 *     <ReactFlow
 *       nodes={nodes}
 *       edges={edges}
 *       onNodesChange={onNodesChange}
 *       onEdgesChange={onEdgesChange}
 *       onNodeDragStop={handleNodeDragStop}
 *       onConnect={onConnect}
 *       onEdgesDelete={onEdgesDelete}
 *       onNodesDelete={onNodesDelete}
 *       fitView
 *     >
 *       <Background />
 *       <Controls />
 *       <MiniMap />
 *     </ReactFlow>
 *   );
 * }
 * ```
 */
