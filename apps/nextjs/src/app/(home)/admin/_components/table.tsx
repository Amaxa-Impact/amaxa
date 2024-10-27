"use client";

import { useState } from "react";

import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

import { api } from "~/trpc/react";
import { UserEditForm } from "./form";

export function UserManagement() {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [users] = api.users.getUsers.useSuspenseQuery();
  const utils = api.useUtils();
  const deleteUser = api.users.deleteUser.useMutation({
    onSuccess: () => {
      utils.users.invalidate();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser.mutateAsync({ id });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isPublic ? "Yes" : "No"}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Dialog
                  open={editingUserId === user.id}
                  onOpenChange={(open) =>
                    setEditingUserId(open ? user.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <UserEditForm
                      user={user}
                      onSuccess={() => {
                        setEditingUserId(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="ml-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
