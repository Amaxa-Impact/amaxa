import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@amaxa/eslint-config/base";
import { nextjsConfig } from "@amaxa/eslint-config/nextjs";
import { reactConfig } from "@amaxa/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**", ".content-collections/**", "./tests/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
