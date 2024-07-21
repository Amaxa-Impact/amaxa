import type { Metadata, ResolvingMetadata } from "next";

import { db } from "@amaxa/db/client";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;

  const project = await db.query.Projects.findFirst({
    where: (Projects, { eq }) => eq(Projects.id, id),
    columns: {
      name: true,
      image: true,
    },
  });
  if (!project) {
    return {
      title: "Project not found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: project.name,
    openGraph: {
      images: [project.image ?? "/image-null.jpg", ...previousImages],
    },
  };
}

export default function HomePage() {
  return (
    <div>
      <div className="grid grid-rows-1 gap-10 md:grid-cols-2 md:grid-rows-2"></div>
    </div>
  );
}
