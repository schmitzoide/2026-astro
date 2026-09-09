# marcelschmitz.com

Astro frontend for **marcelschmitz.com**. Headless: WordPress at
`kitchen.marcelschmitz.com` is the CMS, this repo is the renderer. Content is
fetched from the WP REST API at build time and output as static HTML.

Astro 6 · Tailwind 4 · Node >= 22.12

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the build locally |

A build hits the live WordPress REST API, so it needs network access and
kitchen has to be up.

## Environment

`.env` (not committed):

```
PUBLIC_PLA_API_KEY=…   # Pluginslab Analytics; analytics is skipped if unset
```

## Layout

```
src/
├── lib/
│   ├── wp.ts        WP REST fetchers + HTML cleanup + SEO derivation
│   ├── site.ts      SITE constants, nav, social links
│   ├── format.ts    locale + date helpers (en-US, pt-PT)
│   └── og.ts        Satori/Resvg OG card renderers
├── content.config.ts  custom loaders for the posts + pages collections
├── layouts/Base.astro head, meta, OG, theme script, chrome
├── components/        Header, Footer
├── pages/             routes + rss/sitemap/og endpoints
└── styles/global.css  Tailwind @theme, CSS vars, .prose-reader
```

## How content flows

1. `src/lib/wp.ts` fetches `/wp-json/wp/v2/posts?_embed` and `/pages`.
2. It cleans the rendered HTML (entities, lazy-load attributes, WP reading-time
   block), injects heading IDs, extracts headings, counts words, and derives
   `seoTitle` / `seoDescription`. Rank Math meta overrides the derived values.
3. `src/content.config.ts` wraps that in two Astro loaders with Zod schemas.
   The collection `id` is the WordPress slug.
4. Pages render it with `set:html` into `.prose-reader`.

`about.astro` and `up-next.astro` each require a WP page (`about-me`,
`up-next`) and throw at build if it is missing.

## Bilingual

Polylang, exposed on REST by the companion plugin
[`marcel-headless-i18n`](../marcel-headless-i18n). Flat URLs per language
(`/posts/{slug}/`, no `/pt/` prefix), Portuguese as pt-PT.

Site chrome is English only. The home page and `/rss.xml` filter to EN posts;
PT posts surface through the in-article switcher, `/rss-pt.xml`, and hreflang
alternates in `<head>` and the sitemap.

## Styling

Tailwind 4 with no config file. The theme lives in the `@theme` block of
`src/styles/global.css`. Light/dark is CSS custom properties toggled by a
`.dark` class on `<html>`, set pre-paint by an inline script in `Base.astro`.
Fonts (Albert Sans, Fraunces, JetBrains Mono) are self-hosted via the Astro
`Font` API. WordPress markup is styled by the single `.prose-reader` class.

House style: **no em dashes** in any copy.

## Deploy

Ploi auto-deploy on push to `main` (site 368788 on prod3, source dir
`/home/marcelschmitz-jg6lo/marcelschmitz.com/`).

Every push to `main` bumps the `package.json` version **and** adds a matching
`## [X.Y.Z]` entry to [`CHANGELOG.md`](./CHANGELOG.md).

Publishing in WordPress does not update the live site on its own. The content
is baked at build time, so a rebuild has to run.
