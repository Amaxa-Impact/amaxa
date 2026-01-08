import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('typescript-eslint').Config} */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
];

/** @type {import('typescript-eslint').Config} */
export const restrictEnvAccess = [
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: "Direct access to process.env is not allowed. Use environment variable utilities instead.",
        },
      ],
    },
  },
];

export default baseConfig;

