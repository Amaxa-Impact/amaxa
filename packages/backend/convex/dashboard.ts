import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { assertUserInProject, requireAuth } from "./permissions";

const statusValidator = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("blocked")
);

/**
 * Get task status counts for charts - returns both all tasks and current user's tasks
 */
export const getTaskStatusCounts = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.object({
    allTasks: v.object({
      todo: v.number(),
      in_progress: v.number(),
      completed: v.number(),
      blocked: v.number(),
    }),
    userTasks: v.object({
      todo: v.number(),
      in_progress: v.number(),
      completed: v.number(),
      blocked: v.number(),
    }),
    totalAll: v.number(),
    totalUser: v.number(),
  }),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const allCounts = { todo: 0, in_progress: 0, completed: 0, blocked: 0 };
    const userCounts = { todo: 0, in_progress: 0, completed: 0, blocked: 0 };

    for (const task of tasks) {
      const status = task.status ?? "todo";

      allCounts[status]++;

      if (task.assignedTo === userId) {
        userCounts[status]++;
      }
    }

    return {
      allTasks: allCounts,
      userTasks: userCounts,
      totalAll: tasks.length,
      totalUser: tasks.filter((t) => t.assignedTo === userId).length,
    };
  },
});

/**
 * Get paginated tasks with optional filters
 */
export const listTasksPaginated = query({
  args: {
    projectId: v.id("projects"),
    status: v.optional(statusValidator),
    assignedTo: v.optional(v.string()),
    searchLabel: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    let tasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc");

    if (args.status || args.assignedTo) {
      tasksQuery = tasksQuery.filter((q) => {
        let condition = q.eq(q.field("projectId"), args.projectId);

        if (args.status) {
          condition = q.and(condition, q.eq(q.field("status"), args.status));
        }
        if (args.assignedTo) {
          condition = q.and(
            condition,
            q.eq(q.field("assignedTo"), args.assignedTo)
          );
        }

        return condition;
      });
    }

    const paginationResult = await tasksQuery.paginate(args.paginationOpts);

    let page = paginationResult.page;
    if (args.searchLabel) {
      page = page.filter((task) =>
        task.label
          ?.toLowerCase()
          .includes(args.searchLabel?.toLowerCase() ?? "")
      );
    }

    return {
      ...paginationResult,
      page: page.map((task) => ({
        _id: task._id,
        label: task.label,
        status: task.status ?? null,
        assignedTo: task.assignedTo ?? null,
        dueDate: task.dueDate ?? null,
        priority: task.priority ?? null,
      })),
    };
  },
});

/**
 * Get all users assigned to a project (for filter dropdown)
 */
export const getProjectUsers = query({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.array(
    v.object({
      userId: v.string(),
      role: v.union(v.literal("coach"), v.literal("member")),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    await assertUserInProject(ctx, userId, args.projectId);

    const assignments = await ctx.db
      .query("userToProject")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    return assignments.map((a) => ({
      userId: a.userId,
      role: a.role,
    }));
  },
});
