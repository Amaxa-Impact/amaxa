import { User } from "@amaxa/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  usersNotInProject: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: User.id,
        name: User.name,
      })
      .from(User);
  }),
});
