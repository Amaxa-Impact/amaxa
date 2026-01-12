// @ts-check
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sanity({
      projectId: "w4q41arm",
      dataset: "production",
      apiVersion: "2025-03-04",
      useCdn: true,
      studioBasePath: "/admin",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});