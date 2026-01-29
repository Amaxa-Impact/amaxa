import { memo } from "react";
import Link from "next/link";

import { Badge } from "@amaxa/ui/badge";

interface ProjectCardProps {
  projectId: string;
  name: string;
  description: string;
  role: "coach" | "member";
  workspaceSlug: string | undefined;
}

export const ProjectCard = memo(function ProjectCard({
  projectId,
  name,
  description,
  role,
  workspaceSlug,
}: ProjectCardProps) {
  return (
    <Link
      href={`/${workspaceSlug}/project/${projectId}`}
      className="bg-card hover:border-primary/40 border-border group flex flex-col rounded-lg border p-6 transition-all hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="group-hover:text-primary text-xl font-semibold transition-colors">
          {name}
        </h3>
        <Badge
          variant={role === "coach" ? "default" : "secondary"}
          className="ml-2 shrink-0 capitalize"
        >
          {role}
        </Badge>
      </div>
      <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
        {description}
      </p>
    </Link>
  );
});
