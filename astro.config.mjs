// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://marcelschmitz.com",
  integrations: [mdx()],
  build: {
    inlineStylesheets: "always",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Hanken Grotesk",
      weights: [400, 500, 600, 700],
      cssVariable: "--font-sans",
    },
    {
      provider: fontProviders.google(),
      // Code only: <code>, <pre> and install commands. Never chrome or labels.
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
