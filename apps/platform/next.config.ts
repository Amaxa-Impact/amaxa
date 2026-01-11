import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@amaxa/ui", "@amaxa/backend"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
