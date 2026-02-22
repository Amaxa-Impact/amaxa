"use client";

import type { Preloaded } from "convex/react";
import Link from "next/link";
import { CreateTemplateDialog } from "@/components/templates/create-template-dialog";
import { useWorkspace } from "@/components/workspace/context";
import { useMutation, usePreloadedQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

import { AdminContainer } from "../_components/admin-container";

export function WorkspaceTemplatesClient({
  workspaceSlug,
  preloadedWorkspaceTemplates,
  preloadedGlobalTemplates,
}: {
  workspaceSlug: string;
  preloadedWorkspaceTemplates: Preloaded<
    typeof api.projectTemplates.listForWorkspace
  >;
  preloadedGlobalTemplates: Preloaded<typeof api.projectTemplates.listGlobal>;
}) {
  const { workspace } = useWorkspace();
  const duplicateTemplate = useMutation(api.projectTemplates.duplicate);

  const workspaceTemplates = usePreloadedQuery(preloadedWorkspaceTemplates);
  const globalTemplates = usePreloadedQuery(preloadedGlobalTemplates);

  const handleCopyToWorkspace = async (templateId: Id<"projectTemplates">) => {
    try {
      await duplicateTemplate({
        templateId,
        workspaceSlug,
      });
      toast.success("Template copied to workspace");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to copy template",
      );
    }
  };

  const globalOnlyTemplates = globalTemplates.filter(
    (template) => template.workspaceId === null,
  );

  return (
    <AdminContainer
      title="Templates"
      description={`Project templates for ${workspace.name}`}
      actions={<CreateTemplateDialog workspaceSlug={workspaceSlug} />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Workspace Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Visibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaceTemplates.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-muted-foreground py-8 text-center"
                    colSpan={3}
                  >
                    No workspace templates yet.
                  </TableCell>
                </TableRow>
              ) : (
                workspaceTemplates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">
                      <Link
                        className="hover:text-primary transition-colors"
                        href={`/${workspaceSlug}/admin/templates/${template._id}`}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Global Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {globalOnlyTemplates.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-muted-foreground py-8 text-center"
                    colSpan={3}
                  >
                    No global templates available.
                  </TableCell>
                </TableRow>
              ) : (
                globalOnlyTemplates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {template.description ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => void handleCopyToWorkspace(template._id)}
                        size="sm"
                        variant="outline"
                      >
                        Copy to Workspace
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminContainer>
  );
}
