"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDashboardContext } from "@/components/dashboard/context";
import { useMutation } from "convex/react";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { alertDialog } from "@amaxa/ui/alert-dialog-simple";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";

export default function SettingsPageClient() {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();
  const { project, userRole } = useDashboardContext();
  const isCoach = userRole === "coach";

  const updateProject = useMutation(api.projects.update);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project.name || project.description) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  const handleSave = async () => {
    if (!isCoach) {
      alertDialog({
        title: "Access Denied",
        description: "Only coaches can edit project settings",
        variant: "default",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProject({
        projectId,
        name: name.trim(),
        description: description.trim(),
      });
      alertDialog({
        title: "Success",
        description: "Project settings saved successfully!",
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alertDialog({
        title: "Error",
        description: `Failed to save: ${message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isCoach) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Only coaches can access project settings.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground">
          Manage project name and description. Only coaches can edit these
          settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Update the project name and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Project Name
            </label>
            <Input
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              value={name}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="min-h-25 w-full rounded-md border px-3 py-2"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              value={description}
            />
          </div>
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
