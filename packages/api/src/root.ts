import { authRouter } from "./router/auth";
import { projectsRouter } from "./router/projects";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  projects: projectsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
