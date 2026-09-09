// Downloads the og:image for each entry on /appearances/ into public/appearances/.
//
// Downloaded once and committed rather than hotlinked: hotlinking leaks the
// reader's IP to six third parties, and any of those sites reorganising its
// media library would silently break the page.
//
// Images are resized to 800px wide JPEG to keep the repo lean. Run with:
//   node scripts/fetch-appearance-images.mjs
//
// YouTube pages do not expose a useful og:image to a plain fetch, so those
// entries are mapped to the standard thumbnail URL by video id.
//
// Every Open Channels page returns the same generic show cover, so only the
// group cover is fetched from there; the individual episodes carry no image.

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const outDir = resolve(process.cwd(), "public/appearances");

// slug -> source page (or a direct image URL)
const SOURCES = {
  "open-makers-cover":
    "https://i0.wp.com/openchannels.fm/wp-content/uploads/2025/08/Open-Makers-on-Open-Channels-FM-Podcast-Network.jpg?fit=1200%2C1200&ssl=1",
  "greyd-conversations-14": "https://www.youtube.com/watch?v=1BvoYchYAAk",
  "codeable-changing-lives": "https://www.youtube.com/watch?v=aO61zBL6x6w",
  "kinsta-talk-distros": "https://www.youtube.com/watch?v=z4bQhNh1Pdw",
  "woocommerce-live-design": "https://www.youtube.com/watch?v=JliqsUgtwkE",
  "wptavern-jukebox-42":
    "https://wptavern.com/podcast/42-marcel-schmitz-on-finding-work-with-codeable-and-working-with-woocommerce",
  "wctv-nova-era":
    "https://wordpress.tv/2026/05/19/a-nova-era-do-wordpress-de-developer-a-arquiteto-com-engenharia-agentica/",
  "wctv-agentic-admin": "https://wordpress.tv/2026/05/19/wp-agentic-admin/",
  "wctv-mcp-woocommerce":
    "https://wordpress.tv/2025/11/24/como-instalar-e-integrar-um-servidor-mcp-com-woocommerce-e-chatgpt-para-criar-um-bot-inteligente-par/",
  "wctv-simplificando":
    "https://wordpress.tv/2024/05/20/simplificando-o-wordpress-para-empresas-construindo-temas-e-plugins-customizados-com-sinergia-de-eq/",
  "wpsessions-ar": "https://wpsessions.com/sessions/augmented-reality-and-woocommerce/",
  "wctv-lisboa-2017":
    "https://wordpress.tv/2017/06/05/marcel-schmitz-lojas-on-line-com-woocommerce-o-que-faz-o-que-nao-faz-e-o-que-deveria-fazer/",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const youtubeId = (url) => url.match(/[?&]v=([A-Za-z0-9_-]{11})/)?.[1];

async function resolveImageUrl(source) {
  if (/\.(jpe?g|png|webp)(\?|$)/i.test(source)) return source;

  const vid = youtubeId(source);
  if (vid) return `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`;

  const res = await fetch(source, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const html = await res.text();
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!m) throw new Error("no og:image");
  return m[1].replace(/&amp;/g, "&");
}

mkdirSync(outDir, { recursive: true });

let ok = 0;
let failed = 0;

for (const [slug, source] of Object.entries(SOURCES)) {
  const out = `${outDir}/${slug}.jpg`;
  if (existsSync(out) && !process.argv.includes("--force")) {
    console.log(`skip  ${slug} (exists)`);
    ok++;
    continue;
  }
  try {
    const imageUrl = await resolveImageUrl(source);
    const res = await fetch(imageUrl, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`image ${res.status}`);
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    // sips ships with macOS; resize in place and normalise to JPEG.
    execFileSync("sips", ["-s", "format", "jpeg", "-Z", "800", out, "--out", out], {
      stdio: "ignore",
    });
    console.log(`ok    ${slug}`);
    ok++;
  } catch (err) {
    console.warn(`FAIL  ${slug}: ${err.message}`);
    failed++;
  }
}

console.log(`\n${ok} ok, ${failed} failed`);
if (failed) process.exitCode = 1;
