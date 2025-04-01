import { db } from "@amaxa/db/client";
import { oAuthProxy } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";

export const config = {
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: env.AUTH_SECRET,
  plugins: [oAuthProxy()],
  user: {
    additionalFields: {
      status: {
        type: "string",
        required: true,
        defaultValue: "Unverified",
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "User",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/google",
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
