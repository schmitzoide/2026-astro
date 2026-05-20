export const WP_API = "https://kitchen.marcelschmitz.com/wp-json/wp/v2";

const entities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&hellip;": "…",
  "&nbsp;": " ",
};

export const decodeEntities = (str: string): string =>
  str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z#0-9]+;/gi, (m) => entities[m] ?? m);

export const stripHtml = (html: string): string =>
  decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);

export interface Heading {
  depth: 2 | 3;
  text: string;
  slug: string;
}

export const extractHeadings = (html: string): Heading[] => {
  const headings: Heading[] = [];
  const re = /<h([23])[^>]*?(?:\s+id="([^"]+)")?[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = stripHtml(m[3]);
    if (!text) continue;
    headings.push({
      depth: Number(m[1]) as 2 | 3,
      text,
      slug: m[2] ?? slugify(text),
    });
  }
  return headings;
};

export const injectHeadingIds = (html: string): string =>
  html.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag, attrs, inner) => {
      if (/\sid=["']/.test(attrs)) return full;
      const id = slugify(stripHtml(inner));
      if (!id) return full;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

export const stripReadingTimeBlock = (html: string): string =>
  html
    .replace(
      /(?:<hr[^>]*\/?>\s*)?<p>\s*<strong>\s*Reading time:?\s*<\/strong>[^<]*<\/p>\s*/gi,
      "",
    )
    .trimEnd();

export const fixLazyImages = (html: string): string =>
  html
    .replace(/<(img|source)([^>]*)>/gi, (_full, tag, attrs) => {
      let next = attrs;
      if (/\sdata-src="([^"]+)"/.test(next)) {
        next = next
          .replace(/\ssrc="[^"]*"/i, "")
          .replace(/\sdata-src="([^"]+)"/i, ' src="$1"');
      }
      if (/\sdata-srcset="([^"]+)"/.test(next)) {
        next = next
          .replace(/\ssrcset="[^"]*"/i, "")
          .replace(/\sdata-srcset="([^"]+)"/i, ' srcset="$1"');
      }
      next = next
        .replace(/\sstyle="--smush-placeholder[^"]*"/i, "")
        .replace(/(\sclass="[^"]*?)\s*lazyload\s*/i, "$1")
        .replace(/\sclass="\s*"/i, "");
      return `<${tag}${next}>`;
    })
    .replace(/<noscript>\s*(<img[^>]*>)\s*<\/noscript>/gi, "");

interface WpTerm {
  id: number;
  slug: string;
  name: string;
  taxonomy: "category" | "post_tag";
}

interface WpPostRaw {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  // Added by the marcel-headless-i18n plugin. Absent when the plugin or
  // Polylang isn't active — the loader treats that as "no translations".
  language?: string;
  translations?:
    | Record<string, { id: number; slug: string; url: string }>
    | unknown[];
  // Rank Math title + description, surfaced as REST meta by the same plugin.
  // Used as overrides for the derived SEO title / description when present.
  meta?: {
    rank_math_title?: string;
    rank_math_description?: string;
  };
  _embedded?: {
    "wp:term"?: WpTerm[][];
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    author?: Array<{ name: string }>;
  };
}

export interface TranslationLink {
  slug: string;
}

export interface LoadedPost {
  id: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  publishDate: string;
  updatedDate: string;
  category: string;
  categoryName: string;
  tags: string[];
  contentHtml: string;
  headings: Heading[];
  wordCount: number;
  draft: boolean;
  featuredImage?: string;
  language?: string;
  translations: Record<string, TranslationLink>;
}

export interface LoadedPage {
  id: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  updatedDate: string;
  contentHtml: string;
}

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;
const SEO_BRAND_SUFFIX = " · Marcel Schmitz";

function truncateAtWord(str: string, max: number): string {
  if (str.length <= max) return str;
  const cut = str.slice(0, max);
  const stripped = cut.replace(/\s+\S*$/, "");
  return stripped.length > 0 ? stripped : cut;
}

export function deriveSeoTitle(title: string): string {
  if (/Marcel Schmitz/i.test(title)) {
    return title.length <= SEO_TITLE_MAX
      ? title
      : truncateAtWord(title, SEO_TITLE_MAX);
  }
  const room = SEO_TITLE_MAX - SEO_BRAND_SUFFIX.length;
  const colonIdx = title.indexOf(":");
  let lead =
    colonIdx > 10 && colonIdx <= room ? title.slice(0, colonIdx) : title;
  lead = truncateAtWord(lead, room);
  return `${lead}${SEO_BRAND_SUFFIX}`;
}

export function deriveSeoDescription(desc: string): string {
  if (desc.length <= SEO_DESC_MAX) return desc;
  return `${truncateAtWord(desc, SEO_DESC_MAX - 1)}…`;
}

interface WpPageRaw {
  id: number;
  slug: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
}

export async function fetchPages(): Promise<LoadedPage[]> {
  const res = await fetch(`${WP_API}/pages?per_page=100&status=publish`);
  if (!res.ok) throw new Error(`WP pages fetch failed: ${res.status} ${res.statusText}`);
  const raw = (await res.json()) as WpPageRaw[];

  return raw.map((p) => {
    const title = decodeEntities(p.title.rendered);
    const description = stripHtml(p.excerpt.rendered).replace(/\s+…\s*$/, "…");
    return {
      id: p.slug,
      title,
      description,
      seoTitle: deriveSeoTitle(title),
      seoDescription: deriveSeoDescription(description),
      updatedDate: p.modified,
      contentHtml: injectHeadingIds(fixLazyImages(p.content.rendered)),
    };
  });
}

export async function fetchPosts(): Promise<LoadedPost[]> {
  const url = `${WP_API}/posts?per_page=100&_embed&status=publish`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP fetch failed: ${res.status} ${res.statusText}`);
  const raw = (await res.json()) as WpPostRaw[];

  return raw.map((p) => {
    const terms = (p._embedded?.["wp:term"] ?? []).flat();
    const cat = terms.find((t) => t.taxonomy === "category");
    const tags = terms
      .filter((t) => t.taxonomy === "post_tag")
      .map((t) => t.slug);

    const contentHtml = injectHeadingIds(
      fixLazyImages(stripReadingTimeBlock(p.content.rendered)),
    );
    const headings = extractHeadings(contentHtml);
    const plain = stripHtml(p.content.rendered);
    const description = stripHtml(p.excerpt.rendered).replace(/\s+…\s*$/, "…");

    const featuredImage = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    const title = decodeEntities(p.title.rendered);

    // Plugin returns `{}` as an object when there are siblings, but PHP's empty
    // array() serializes to `[]`. Normalize both to a typed map keyed by lang.
    const translations: Record<string, TranslationLink> = {};
    if (p.translations && !Array.isArray(p.translations)) {
      for (const [lang, sibling] of Object.entries(p.translations)) {
        if (sibling && typeof sibling === "object" && "slug" in sibling) {
          translations[lang] = { slug: String(sibling.slug) };
        }
      }
    }

    // Rank Math overrides — when an editor has set a per-post title or
    // description in Rank Math, prefer those over the derived defaults so
    // the rendered <title> and <meta name="description"> reflect the
    // editor's deliberate SEO copy.
    const rmTitle = p.meta?.rank_math_title?.trim();
    const rmDesc = p.meta?.rank_math_description?.trim();
    const seoTitle = rmTitle && rmTitle !== "" ? rmTitle : deriveSeoTitle(title);
    const seoDescription = rmDesc && rmDesc !== "" ? rmDesc : deriveSeoDescription(description);

    return {
      id: p.slug,
      title,
      description,
      seoTitle,
      seoDescription,
      publishDate: p.date,
      updatedDate: p.modified,
      category: cat?.slug ?? "uncategorized",
      categoryName: cat?.name ?? "Uncategorized",
      tags,
      contentHtml,
      headings,
      wordCount: plain.split(/\s+/).filter(Boolean).length,
      draft: false,
      featuredImage,
      language: typeof p.language === "string" && p.language !== "" ? p.language : undefined,
      translations,
    };
  });
}
