import resend from "@convex-dev/resend/convex.config.js";
import workOSAuthKit from "@convex-dev/workos-authkit/convex.config";
import fs from "convex-fs/convex.config.js";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(fs);
app.use(resend);
app.use(workOSAuthKit);

export default app;
