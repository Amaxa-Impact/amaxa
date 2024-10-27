import { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,

  experimental: {
    ppr: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@amaxa/api",
    "@amaxa/auth",
    "@amaxa/db",
    "@amaxa/ui",
    "@amaxa/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
