"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { IconFilePlus } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import { Input } from "@amaxa/ui/input";
import { Switch } from "@amaxa/ui/switch";
import { Textarea } from "@amaxa/ui/textarea";

export function CreateTemplateDialog({
  workspaceSlug,
  onCreated,
  trigger,
}: {
  workspaceSlug?: string;
  onCreated?: (templateId: Id<"projectTemplates">) => void;
  trigger?: ReactElement;
}) {
  const createTemplate = useMutation(api.projectTemplates.create);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTemplate = async () => {
    if (name.trim() === "") {
      toast.error("Template name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: {
        name: string;
        isPublic: boolean;
        description?: string;
        workspaceSlug?: string;
      } = {
        name: name.trim(),
        isPublic,
      };

      const normalizedDescription = description.trim();
      if (normalizedDescription !== "") {
        payload.description = normalizedDescription;
      }

      if (workspaceSlug !== undefined) {
        payload.workspaceSlug = workspaceSlug;
      }

      const templateId = await createTemplate({
        ...payload,
      });

      toast.success("Template created");
      setOpen(false);
      setName("");
      setDescription("");
      setIsPublic(true);
      onCreated?.(templateId);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create template",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <IconFilePlus className="size-4" />
              New Template
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>
            Create a reusable template for future project scaffolding.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="create-template-name"
            >
              Template Name
            </label>
            <Input
              id="create-template-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Customer onboarding"
              value={name}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="create-template-description"
            >
              Description
            </label>
            <Textarea
              id="create-template-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Reusable tasks for onboarding a new client"
              rows={4}
              value={description}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Visible in project creation</p>
              <p className="text-muted-foreground text-xs">
                Public templates can be selected when creating projects.
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            isLoading={isSubmitting}
            onClick={() => void handleCreateTemplate()}
          >
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
