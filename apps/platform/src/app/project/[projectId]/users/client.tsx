"use client";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDashboardContext } from "@/components/dashboard/context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getUserDisplayName,
  type UserOption,
} from "@/components/ui/user-dropdown";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { User } from "@/lib/workos";
import { AddUserForm } from "../_components/add-user-form";

export function UsersPageContent({ allUsers }: { allUsers: User }) {
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

  const handleRemoveUser = async (userId: string) => {
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
          toast.error(
            `Failed to remove user: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    });
  };

  const handleUpdateRole = async (userId: string, role: "coach" | "member") => {
    try {
      await updateRole({ userId, projectId, role });
    } catch (error) {
      toast.error(
        `Failed to update role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-3xl">Project Users</h1>
          <p className="text-muted-foreground">
            Manage users and their roles in this project. Your role:{" "}
            <strong>{userRole || "None"}</strong>
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
              existingUserIds={existingUserIds}
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
                        const workosUser = allUsers.find(
                          (u) => u.id === user.userId
                        );
                        return workosUser
                          ? getUserDisplayName(workosUser as UserOption)
                          : user.userId;
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
                            e.target.value as "coach" | "member"
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
