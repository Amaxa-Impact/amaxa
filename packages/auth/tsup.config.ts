import { defineConfig } from "tsup";

export default defineConfig((env) => {
  return {
    entry: ["src/client.ts"],
    format: ["esm", "cjs"],
    bundle: true,
    splitting: false,
    noExternal: ["better-auth"],
    dts: true,
  };
});
