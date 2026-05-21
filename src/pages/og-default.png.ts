import type { APIRoute } from "astro";
import { renderHomeOg } from "../lib/og";
import { SITE } from "../lib/site";

export const GET: APIRoute = async () => {
  const png = await renderHomeOg({
    name: SITE.author,
    tagline: SITE.jobTitle,
    description:
      "Writing on agentic development, security, and the craft of software, from a Porto-based engineer with 25+ years in the trade.",
    url: "marcelschmitz.com",
  });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
