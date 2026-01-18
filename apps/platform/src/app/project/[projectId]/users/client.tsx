"use client";

import type { UserOption } from "@/components/user-dropdown";
import type { WorkOsError } from "@/lib/errors";
import type { User } from "@workos-inc/node";
import type { Result } from "better-result";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/context";
import { getUserDisplayName } from "@/components/user-dropdown";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { confirmDialog } from "@amaxa/ui/confirm-dialog";

import { AddUserForm } from "../_components/add-user-form";

export function UsersPageContent({
  allUsers,
}: {
  allUsers: Result<User[], WorkOsError>;
}) {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();
  const { userRole } = useDashboardContext();
  const isCoach = userRole === "coach";

  const existingUsers = useQuery(api.userToProjects.listUsersForProject, {
    projectId,
  });

  const removeUser = useMutation(api.userToProjects.remove);
  const updateRole = useMutation(api.userToProjects.updateRole);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const existingUserIds = existingUsers?.map((user) => user.userId);

  const handleRemoveUser = (userId: string) => {
    confirmDialog({
      title: "Remove User",
      description:
        "Are you sure you want to remove this user from the project?",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await removeUser({ userId, projectId });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to remove user: ${message}`);
        }
      },
    });
  };

  const handleUpdateRole = async (userId: string, role: "coach" | "member") => {
    try {
      await updateRole({ userId, projectId, role });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update role: ${message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Project Users</h1>
          <p className="text-muted-foreground">
            Manage users and their roles in this project. Your role:{" "}
            <strong>{userRole ?? "None"}</strong>
          </p>
        </div>

        {isCoach && (
          <>
            <div className="mb-6">
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                Add User
              </Button>
            </div>
            <AddUserForm
              allUsers={allUsers}
              existingUserIds={existingUserIds ?? []}
              onOpenChange={setIsAddUserDialogOpen}
              open={isAddUserDialogOpen}
              projectId={projectId}
            />
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users ({existingUsers?.length ?? 0})</CardTitle>
          <CardDescription>
            All users with access to this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {existingUsers?.length === 0 ? (
            <p className="text-muted-foreground">
              No users found in this project.
            </p>
          ) : (
            <div className="space-y-2">
              {existingUsers?.map((user) => (
                <div
                  className="flex items-center justify-between rounded-lg border p-4"
                  key={user._id}
                >
                  <div>
                    <p className="font-medium">
                      {(() => {
                        if (allUsers.status === "ok") {
                          const workosUser = allUsers.value.find(
                            (u) => u.id === user.userId,
                          );
                          return workosUser
                            ? getUserDisplayName(workosUser as UserOption)
                            : user.userId;
                        }
                        return user.userId;
                      })()}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Role: <span className="capitalize">{user.role}</span>
                    </p>
                  </div>
                  {isCoach && (
                    <div className="flex gap-2">
                      <select
                        className="rounded-md border px-3 py-2"
                        onChange={(e) =>
                          handleUpdateRole(
                            user.userId,
                            e.target.value as "coach" | "member",
                          )
                        }
                        value={user.role}
                      >
                        <option value="member">Member</option>
                        <option value="coach">Coach</option>
                      </select>
                      <Button
                        onClick={() => handleRemoveUser(user.userId)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
