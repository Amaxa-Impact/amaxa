"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { IconTemplate } from "@tabler/icons-react";
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

export function SaveAsTemplateDialog({
  projectId,
  trigger,
}: {
  projectId: Id<"projects">;
  trigger?: ReactElement;
}) {
  const createFromProject = useMutation(api.projectTemplates.createFromProject);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAsTemplate = async () => {
    if (name.trim() === "") {
      toast.error("Template name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: {
        projectId: Id<"projects">;
        name: string;
        description?: string;
        isPublic?: boolean;
      } = {
        projectId,
        name: name.trim(),
        isPublic,
      };

      const normalizedDescription = description.trim();
      if (normalizedDescription !== "") {
        payload.description = normalizedDescription;
      }

      await createFromProject(payload);
      toast.success("Project saved as template");
      setOpen(false);
      setName("");
      setDescription("");
      setIsPublic(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save project as template",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" variant="outline">
              <IconTemplate className="size-4" />
              Save as Template
            </Button>
          )
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Project as Template</DialogTitle>
          <DialogDescription>
            Capture this project structure so it can be reused later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="save-template-name">
              Template Name
            </label>
            <Input
              id="save-template-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Program kickoff template"
              value={name}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="save-template-description"
            >
              Description
            </label>
            <Textarea
              id="save-template-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tasks and dependencies for program kickoff"
              rows={4}
              value={description}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <p className="text-sm font-medium">Visible in project creation</p>
              <p className="text-muted-foreground text-xs">
                Enable this template for new project setup.
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
            onClick={() => void handleSaveAsTemplate()}
          >
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
