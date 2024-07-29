import { authRouter } from "./router/auth";
import { projectsRouter } from "./router/projects";
import { tasksRouter } from "./router/tasks";
import { userRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  projects: projectsRouter,
  users: userRouter,
  tasks: tasksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
