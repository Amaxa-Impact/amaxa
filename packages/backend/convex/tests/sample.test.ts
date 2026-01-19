import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import schema from "../schema";
import { modules } from "./test.setup";

describe("sample test", () => {
  it("should create and retrieve a project", async () => {
    const t = convexTest(schema, modules);

    // Insert a project directly into the test database
    const projectId = await t.run(async (ctx) => {
      return await ctx.db.insert("projects", {
        name: "Test Project",
        description: "A test project for validation",
      });
    });

    // Retrieve and verify the project
    const project = await t.run(async (ctx) => {
      return await ctx.db.get(projectId);
    });

    expect(project).not.toBeNull();
    expect(project?.name).toBe("Test Project");
    expect(project?.description).toBe("A test project for validation");
  });

  it("should verify test infrastructure is working", async () => {
    const t = convexTest(schema, modules);

    // Simple assertion to verify vitest is working
    const result = await t.run(() => {
      return 1 + 1;
    });

    expect(result).toBe(2);
  });
});
