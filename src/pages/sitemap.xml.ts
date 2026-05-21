import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../lib/site";

const STATIC_PATHS = ["/", "/about/", "/up-next/"];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const absolute = (path: string, base: string) =>
  new URL(path, base).toString();

export async function GET(context: APIContext) {
  const base = (context.site ?? new URL(SITE.url)).toString();
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  // Build a slug → { lang: slug } map so each post can list itself + siblings
  // as hreflang alternates. Post i18n is flat-URL: /posts/{slug}/ per language.
  const siblingsBySlug = new Map<string, Record<string, string>>();
  for (const post of posts) {
    const lang = post.data.language;
    if (!lang) continue;
    const family: Record<string, string> = { [lang]: post.id };
    for (const [tLang, t] of Object.entries(post.data.translations)) {
      family[tLang] = t.slug;
    }
    siblingsBySlug.set(post.id, family);
  }

  const urls: string[] = [];

  for (const path of STATIC_PATHS) {
    urls.push(`  <url><loc>${escapeXml(absolute(path, base))}</loc></url>`);
  }

  for (const post of posts) {
    const loc = absolute(`/posts/${post.id}/`, base);
    const lastmod = post.data.updatedDate.toISOString();
    const family = siblingsBySlug.get(post.id);
    const links: string[] = [];
    if (family) {
      for (const [lang, slug] of Object.entries(family)) {
        const href = absolute(`/posts/${slug}/`, base);
        links.push(
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
        );
      }
    }
    urls.push(
      [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        ...links,
        "  </url>",
      ].join("\n"),
    );
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
