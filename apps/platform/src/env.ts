import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-arktype";
import { type } from "arktype";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: type.enumerated("development", "production", "test"),
  },
  server: {
    WORKOS_CLIENT_ID: type("string > 1"),
    WORKOS_API_KEY: type("string > 1"),
    WORKOS_COOKIE_PASSWORD: type("string > 1"),
    WORKOS_REDIRECT_URI: type("string.url"),
    CONVEX_DEPLOY_KEY: type("string | undefined"),
    RESEND_API_KEY: type("string"),
    GOOGLE_GENERATIVE_AI_API_KEY: type("string"),
    ADMIN_USER_EMAIL: type("string | undefined"),
    ADMIN_USER_PASSWORD: type("string  | undefined"),

    COACH_USER_EMAIL: type("string | undefined"),
    COACH_USER_PASSWORD: type("string | undefined"),

    MEMBER_USER_EMAIL: type("string | undefined"),
    MEMBER_USER_PASSWORD: type("string | undefined"),

    USER_EMAIL: type("string | undefined"),
    USER_PASSWORD: type("string | undefined"),

    E2E_TESTS_ENABLED: type("string | undefined"),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: type("string.url"),
    NEXT_PUBLIC_SITE_URL: type("string.url | undefined"),
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: type("string.url"),
    NEXT_PUBLIC_WORKOS_CLIENT_ID: type("string > 1"),
    NEXT_PUBLIC_ROOT_DOMAIN: type("string.url | undefined"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    ADMIN_USER_EMAIL: process.env.ADMIN_USER_EMAIL,
    ADMIN_USER_PASSWORD: process.env.ADMIN_USER_PASSWORD,
    COACH_USER_EMAIL: process.env.COACH_USER_EMAIL,
    COACH_USER_PASSWORD: process.env.COACH_USER_PASSWORD,
    MEMBER_USER_EMAIL: process.env.MEMBER_USER_EMAIL,
    MEMBER_USER_PASSWORD: process.env.MEMBER_USER_PASSWORD,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    E2E_TESTS_ENABLED: process.env.E2E_TESTS_ENABLED,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_WORKOS_REDIRECT_URI:
      process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
    NEXT_PUBLIC_WORKOS_CLIENT_ID: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD,
    WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
    CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
