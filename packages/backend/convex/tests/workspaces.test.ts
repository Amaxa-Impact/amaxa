import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "./test.setup";

describe("workspaces", () => {
  describe("create", () => {
    it("should create a workspace with valid slug", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "user_123" });

      const workspaceId = await asUser.mutation(api.workspaces.create, {
        name: "Test Workspace",
        slug: "test-workspace",
      });

      expect(workspaceId).toBeDefined();

      const workspace = await t.run(async (ctx) => {
        return await ctx.db.get(workspaceId);
      });

      expect(workspace).not.toBeNull();
      expect(workspace?.name).toBe("Test Workspace");
      expect(workspace?.slug).toBe("test-workspace");
      expect(workspace?.createdBy).toBe("user_123");
    });

    it("should auto-add creator as owner", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "user_456" });

      const workspaceId = await asUser.mutation(api.workspaces.create, {
        name: "Test",
        slug: "test-owner",
      });

      const membership = await t.run(async (ctx) => {
        return await ctx.db
          .query("workspaceToUser")
          .withIndex("by_userId_and_workspaceId", (q) =>
            q.eq("userId", "user_456").eq("workspaceId", workspaceId),
          )
          .unique();
      });

      expect(membership).not.toBeNull();
      expect(membership?.role).toBe("owner");
    });

    it("should reject invalid slug format", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "user_123" });

      await expect(
        asUser.mutation(api.workspaces.create, { name: "Test", slug: "AB" }),
      ).rejects.toThrow();
    });

    it("should reject reserved slugs", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "user_123" });

      await expect(
        asUser.mutation(api.workspaces.create, { name: "Test", slug: "admin" }),
      ).rejects.toThrow(/reserved/i);
    });

    it("should reject duplicate slugs", async () => {
      const t = convexTest(schema, modules);
      const asUser1 = t.withIdentity({ subject: "user_123" });
      const asUser2 = t.withIdentity({ subject: "user_456" });

      await asUser1.mutation(api.workspaces.create, {
        name: "First",
        slug: "duplicate-slug",
      });

      await expect(
        asUser2.mutation(api.workspaces.create, {
          name: "Second",
          slug: "duplicate-slug",
        }),
      ).rejects.toThrow(/already exists/i);
    });

    it("should require authentication", async () => {
      const t = convexTest(schema, modules);

      await expect(
        t.mutation(api.workspaces.create, { name: "Test", slug: "test" }),
      ).rejects.toThrow(/not authenticated/i);
    });
  });

  describe("get", () => {
    it("should return workspace for member", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "get-test",
      });

      const workspace = await asOwner.query(api.workspaces.get, {
        workspaceId,
      });

      expect(workspace).not.toBeNull();
      expect(workspace?.name).toBe("Test");
    });

    it("should deny access to non-members", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asOther = t.withIdentity({ subject: "other_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Private",
        slug: "private-ws",
      });

      await expect(
        asOther.query(api.workspaces.get, { workspaceId }),
      ).rejects.toThrow(/access/i);
    });

    it("should allow site admin access", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asAdmin = t.withIdentity({ subject: "admin_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "admin-access",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "admin_user",
          role: "admin",
        });
      });

      const workspace = await asAdmin.query(api.workspaces.get, {
        workspaceId,
      });

      expect(workspace).not.toBeNull();
    });
  });

  describe("update", () => {
    it("should allow admin to update name", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Original",
        slug: "update-test",
      });

      await asOwner.mutation(api.workspaces.update, {
        workspaceId,
        name: "Updated",
      });

      const workspace = await asOwner.query(api.workspaces.get, {
        workspaceId,
      });

      expect(workspace?.name).toBe("Updated");
    });

    it("should deny members from updating", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asMember = t.withIdentity({ subject: "member_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "member-update",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "member_user",
          role: "member",
        });
      });

      await expect(
        asMember.mutation(api.workspaces.update, {
          workspaceId,
          name: "Hacked",
        }),
      ).rejects.toThrow(/admin/i);
    });
  });

  describe("remove", () => {
    it("should soft delete workspace", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "To Delete",
        slug: "delete-test",
      });

      await asOwner.mutation(api.workspaces.remove, { workspaceId });

      const workspace = await t.run(async (ctx) => {
        return await ctx.db.get(workspaceId);
      });

      expect(workspace).not.toBeNull();
      expect(workspace?.deletedAt).toBeDefined();

      const result = await asOwner.query(api.workspaces.get, { workspaceId });

      expect(result).toBeNull();
    });

    it("should only allow owner to delete", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asAdmin = t.withIdentity({ subject: "admin_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Protected",
        slug: "owner-only-delete",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "admin_user",
          role: "admin",
        });
      });

      await expect(
        asAdmin.mutation(api.workspaces.remove, { workspaceId }),
      ).rejects.toThrow(/owner/i);
    });
  });

  describe("listForUser", () => {
    it("should return only user's workspaces", async () => {
      const t = convexTest(schema, modules);
      const asUser1 = t.withIdentity({ subject: "user_1" });
      const asUser2 = t.withIdentity({ subject: "user_2" });

      await asUser1.mutation(api.workspaces.create, {
        name: "User1 WS",
        slug: "user1-ws",
      });

      await asUser2.mutation(api.workspaces.create, {
        name: "User2 WS",
        slug: "user2-ws",
      });

      const workspaces = await asUser1.query(api.workspaces.listForUser);

      expect(workspaces).toHaveLength(1);
      expect(workspaces[0].workspace.name).toBe("User1 WS");
      expect(workspaces[0].role).toBe("owner");
    });
  });

  describe("checkSlugAvailable", () => {
    it("should return available for new slug", async () => {
      const t = convexTest(schema, modules);

      const result = await t.query(api.workspaces.checkSlugAvailable, {
        slug: "available-slug",
      });

      expect(result.available).toBe(true);
    });

    it("should return unavailable for taken slug", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "user_123" });

      await asUser.mutation(api.workspaces.create, {
        name: "Taken",
        slug: "taken-slug",
      });

      const result = await t.query(api.workspaces.checkSlugAvailable, {
        slug: "taken-slug",
      });

      expect(result.available).toBe(false);
    });

    it("should return error for invalid format", async () => {
      const t = convexTest(schema, modules);

      const result = await t.query(api.workspaces.checkSlugAvailable, {
        slug: "INVALID",
      });

      expect(result.available).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("rate limiting", () => {
    it("should allow creating 5 workspaces", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "rate_limit_user" });

      for (let i = 0; i < 5; i++) {
        const workspaceId = await asUser.mutation(api.workspaces.create, {
          name: `Rate Test WS ${i}`,
          slug: `rate-test-${i}`,
        });
        expect(workspaceId).toBeDefined();
      }
    });

    it("should reject 6th workspace creation within hour", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "rate_user" });

      for (let i = 0; i < 5; i++) {
        await asUser.mutation(api.workspaces.create, {
          name: `Rate Limit ${i}`,
          slug: `rate-limit-${i}`,
        });
      }

      await expect(
        asUser.mutation(api.workspaces.create, {
          name: "Too Many",
          slug: "too-many",
        }),
      ).rejects.toThrow();
    });

    it("should include error code in rate limit error", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "error_code_user" });

      for (let i = 0; i < 5; i++) {
        await asUser.mutation(api.workspaces.create, {
          name: `Error Code ${i}`,
          slug: `error-code-${i}`,
        });
      }

      await expect(
        asUser.mutation(api.workspaces.create, {
          name: "Fail",
          slug: "fail-slug",
        }),
      ).rejects.toThrow(/rate/i);
    });

    it("should bypass rate limit for site admin", async () => {
      const t = convexTest(schema, modules);
      const asAdmin = t.withIdentity({ subject: "site_admin_user" });
      const asRegularUser = t.withIdentity({ subject: "admin_user" });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin_user",
          role: "admin",
        });
      });

      for (let i = 0; i < 5; i++) {
        await asRegularUser.mutation(api.workspaces.create, {
          name: `Admin WS ${i}`,
          slug: `admin-ws-${i}`,
        });
      }

      const workspaceId = await asAdmin.mutation(api.workspaces.create, {
        name: "Admin Extra",
        slug: "admin-extra",
      });

      expect(workspaceId).toBeDefined();
    });

    it("should allow creating after rate limit window expires", async () => {
      const t = convexTest(schema, modules);
      const asUser = t.withIdentity({ subject: "window_user" });

      for (let i = 0; i < 5; i++) {
        await asUser.mutation(api.workspaces.create, {
          name: `Window Test ${i}`,
          slug: `window-test-${i}`,
        });
      }

      await expect(
        asUser.mutation(api.workspaces.create, {
          name: "Blocked",
          slug: "blocked-slug",
        }),
      ).rejects.toThrow();

      await t.run(async (ctx) => {
        const rateLimit = await ctx.db
          .query("rateLimits")
          .withIndex("by_userId_and_action", (q) =>
            q.eq("userId", "window_user").eq("action", "workspaceCreate"),
          )
          .unique();

        if (rateLimit) {
          await ctx.db.patch(rateLimit._id, {
            windowStart: Date.now() - 7200000,
          });
        }
      });

      const workspaceId = await asUser.mutation(api.workspaces.create, {
        name: "After Window",
        slug: "after-window",
      });

      expect(workspaceId).toBeDefined();
    });
  });
});
