"use client";

import { useState } from "react";
import Link from "next/link";
import {
  blankTemplateValue,
  TemplateSelector,
} from "@/components/templates/template-selector";
import {
  IconDots,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
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
} from "@amaxa/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";
import { Input } from "@amaxa/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

interface ProjectsTableProps {
  workspaceId: string;
  workspaceSlug: string;
}

interface CreateProjectDialogProps {
  workspaceId: string;
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateProjectDialog({
  workspaceSlug,
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>(blankTemplateValue);
  const [isLoading, setIsLoading] = useState(false);

  const createProject = useMutation(api.projects.create);
  const createProjectFromTemplate = useMutation(
    api.projects.createFromTemplate,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedTemplateId === blankTemplateValue) {
        await createProject({
          workspaceSlug,
          name,
          description,
        });
      } else {
        await createProjectFromTemplate({
          workspaceSlug,
          templateId: selectedTemplateId as Id<"projectTemplates">,
          name,
          description,
        });
      }

      toast.success("Project created successfully");
      onOpenChange(false);
      setName("");
      setDescription("");
      setSelectedTemplateId(blankTemplateValue);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project for your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Project Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <TemplateSelector
              onValueChange={setSelectedTemplateId}
              value={selectedTemplateId}
              workspaceSlug={workspaceSlug}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProjectDialog({
  projectId,
  projectName,
  workspaceSlug,
  open,
  onOpenChange,
  onSuccess,
}: {
  projectId: string;
  projectName: string;
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteProject = useMutation(api.projects.remove);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deleteProject({
        projectId: projectId as Id<"projects">,
        workspaceSlug,
      });
      toast.success("Project deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{projectName}&quot;? This
            action cannot be undone and will permanently delete all associated
            tasks and data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsTable({
  workspaceId,
  workspaceSlug,
}: ProjectsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState<{
    open: boolean;
    projectId: string;
    projectName: string;
  }>({ open: false, projectId: "", projectName: "" });

  const projects = useQuery(api.projects.listByWorkspace, {
    workspaceSlug: workspaceSlug,
  });

  const filteredProjects =
    projects?.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  if (!projects) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <CreateProjectDialog
        workspaceId={workspaceId}
        workspaceSlug={workspaceSlug}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-12 text-center"
                >
                  {searchQuery
                    ? "No projects found matching your search."
                    : "No projects yet. Create your first project to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/${workspaceSlug}/project/${project._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {project.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(project._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          render={
                            <Link
                              href={`/${workspaceSlug}/project/${project._id}/settings`}
                            />
                          }
                        >
                          <IconPencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            setDeleteDialogState({
                              open: true,
                              projectId: project._id,
                              projectName: project.name,
                            })
                          }
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteProjectDialog
        projectId={deleteDialogState.projectId}
        projectName={deleteDialogState.projectName}
        workspaceSlug={workspaceSlug}
        open={deleteDialogState.open}
        onOpenChange={(open) =>
          setDeleteDialogState({ ...deleteDialogState, open })
        }
        onSuccess={() => {
          setDeleteDialogState({
            open: false,
            projectId: "",
            projectName: "",
          });
        }}
      />
    </div>
  );
}
