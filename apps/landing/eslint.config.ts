import { defineConfig } from "eslint/config";

import { astroConfig } from "@amaxa/eslint-config/astro";
import { baseConfig, restrictEnvAccess } from "@amaxa/eslint-config/base";
import { reactConfig } from "@amaxa/eslint-config/react";

export default defineConfig(
  {
    ignores: [".astro/**", "dist/**"],
  },
  baseConfig,
  reactConfig,
  astroConfig,
  restrictEnvAccess,
);
