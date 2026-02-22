import { registerRoutes } from "convex-fs";
import { httpRouter } from "convex/server";

import { components } from "./_generated/api";
import { authKit } from "./auth";
import { fs } from "./fs";
import { requireSiteAdminAction } from "./permissions";

const http = httpRouter();

registerRoutes(http, components.fs, fs, {
  pathPrefix: "/fs",
  uploadAuth: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity !== null;
  },
  downloadAuth: async (ctx) => {
    return await requireSiteAdminAction(ctx);
  },
});

authKit.registerRoutes(http);

export default http;
