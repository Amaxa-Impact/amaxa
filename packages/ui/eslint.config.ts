import { defineConfig } from "eslint/config";

import { baseConfig } from "@amaxa/eslint-config/base";

export default defineConfig(
  {
    ignores: [],
  },
  baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
  },
);
