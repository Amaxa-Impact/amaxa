import { env } from "@/env";

export const protocol = env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN ?? "amaxa.localhost:3000";
export const rootPrefix = "internal";
