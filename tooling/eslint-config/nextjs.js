import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  ...tseslint.configs.recommended,
];


