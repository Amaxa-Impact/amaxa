"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplateEditor } from "@/components/templates/template-editor";
import { IconArrowLeft, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Switch } from "@amaxa/ui/switch";
import { Textarea } from "@amaxa/ui/textarea";

export function WorkspaceTemplateEditorClient({
  workspaceSlug,
  templateId,
}: {
  workspaceSlug: string;
  templateId: Id<"projectTemplates">;
}) {
  const router = useRouter();

  const templateResponse = useQuery(api.projectTemplates.get, {
    templateId,
  });
  const updateTemplate = useMutation(api.projectTemplates.update);
  const deleteTemplate = useMutation(api.projectTemplates.remove);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!templateResponse) {
      return;
    }

    setName(templateResponse.template.name);
    setDescription(templateResponse.template.description ?? "");
    setIsPublic(templateResponse.template.isPublic);
  }, [templateResponse]);

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    try {
      const payload: {
        templateId: Id<"projectTemplates">;
        name: string;
        description?: string;
        isPublic: boolean;
      } = {
        templateId,
        name: name.trim(),
        isPublic,
      };

      const normalizedDescription = description.trim();
      if (normalizedDescription !== "") {
        payload.description = normalizedDescription;
      }

      await updateTemplate(payload);
      toast.success("Template updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update template",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    setIsDeleting(true);
    try {
      await deleteTemplate({ templateId });
      toast.success("Template deleted");
      router.push(`/${workspaceSlug}/admin/templates`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete template",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (templateResponse === undefined) {
    return (
      <div className="text-muted-foreground p-6 text-sm">
        Loading template...
      </div>
    );
  }

  if (templateResponse === null) {
    return (
      <div className="text-muted-foreground p-6 text-sm">
        Template not found.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <Button
            nativeButton={false}
            render={<Link href={`/${workspaceSlug}/admin/templates`} />}
            size="sm"
            variant="ghost"
          >
            <IconArrowLeft className="size-4" />
            Back to Templates
          </Button>
          <h1 className="text-2xl font-semibold">Template Editor</h1>
        </div>

        <Button
          isLoading={isDeleting}
          onClick={() => void handleDeleteTemplate()}
          variant="destructive"
        >
          <IconTrash className="size-4" />
          Delete Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="workspace-template-name"
            >
              Name
            </label>
            <Input
              id="workspace-template-name"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="workspace-template-description"
            >
              Description
            </label>
            <Textarea
              id="workspace-template-description"
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              value={description}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Visible in project creation</p>
              <p className="text-muted-foreground text-xs">
                Public templates can be used when creating new projects.
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <Button
            isLoading={isSaving}
            onClick={() => void handleSaveTemplate()}
          >
            Save Template Settings
          </Button>
        </CardContent>
      </Card>

      <TemplateEditor templateId={templateId} />
    </div>
  );
}
