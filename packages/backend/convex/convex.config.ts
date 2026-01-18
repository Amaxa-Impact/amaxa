import resend from "@convex-dev/resend/convex.config.js";
import fs from "convex-fs/convex.config.js";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(fs);
app.use(resend);

export default app;
