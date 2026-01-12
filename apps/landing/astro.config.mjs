// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.amaxaimpact.org",
  integrations: [
    react(),
    sanity({
      projectId: "w4q41arm",
      dataset: "production",
      apiVersion: "2025-03-04",
      useCdn: true,
      studioBasePath: "/admin",
    }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
