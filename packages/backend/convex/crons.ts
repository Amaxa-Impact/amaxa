import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "cleanup expired invitations",
  { hourUTC: 3, minuteUTC: 0 },
  internal.workspaceInvitations.cleanupExpired,
);

export default crons;
