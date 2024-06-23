import baseConfig, { restrictEnvAccess } from "@amaxa/eslint-config/base";
import nextjsConfig from "@amaxa/eslint-config/nextjs";
import reactConfig from "@amaxa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
