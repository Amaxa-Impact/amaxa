import { defineConfig } from "tsup";

export default defineConfig((env) => {
  return {
    entry: ["src/**/*.ts", "env.ts"],
    format: ["esm", "cjs"],
    bundle: true,
    splitting: false,
    noExternal: ["better-auth"],
    dts: false,
  };
});
