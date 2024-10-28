import { db } from "@amaxa/db/client";

export const findAllProjects = () => db.query.Projects.findMany({});
