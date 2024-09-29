"use client";

import { projects } from "~/lib/constants/projects";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const content = projects.filter((project) => project.id === id)[0];

  if (!content) {
    return <div>Project not found</div>;
  }

  return <div className="py-16"> {content.content} </div>;
}
