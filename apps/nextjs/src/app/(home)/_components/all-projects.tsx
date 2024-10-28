import { findAllProjects } from "../_queries";
import ProjectGrid from "./project-grid";

export default async function AllProjects() {
  const allProjects = await findAllProjects();
  return <ProjectGrid projects={allProjects} />;
}
