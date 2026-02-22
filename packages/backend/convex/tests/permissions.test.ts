import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "../_generated/api";
import schema from "../schema";
import { modules } from "./test.setup";

describe("workspace permissions", () => {
  describe("site admin bypass", () => {
    it("should allow site admin to access any workspace", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asSiteAdmin = t.withIdentity({ subject: "site_admin" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Private WS",
        slug: "private-ws",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin",
          role: "admin",
        });
      });

      const workspace = await asSiteAdmin.query(api.workspaces.get, {
        workspaceId,
      });

      expect(workspace).not.toBeNull();
      expect(workspace?.name).toBe("Private WS");
    });

    it("should allow site admin to update any workspace", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asSiteAdmin = t.withIdentity({ subject: "site_admin" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Original",
        slug: "admin-update-test",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin",
          role: "admin",
        });
      });

      await asSiteAdmin.mutation(api.workspaces.update, {
        workspaceId,
        name: "Admin Updated",
      });

      const workspace = await asOwner.query(api.workspaces.get, {
        workspaceId,
      });

      expect(workspace?.name).toBe("Admin Updated");
    });

    it("should allow site admin to delete any workspace", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asSiteAdmin = t.withIdentity({ subject: "site_admin" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "To Delete",
        slug: "admin-delete-test",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin",
          role: "admin",
        });
      });

      await asSiteAdmin.mutation(api.workspaces.remove, { workspaceId });

      const workspace = await t.run(async (ctx) => {
        return await ctx.db.get(workspaceId);
      });

      expect(workspace?.deletedAt).toBeDefined();
    });
  });

  describe("workspace role hierarchy", () => {
    it("owner can add users", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "role-test-1",
      });

      const membershipId = await asOwner.mutation(api.workspaceToUser.addUser, {
        workspaceId,
        userId: "new_user",
        role: "member",
      });

      expect(membershipId).toBeDefined();
    });

    it("admin can add users", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asAdmin = t.withIdentity({ subject: "admin_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "role-test-2",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "admin_user",
          role: "admin",
        });
      });

      const membershipId = await asAdmin.mutation(api.workspaceToUser.addUser, {
        workspaceId,
        userId: "new_user",
        role: "member",
      });

      expect(membershipId).toBeDefined();
    });

    it("member cannot add users", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asMember = t.withIdentity({ subject: "member_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "role-test-3",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "member_user",
          role: "member",
        });
      });

      await expect(
        asMember.mutation(api.workspaceToUser.addUser, {
          workspaceId,
          userId: "new_user",
          role: "member",
        }),
      ).rejects.toThrow(/admin/i);
    });

    it("only owner can promote to owner", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asAdmin = t.withIdentity({ subject: "admin_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "promote-test",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "admin_user",
          role: "admin",
        });
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "member_user",
          role: "member",
        });
      });

      await expect(
        asAdmin.mutation(api.workspaceToUser.updateRole, {
          workspaceId,
          userId: "member_user",
          role: "owner",
        }),
      ).rejects.toThrow(/owner/i);

      await asOwner.mutation(api.workspaceToUser.updateRole, {
        workspaceId,
        userId: "member_user",
        role: "owner",
      });

      const membership = await t.run(async (ctx) => {
        return await ctx.db
          .query("workspaceToUser")
          .withIndex("by_userId_and_workspaceId", (q) =>
            q.eq("userId", "member_user").eq("workspaceId", workspaceId),
          )
          .unique();
      });

      expect(membership?.role).toBe("owner");
    });
  });

  describe("last owner protection", () => {
    it("cannot remove last owner", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asSiteAdmin = t.withIdentity({ subject: "site_admin" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "last-owner-1",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin",
          role: "admin",
        });
      });

      await expect(
        asSiteAdmin.mutation(api.workspaceToUser.removeUser, {
          workspaceId,
          userId: "owner_user",
        }),
      ).rejects.toThrow(/last owner/i);
    });

    it("cannot demote last owner", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asSiteAdmin = t.withIdentity({ subject: "site_admin" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "last-owner-2",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("siteUser", {
          userId: "site_admin",
          role: "admin",
        });
      });

      await expect(
        asSiteAdmin.mutation(api.workspaceToUser.updateRole, {
          workspaceId,
          userId: "owner_user",
          role: "admin",
        }),
      ).rejects.toThrow(/last owner/i);
    });

    it("owner cannot leave workspace", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "owner-leave",
      });

      await expect(
        asOwner.mutation(api.workspaceToUser.leaveWorkspace, { workspaceId }),
      ).rejects.toThrow(/owner.*leave/i);
    });
  });

  describe("ownership transfer", () => {
    it("should transfer ownership and demote previous owner", async () => {
      const t = convexTest(schema, modules);
      const asOriginalOwner = t.withIdentity({ subject: "original_owner" });

      const workspaceId = await asOriginalOwner.mutation(
        api.workspaces.create,
        {
          name: "Test",
          slug: "transfer-test",
        },
      );

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "new_owner",
          role: "admin",
        });
      });

      await asOriginalOwner.mutation(api.workspaceToUser.transferOwnership, {
        workspaceId,
        newOwnerId: "new_owner",
      });

      const originalOwnerMembership = await t.run(async (ctx) => {
        return await ctx.db
          .query("workspaceToUser")
          .withIndex("by_userId_and_workspaceId", (q) =>
            q.eq("userId", "original_owner").eq("workspaceId", workspaceId),
          )
          .unique();
      });

      const newOwnerMembership = await t.run(async (ctx) => {
        return await ctx.db
          .query("workspaceToUser")
          .withIndex("by_userId_and_workspaceId", (q) =>
            q.eq("userId", "new_owner").eq("workspaceId", workspaceId),
          )
          .unique();
      });

      expect(originalOwnerMembership?.role).toBe("admin");
      expect(newOwnerMembership?.role).toBe("owner");
    });

    it("non-owner cannot transfer ownership", async () => {
      const t = convexTest(schema, modules);
      const asOwner = t.withIdentity({ subject: "owner_user" });
      const asAdmin = t.withIdentity({ subject: "admin_user" });

      const workspaceId = await asOwner.mutation(api.workspaces.create, {
        name: "Test",
        slug: "no-transfer",
      });

      await t.run(async (ctx) => {
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "admin_user",
          role: "admin",
        });
        await ctx.db.insert("workspaceToUser", {
          workspaceId,
          userId: "member_user",
          role: "member",
        });
      });

      await expect(
        asAdmin.mutation(api.workspaceToUser.transferOwnership, {
          workspaceId,
          newOwnerId: "member_user",
        }),
      ).rejects.toThrow(/owner/i);
    });
  });
});
