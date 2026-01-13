import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-arktype";
import { type } from "arktype";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: type.enumerated("development", "production", "test"),
  },
  server: {
    BUCKET: type("string"),
    WORKOS_CLIENT_ID: type("string > 1"),
    WORKOS_API_KEY: type("string > 1"),
    WORKOS_COOKIE_PASSWORD: type("string > 1"),
    WORKOS_REDIRECT_URI: type("string.url"),
    CONVEX_DEPLOYMENT: type("string | undefined"),
    RESEND_API_KEY: type("string"),
    GOOGLE_GENERATIVE_AI_API_KEY: type("string"),
    RAILWAY_ENDPOINT_URL: type("string.url"),
    RAILWAY_REGION: type("string"),
    RAILWAY_BUCKET_NAME: type("string"),
    RAILWAY_ACCESS_ID_KEY: type("string"),
    RAILWAY_ACCESS_SECRET_KEY: type("string"),
    UPLOADTHING_TOKEN: type("string"),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: type("string.url"),
    NEXT_PUBLIC_SITE_URL: type("string.url | undefined"),
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: type("string.url"),
    NEXT_PUBLIC_WORKOS_CLIENT_ID: type("string > 1"),
  },
  runtimeEnv: {
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
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
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    RAILWAY_ENDPOINT_URL: process.env.RAILWAY_ENDPOINT_URL,
    RAILWAY_REGION: process.env.RAILWAY_REGION,
    RAILWAY_BUCKET_NAME: process.env.RAILWAY_BUCKET_NAME,
    RAILWAY_ACCESS_ID_KEY: process.env.RAILWAY_ACCESS_ID_KEY,
    RAILWAY_ACCESS_SECRET_KEY: process.env.RAILWAY_ACCESS_SECRET_KEY,
    BUCKET: process.env.BUCKET,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
