// Renders the event banner cards used on the Up Next page.
//
// The events' own og:image files are unusable here: two are screenshots of
// their homepages, one is a near-white lettermark that disappears on the
// paper background, and they arrive in four different aspect ratios. These
// cards put every event in the site's own language instead, and match the
// Satori post cards in src/lib/og.ts.
//
// Output goes to public/events/ and ships with the frontend, not the WordPress
// media library: the deploy user on prod3 cannot write to kitchen's uploads
// directory, and kitchen's REST API is unusable for writes because nginx
// strips the Authorization header. The Up Next page therefore references these
// by absolute URL (https://marcelschmitz.com/events/<slug>.png), which also
// keeps them rendering inside the wp-admin editor. Re-run with:
//   node scripts/render-event-cards.mjs

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const fontDir = resolve(process.cwd(), "src/assets/og");
const outDir = resolve(process.cwd(), "public/events");

const fonts = [
  { name: "Albert Sans", data: readFileSync(`${fontDir}/albert-sans-regular.ttf`), weight: 400, style: "normal" },
  { name: "Albert Sans", data: readFileSync(`${fontDir}/albert-sans-bold.ttf`), weight: 700, style: "normal" },
];

const W = 1200;
const H = 480;

// Ink ground rather than the post cards' white, so the banner reads as a
// deliberate block in both themes instead of a bright rectangle in dark mode.
const INK = "#0C314B";
const PAPER = "#FBFAF7";
const MUTED = "#93A7B6";
// The dark-theme accent, not #C2410C: the light one is too close to the ink
// ground to hold at 22px.
const ACCENT = "#F59E6B";

const EVENTS = [
  {
    slug: "wc-belgrade-2026",
    role: "Speaking · Saturday 13:20",
    name: "WordCamp Belgrade 2026",
    place: "Dom Omladine, Belgrade",
    date: "18–19 September 2026",
  },
  {
    slug: "wc-galicia-2026",
    role: "Speaking · Saturday 10:00",
    name: "WordCamp Galicia 2026",
    place: "A Coruña, Spain",
    date: "16–18 October 2026",
  },
  {
    slug: "wp-day-for-ai-faro-2026",
    role: "Speaking · Codeable sponsoring",
    name: "WordPress Day for AI",
    place: "Faro, Portugal",
    date: "24 October 2026",
  },
  {
    slug: "wc-portugal-2026",
    role: "Three sessions",
    name: "WordCamp Portugal 2026",
    place: "Porto, Portugal",
    date: "15–16 May 2026",
  },
  {
    slug: "wceu-krakow-2026",
    role: "Attended",
    name: "WordCamp Europe 2026",
    place: "Kraków, Poland",
    date: "4–6 June 2026",
  },
];

const card = (e) => html(`
  <div style="display:flex;flex-direction:column;width:100%;height:100%;background:${INK};padding:64px 72px;justify-content:space-between;font-family:'Albert Sans';">
    <div style="display:flex;font-size:22px;color:${ACCENT};letter-spacing:0.1em;text-transform:uppercase;font-weight:400;">
      ${e.role}
    </div>
    <div style="display:flex;font-size:68px;font-weight:700;color:${PAPER};line-height:1.05;letter-spacing:-0.02em;">
      ${e.name}
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;border-top:2px solid rgba(251,250,247,0.22);padding-top:26px;">
      <div style="display:flex;font-size:26px;color:${PAPER};">${e.place}</div>
      <div style="display:flex;font-size:26px;color:${MUTED};">${e.date}</div>
    </div>
  </div>
`);

mkdirSync(outDir, { recursive: true });

for (const e of EVENTS) {
  const svg = await satori(card(e), { width: W, height: H, fonts });
  const png = new Resvg(svg, { background: INK }).render().asPng();
  const path = `${outDir}/${e.slug}.png`;
  writeFileSync(path, png);
  console.log(`${path}  ${W}x${H}`);
}
