"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@amaxa/ui/avatar";
import { TableCell, TableRow } from "@amaxa/ui/table";

import { api } from "~/trpc/react";
import { UpdateRole } from "./update-role-optimistic";

import { useSuspenseQuery } from "@tanstack/react-query";

export const PermissionsRows = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const { data: users } = useSuspenseQuery(
    api.users.findUsersForProject.queryOptions({
      projectId: id,
    }),
  );
  if (!users) {
    return (
      <div className="flex flex-col items-center justify-center text-3xl font-semibold">
        No Users
      </div>
    );
  }
  return (
    <>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <UpdateRole userId={user.id} projectId={id} roles={user.role} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
