// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://marcelschmitz.com",
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Albert Sans",
      weights: [300, 400, 500, 600, 700],
      cssVariable: "--font-sans",
    },
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      weights: ["300 600"],
      cssVariable: "--font-serif",
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      weights: [400, 500],
      cssVariable: "--font-mono",
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      wrap: true,
    },
  },
});
