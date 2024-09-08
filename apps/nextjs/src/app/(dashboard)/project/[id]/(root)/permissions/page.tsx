import React, { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

import { api } from "~/trpc/server";
import { AddUser } from "./_components/add-user";
import { PermissionsRows } from "./_components/table";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  void api.users.findUsersForProject.prefetch({
    projectId: id,
  });
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <AddUser />
      </div>
      <div className="mx-auto w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user permissions for this project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <Suspense fallback={<p>loading</p>}>
                <PermissionsRows id={id} />
              </Suspense>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
