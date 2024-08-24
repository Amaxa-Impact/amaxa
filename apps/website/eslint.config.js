import baseConfig, { restrictEnvAccess } from "@amaxa/eslint-config/base";
import nextjsConfig from "@amaxa/eslint-config/nextjs";
import reactConfig from "@amaxa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
