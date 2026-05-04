import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const fontDir = resolve(process.cwd(), "src/assets/og");

const fonts = [
  { name: "Albert Sans", data: readFileSync(`${fontDir}/albert-sans-regular.ttf`), weight: 400 as const, style: "normal" as const },
  { name: "Albert Sans", data: readFileSync(`${fontDir}/albert-sans-bold.ttf`),    weight: 700 as const, style: "normal" as const },
  { name: "Albert Sans", data: readFileSync(`${fontDir}/albert-sans-italic.ttf`),  weight: 400 as const, style: "italic" as const },
];

const W = 1200;
const H = 630;
const TEAL = "#0C314B";
const WHITE = "#FFFFFF";
const MUTED = "#5A6B7A";

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trim() + "…" : s);

const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

interface OgInput {
  title: string;
  snippet: string;
  category: string;
  date: Date;
  author: string;
}

export async function renderPostOg(input: OgInput): Promise<Uint8Array> {
  const markup = html(`
    <div style="display:flex;flex-direction:column;width:100%;height:100%;background:${WHITE};padding:80px 90px;justify-content:space-between;font-family:'Albert Sans';">
      <div style="display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:14px;font-size:22px;color:${MUTED};letter-spacing:0.04em;text-transform:uppercase;font-weight:400;">
          <span>${input.category}</span>
          <span style="opacity:0.5;">·</span>
          <span>${formatDate(input.date)}</span>
        </div>
        <div style="display:flex;font-size:78px;font-weight:700;color:${TEAL};line-height:1.05;letter-spacing:-0.02em;margin-top:32px;">
          ${input.title}
        </div>
        <div style="display:flex;font-size:30px;font-style:italic;color:${TEAL};opacity:0.78;line-height:1.4;margin-top:28px;">
          ${truncate(input.snippet, 180)}
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:2px solid ${TEAL};padding-top:24px;">
        <div style="display:flex;font-size:24px;font-weight:700;color:${TEAL};letter-spacing:0.02em;">marcelschmitz.com</div>
        <div style="display:flex;font-size:22px;color:${MUTED};">${input.author}</div>
      </div>
    </div>
  `);

  const svg = await satori(markup as Parameters<typeof satori>[0], { width: W, height: H, fonts });
  return new Resvg(svg, { background: WHITE }).render().asPng();
}
