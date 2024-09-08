"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@amaxa/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { TableBody, TableCell, TableRow } from "@amaxa/ui/table";

import { api } from "~/trpc/react";

export const PermissionsRows = ({ id }: { id: string }) => {
  const [users] = api.users.findUsersForProject.useSuspenseQuery({
    projectId: id,
  });
  return (
    <TableBody>
      {users.map((user) => (
        <TableRow>
          <TableCell>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
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
            <Select defaultValue={user.role}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">User</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
