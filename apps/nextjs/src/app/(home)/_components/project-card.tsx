import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@amaxa/ui/card";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    image: string | null;
  };
}

const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`} className="block w-full">
      <Card className="h-[300px] w-full overflow-hidden transition-transform duration-200 hover:bg-muted/40">
        <CardContent className="relative h-[220px] p-0">
          <Image
            src={project.image ?? "/placeholder.svg"}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </CardContent>
        <CardFooter className="h-[80px] items-center justify-center text-center">
          <h3 className="line-clamp-2 text-lg font-semibold">{project.name}</h3>
        </CardFooter>
      </Card>
    </Link>
  );
});

export default ProjectCard;
