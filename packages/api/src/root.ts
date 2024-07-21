import { authRouter } from "./router/auth";
import { projectsRouter } from "./router/projects";
import { tasksRouter } from "./router/tasks";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
