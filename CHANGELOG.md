# Changelog

All notable changes to the marcelschmitz.com Astro frontend.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · versions follow [SemVer](https://semver.org/).

## [1.3.1] — 2026-05-21

### Fixed

- **Homepage writing index filters to English posts only.** Was showing both EN and PT in the same list after the bilingual rollout, which doubled every entry. `src/pages/index.astro` now filters `getCollection("posts")` to `data.language === "en"` (defaulting empty to en). PT translations remain reachable via the per-post switcher and `/rss-pt.xml`; chrome stays EN-only per scope decision. Companion data fix (out of repo): set each PT post's publish date to match its EN sibling via wp-cli so the chronological order on a future PT index reflects the original publication date.

## [1.3.0] — 2026-05-21

### Added

- **Per-language SEO and feed plumbing for translated posts.** Builds on the per-post `language` + `translations` data shipped in 1.2.0. Five things ship together:
  - **`og:locale` and `og:locale:alternate`** in `Base.astro`, derived automatically from `htmlLang` and the existing `alternates` array. PT posts emit `og:locale=pt_PT` with `og:locale:alternate=en_US`, and vice versa, so LinkedIn and Facebook unfurl in the post's actual language.
  - **Locale-aware date formatting** on the post page and Satori OG card. `src/lib/format.ts` exports `bcp47For()` and `ogLocaleFor()` helpers that map raw WP codes (`en`, `pt`) to BCP-47 tags (`en-US`, `pt-PT`). `formatDate` and `formatDateLong` now accept an optional `language` argument. PT posts render `21 de maio de 2026` instead of `May 21, 2026`, both on the page and in the OG card image.
  - **Per-language RSS feeds.** `/rss.xml` is now English-only (with `<language>en-US</language>`); new `/rss-pt.xml` carries Portuguese posts (`<language>pt-PT</language>`). Both are linked from `<head>` with `hreflang` attributes so feed readers and crawlers can discover the right one.
  - **Hreflang in the sitemap.** Replaced `@astrojs/sitemap` with a custom `src/pages/sitemap.xml.ts` endpoint. Every post URL now ships `<xhtml:link rel="alternate" hreflang="..." href="..." />` entries for itself and every translation sibling, plus `lastmod` from the post's updatedDate. `public/robots.txt` updated from `/sitemap-index.xml` to `/sitemap.xml`.
  - **OG card knows the post's language.** `renderPostOg()` accepts an optional `language` and uses it for the date stamp. Posts with `featuredImage` continue to bypass the Satori card unchanged.

### Removed

- **`@astrojs/sitemap` integration.** Replaced by the custom endpoint above. The integration did not support flat-URL per-language hreflang without a `/pt/` prefix, and a 50-line custom endpoint gives us full control over `<xhtml:link>` alternates per URL.

## [1.2.1] — 2026-05-19

### Fixed

- **Favicon swapped from Astro's default rocket to a brand mark.** New `public/favicon.svg` is a teal (`#0C314B`) rounded square with a white `~/` glyph (tilde + slash), echoing the site header's `~/marcel.schmitz` identity. Hand-drawn paths so it renders crisply at 16×16. Added `favicon-32.png` and `apple-touch-icon.png` (180×180) for legacy browsers and iOS home-screen, rasterized via `sips`. `Base.astro` now ships the full link-rel set (svg primary, png 32×32 fallback, apple-touch-icon, shortcut icon) plus a `<meta name="theme-color" content="#0C314B">` for mobile browser chrome.

## [1.2.0] — 2026-05-18

### Added

- **Build-time SEO title and description derivation for WP-sourced content.** `fetchPosts()` and `fetchPages()` now compute `seoTitle` (≤60 chars, brand-suffixed) and `seoDescription` (≤160 chars, ellipsis-trimmed) from each WP entry's title and excerpt. The article `<h1>` keeps the long, descriptive WP title (e.g. "Hackers Don't Break In, They Log In: Social Engineering, AI, and 'Polite Paranoia' You Can Use Today") while the `<title>` tag and OG/Twitter meta ship the short version. Title truncation prefers the first colon as a natural split point, falling back to a word-boundary cut. No edits required on the kitchen WP side; content authors keep writing punchy long titles.
- **`seoTitle` and `seoDescription` props on `Base.astro`.** When provided, they drive the `<title>` tag and `<meta name="description">` (plus OG/Twitter title/description) directly, with no brand-suffix re-append. Falls back to the existing `title` + ` · Marcel Schmitz` composition when omitted.

### Changed

- **Homepage `<title>` trimmed.** Was 109 chars including the duplicate brand, now 43 chars ("Marcel Schmitz, software engineer in Porto"). Meta description tightened from ~165 to ~135 chars.
- **Post and page templates pass derived SEO fields.** `posts/[...slug].astro`, `about.astro`, and `up-next.astro` now forward `data.seoTitle` / `data.seoDescription` to `Base.astro`.

## [1.1.0] — 2026-05-14

### Added

- **Featured image as OG image fallback** on post pages. `fetchPosts()` now reads `_embedded["wp:featuredmedia"][0].source_url` from the WP REST response, the loader exposes it as an optional `featuredImage` field on the post collection, and `src/pages/posts/[...slug].astro` prefers it over the Satori-rendered brand card when present. Posts without a featured image continue to use the brand-locked Satori OG.

## [1.0.0] — 2026-05-12

First tagged release. Retroactively captures the post-launch consolidation since the 2026-astro greenfield: performance hardening, accessibility/SEO polish, the headless-WordPress wire, and the new analytics integration. Live at `https://marcelschmitz.com` on Ploi (prod3).

### Added

- **Pluginslab Analytics SDK** wired site-wide via `Base.astro` — reads `PUBLIC_PLA_API_KEY` from env, switches between `localhost:3201` (dev) and `analytics.pluginslab.com` (prod). First-party cookie-free pageview + session tracking. Validated end-to-end against the production analytics endpoint on 2026-05-12.
- **Auto-generated per-post OG cards** via Satori. Every blog post + page gets a 1200×630 OG image rendered at build time from the brand-locked template; no manual export needed.
- **Headless WordPress wire** — content sourced from `kitchen.marcelschmitz.com/wp-json/wp/v2`; the WP install is the CMS, Astro is the renderer.
- **AASA file** for Apple Universal Links (`/.well-known/apple-app-site-association`).
- **MDX + RSS + sitemap** via the standard Astro integrations.

### Changed

- **Self-hosted Google Fonts** via the Astro `Font` API (`astro:assets`) — Albert Sans variable served as preloaded woff2 from `/_astro/fonts/`. Kills the Google Fonts CSS round-trip that was causing CLS at first paint.
- **Inline critical CSS** via `build.inlineStylesheets: 'always'` — eliminates the render-blocking stylesheet request.
- **Hero photo via `astro:assets`** with locked aspect-ratio to prevent CLS on the home page.
- **GitHub link** points at the `pluginslab` org instead of personal account (canonical attribution).
- **Em-dashes swept** from titles, OG copy, JSON-LD, prose, and aria-labels — keeps brand voice consistent and avoids screen-reader weirdness.

### Fixed

- **Two a11y issues** flagged by Lighthouse on the post pages.

### Notes

- Repo: [schmitzoide/2026-astro](https://github.com/schmitzoide/2026-astro). Deploy: Ploi auto-deploy on `main` (site 368788 on prod3). Source dir: `/home/marcelschmitz-jg6lo/marcelschmitz.com/`.
- Release discipline going forward: bump `package.json` + add a matching `## [X.Y.Z]` entry here on every push to `main`. Same pattern as susanaschmitz-astro.
