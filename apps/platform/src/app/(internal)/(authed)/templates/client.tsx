"use client";

import type { Preloaded } from "convex/react";
import Link from "next/link";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { usePreloadedQuery } from "convex/react";

import type { api as BackendApi } from "@amaxa/backend/_generated/api";
import { Badge } from "@amaxa/ui/badge";
import { Card } from "@amaxa/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

export function TemplatesPageClient({
  preloadedTemplates,
}: {
  preloadedTemplates: Preloaded<typeof BackendApi.projectTemplates.listGlobal>;
}) {
  const templates = usePreloadedQuery(preloadedTemplates);

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/95 border-border/50 sticky top-0 z-10 flex items-center justify-between border-b p-6 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold">Global Templates</h1>
          <p className="text-muted-foreground text-sm">
            Templates available across all workspaces.
          </p>
        </div>
        <CreateTemplateDialog />
      </div>

      <main className="flex-1 p-6">
        <Card className="overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-muted-foreground py-8 text-center"
                    colSpan={3}
                  >
                    No global templates yet.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">
                      <Link
                        className="hover:text-primary transition-colors"
                        href={`/templates/${template._id}`}
                      >
                        {template.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {template.description ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={template.isPublic ? "default" : "secondary"}
                      >
                        {template.isPublic ? "Public" : "Private"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
