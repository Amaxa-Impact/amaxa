import { actionGuideRouter } from "./router/action-guides";
import { eventsRouter } from "./router/events";
import { projectsRouter } from "./router/projects";
import { tasksRouter } from "./router/tasks";
import { userRouter } from "./router/users";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  users: userRouter,
  tasks: tasksRouter,
  events: eventsRouter,
  actionGuides: actionGuideRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
