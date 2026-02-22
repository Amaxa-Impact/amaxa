import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "./test.setup";

describe("project templates", () => {
  it("creates a project from a template with dependencies", async () => {
    const t = convexTest(schema, modules);
    const asUser = t.withIdentity({ subject: "template_user" });

    const { templateId, workspaceSlug } = await t.run(async (ctx) => {
      const workspaceId = await ctx.db.insert("workspaces", {
        name: "Template Workspace",
        slug: "template-workspace",
        createdBy: "template_user",
        createdAt: Date.now(),
      });

      await ctx.db.insert("workspaceToUser", {
        workspaceId,
        userId: "template_user",
        role: "admin",
      });

      const templateId = await ctx.db.insert("projectTemplates", {
        name: "Onboarding Template",
        description: "Template for onboarding projects",
        createdBy: "template_user",
        isPublic: true,
        workspaceId,
      });

      const firstTaskId = await ctx.db.insert("templateTasks", {
        templateId,
        label: "Kickoff",
        status: "todo",
        priority: "medium",
        position: { x: 100, y: 100 },
        dependencies: [],
      });

      await ctx.db.insert("templateTasks", {
        templateId,
        label: "Scope",
        status: "todo",
        priority: "high",
        position: { x: 340, y: 120 },
        dependencies: [firstTaskId],
      });

      return { templateId, workspaceSlug: "template-workspace" };
    });

    const projectId = await asUser.mutation(api.projects.createFromTemplate, {
      workspaceSlug,
      templateId,
      name: "New Project",
      description: "Created from template",
    });

    const projectTasks = await t.run(async (ctx) => {
      return await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", projectId))
        .collect();
    });

    expect(projectTasks).toHaveLength(2);

    const projectEdges = await t.run(async (ctx) => {
      return await ctx.db
        .query("edges")
        .withIndex("by_project", (q) => q.eq("projectId", projectId))
        .collect();
    });

    expect(projectEdges).toHaveLength(1);
    expect(projectEdges[0].source).not.toBe(projectEdges[0].target);
  });

  it("creates a template from an existing project", async () => {
    const t = convexTest(schema, modules);
    const asCoach = t.withIdentity({ subject: "coach_user" });

    const projectId = await t.run(async (ctx) => {
      const workspaceId = await ctx.db.insert("workspaces", {
        name: "Coach Workspace",
        slug: "coach-workspace",
        createdBy: "coach_user",
        createdAt: Date.now(),
      });

      await ctx.db.insert("workspaceToUser", {
        workspaceId,
        userId: "coach_user",
        role: "admin",
      });

      const projectId = await ctx.db.insert("projects", {
        name: "Source Project",
        description: "Project to convert into template",
        workspaceId,
      });

      await ctx.db.insert("userToProject", {
        workspaceId,
        userId: "coach_user",
        projectId,
        role: "coach",
      });

      const discoveryTaskId = await ctx.db.insert("tasks", {
        projectId,
        label: "Discovery",
        status: "todo",
        priority: "medium",
      });

      const executionTaskId = await ctx.db.insert("tasks", {
        projectId,
        label: "Execution",
        status: "todo",
        priority: "high",
      });

      await ctx.db.insert("taskNodes", {
        taskId: discoveryTaskId,
        projectId,
        type: "task",
        position: { x: 120, y: 100 },
      });

      await ctx.db.insert("taskNodes", {
        taskId: executionTaskId,
        projectId,
        type: "task",
        position: { x: 380, y: 120 },
      });

      await ctx.db.insert("edges", {
        projectId,
        source: discoveryTaskId,
        target: executionTaskId,
        type: "smoothstep",
      });

      return projectId;
    });

    const templateId = await asCoach.mutation(
      api.projectTemplates.createFromProject,
      {
        projectId,
        name: "Copied Template",
        description: "Template copied from project",
        isPublic: true,
      },
    );

    const template = await t.run(async (ctx) => {
      return await ctx.db.get(templateId);
    });

    expect(template).not.toBeNull();
    expect(template?.name).toBe("Copied Template");

    const templateTasks = await t.run(async (ctx) => {
      return await ctx.db
        .query("templateTasks")
        .withIndex("by_templateId", (q) => q.eq("templateId", templateId))
        .collect();
    });

    expect(templateTasks).toHaveLength(2);

    const taskWithDependency = templateTasks.find(
      (task) => task.dependencies.length === 1,
    );
    expect(taskWithDependency).toBeDefined();
  });
});
