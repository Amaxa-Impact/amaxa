import tsParser from "@typescript-eslint/parser";
import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";

export const astroConfig = defineConfig([
  // Spreads recommended Astro rules and parser logic
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
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
