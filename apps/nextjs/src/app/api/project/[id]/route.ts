import { and, eq } from "@amaxa/db";
import { db } from "@amaxa/db/client";
import { project_tracker, Projects, User } from "@amaxa/db/schema";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const { id } = req.query

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projectId = String(id);

    const result = await db.transaction(async (tx) => {
      const project = await tx.query.Projects.findFirst({
        where: eq(Projects.id, projectId)
      });

      if (!project) {
        return null;
      }

      const users = await tx.select({
        id: User.id,
        name: User.name,
        role: User.role,
        image: User.image
      }).from(project_tracker)
        .where(and(eq(project_tracker.projectId, projectId)))
        .innerJoin(User, eq(project_tracker.userId, User.id))
        .innerJoin(Projects, eq(project_tracker.projectId, Projects.id));

      const coaches = await tx.select({
        id: User.id,
        name: User.name,
        role: User.role,
        image: User.image
      }).from(project_tracker)
        .where(and(eq(project_tracker.projectId, projectId)))
        .innerJoin(User, eq(project_tracker.userId, User.id))
        .innerJoin(Projects, eq(project_tracker.projectId, Projects.id));

      return { project, users, coaches };
    });

    if (!result) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...result.project,
      users: result.users,
      coaches: result.coaches
    });

  } catch (error) {
    console.error("Error fetching project data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
