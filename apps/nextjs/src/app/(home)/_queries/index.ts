import { db } from "@amaxa/db/client";

import { next_cache } from "~/lib/cache";

export const findAllProjects = next_cache(
  async () => await db.query.Projects.findMany({}),
  ["findAllProjects"],
  {
    revalidate: 60 * 60 * 10,
  },
);
