import baseConfig from "@amaxa/eslint-config/base";
import reactConfig from "@amaxa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["**/*.tsx"],
  },
  ...baseConfig,
  ...reactConfig,
];
