import tsParser from "@typescript-eslint/parser";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";

export const astroConfig = defineConfig([
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        project: null,
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
    },
    rules: {
      "astro/no-set-html-directive": "error",
      "astro/no-unused-define-vars-in-style": "error",
    },
  },
]);
