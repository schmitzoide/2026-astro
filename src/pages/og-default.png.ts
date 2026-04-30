import type { APIRoute } from "astro";
import { generateOpenGraphImage } from "astro-og-canvas";
import path from "node:path";
import { SITE } from "../lib/site";

const fontDir = path.resolve(process.cwd(), "src/assets/fonts");

export const GET: APIRoute = async () => {
  const png = await generateOpenGraphImage({
    title: SITE.name,
    description:
      "Software engineer in Porto, Portugal. Writing on agentic dev, security, and the craft.",
    bgGradient: [[251, 250, 247]],
    border: { color: [194, 65, 12], width: 12, side: "block-start" },
    padding: 80,
    font: {
      title: { color: [12, 49, 75], weight: "Light", families: ["AlbertSans"] },
      description: { color: [52, 81, 104], weight: "Normal", families: ["AlbertSans"] },
    },
    fonts: [
      path.join(fontDir, "AlbertSans-Light.ttf"),
      path.join(fontDir, "AlbertSans-Regular.ttf"),
    ],
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
