# Changelog

All notable changes to the marcelschmitz.com Astro frontend.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · versions follow [SemVer](https://semver.org/).

## [1.6.1] — 2026-09-09

### Fixed

- **Primary nav was clipped on narrow viewports.** Adding Tools took the nav to five items plus the theme toggle, which no longer fits beside the `~/marcel.schmitz` wordmark on a phone: the last item ran off the edge and "Up Next" broke across two lines. The header row is now `flex-wrap`, so the nav drops to its own line under the wordmark once it stops fitting, and the nav itself wraps rather than overflowing. Link labels get `whitespace-nowrap` so a two-word label is never split, with slightly tighter horizontal padding below `sm`. The 44px minimum touch targets are unchanged.

### Changed

- **`wp-agentic-admin` now credits Ivelina Dimova as co-author**, linked to her GitHub, with a pointer to the joint WordCamp Galicia talk in October. She is the second-largest contributor to the repo.
- **The tool bodies in `src/data/tools.ts` support `[text](url)` links**, not just backtick code spans. Hrefs are restricted to `https://` in the renderer so a stray value cannot become a `javascript:` URL.
- **Dropped the "13 contributors" claim** from the `wp-agentic-admin` copy. The GitHub contributors API lists 11 commit authors, and the difference is presumably hackathon participants who never committed. Rather than publish a number that does not match the public record, the copy now says "built with the team at the CloudFest Hackathon 2026". Put the figure back if 13 is the number you want to stand behind.

## [1.6.0] — 2026-09-09

### Added

- **New `/tools/` page** listing the open-source tools, and a **Tools** entry in the primary nav (now Writing · About · Up Next · Tools · Hire). Six tools in three groups:
  - **The WordPress MCP trio** — `wp-devdocs-mcp` (verified hook database), `wp-blockmarkup-mcp` (block schemas plus two-tier markup validation), `wp-playground-mcp` (ephemeral WordPress in WASM). Grouped because `wp-playground-mcp`'s own README already frames them as **author → validate → test**, which is a better story than three separate entries.
  - **The harness** — `wp-agentic-kit`, structured around the four D's from the WordCamp Portugal talk.
  - **Also** — `wims` (not WordPress-specific) and `wp-agentic-admin` (a plugin for site owners rather than a developer tool, so grouped apart rather than dropped).
- **`src/data/tools.ts`**, the page's content. Deliberately **not** in WordPress, unlike Writing, About and Up Next: this content is structured (install command, repo, npm package, licence) rather than prose, and running shell one-liners through Gutenberg invites smart-quote damage. The trade-off is that this one page is not editable from wp-admin.
- **`src/lib/github.ts`**, build-time star counts. One request for the whole account rather than one per repo. **Every failure path returns an empty map instead of throwing**: GitHub being unreachable, rate limiting the build host, or changing its response shape must never take the site down. Stars simply do not render.
- **`ItemList` / `SoftwareSourceCode` JSON-LD** on the page.

### Fixed

- **The star fetch initially hit `/orgs/pluginslab/repos` and 404'd on every build.** `github.com/pluginslab` is a **User** account, not an Organization. Now `/users/pluginslab/repos?type=owner`. Worth recording that the fallback did its job when this was wrong: the build completed and the page rendered without stars rather than failing.

## [1.5.0] — 2026-09-09

### Added

- **Event banner cards on Up Next**, one per event, rendered by a new `scripts/render-event-cards.mjs` on the Satori + Resvg pipeline the OG cards already use. 1200×480 on the ink ground (`#0C314B`) with cream text and the dark-theme accent (`#F59E6B`, since the light `#C2410C` is too close to the ink to hold at 22px). Each card carries the role ("Speaking · Saturday 13:20"), the event name, the venue or city, and the dates.
- **`public/events/*.png`**, the five rendered cards, shipped with the frontend.

### Notes

- **Why not the events' own `og:image` files**, which was the original idea. All five were pulled and inspected: WCEU Kraków and Belgrade are **screenshots of their own homepages** (the Belgrade one with its headline sliced off mid-sentence), Faro is a near-white lettermark that would vanish on the paper background and in dark mode, and Galicia is a 553×475 group photo of a *previous* edition with a yellow and blue frame baked in. Only WordCamp Portugal's is a genuine, usable photo. Four different aspect ratios, five clashing brand identities, two of them screenshots. Rendering our own was the only way to get something that looks deliberate.
- **The cards are referenced by absolute URL** (`https://marcelschmitz.com/events/<slug>.png`), not from the WordPress media library. Two blockers made the library impossible: the `deploy`/`ploi` user on prod3 cannot write to kitchen's `wp-content/uploads` (owned by `marcelschmitz-jg6lo`, no passwordless sudo, site user's SSH key not held here), and the REST media endpoint is dead for the same stripped-`Authorization` reason noted in 1.4.0. The absolute URL has the side benefit of rendering correctly inside the wp-admin editor, which a root-relative path would not.
- `width` and `height` are set on every `<img>`. WP markup is injected with `set:html` and never touches `astro:assets`, so nothing else would reserve the space and the page would shift on load.

## [1.4.0] — 2026-09-09

### Changed

- **Up Next refreshed for the autumn run, and the homepage "Going next" line with it.** The WordPress page (`up-next`, ID 106 on kitchen) had not been touched since 19 May and had gone stale: two of its three entries (WordCamp Portugal in May, WCEU Kraków in June) were already in the past, and `index.astro` hardcoded the same three events in its "Going next" cell. The page now leads with the three confirmed autumn dates, each with the slot time pulled from the event's own REST API rather than guessed:
  - **WordCamp Belgrade, 18-19 Sep.** Speaking Saturday 13:20, *Code is cheap, judgment is not*. Slot and session URL from `belgrade.wordcamp.org/2026/wp-json/wp/v2/sessions`.
  - **WordCamp Galicia, A Coruña, 16-18 Oct.** Speaking Saturday 10:00 in the main room with Ivelina Dimova, *The Browser is the Agent*. Slot, room and session URL from the Galicia REST API; the description is condensed from the organisers' own published abstract.
  - **WordPress Day for AI, Faro, 24 Oct.** Speaking in the business track in Portuguese, *A IA não é um desconto. É capacidade.* Codeable is credited as sponsor of the day.
- **`index.astro` "Going next" now reads "WordCamp Belgrade · WordCamp Galicia · WordPress Day for AI, Faro. Speaking at all three."** This is the only part of Up Next that lives in the repo, so it has to be edited in tandem with the WP page or the two drift, which is exactly what happened between May and September.

### Added

- **"Earlier this year" section on Up Next**, carrying the WordCamp Portugal entry (all three sessions, links intact) and WCEU Kraków, rewritten into the past tense. A strictly forward-looking page empties out between events and loses the evidence of a speaking record; this way it degrades gracefully.

### Removed

- **performance.now() 2026 (Amsterdam, 19-20 Nov)** from Up Next. Not attending.
- **WordCamp Athens (December)** stays off until the organisers publish official dates. Only a third-party aggregator lists 11-12 December, and the WordCamp site still says early planning.
- **WordCamp Valencia (31 Oct to 1 Nov)** stays off pending a decision from the organisers. Submitted 31 Aug, no answer yet.

### Notes

- **The kitchen REST API cannot be written to.** nginx strips the `Authorization` header, so a bogus credential and no credential return byte-identical `rest_forbidden_context` responses and the `WP_APP_PASSWORD` in `.env` is unusable for writes. Content edits have to go through wp-admin or `wp-cli` over SSH (`prod3:/home/marcelschmitz-jg6lo/kitchen.marcelschmitz.com/public`). This edit used `wp post update 106`.
- **The page excerpt is auto-generated**, so `description` / `seoDescription` for `/up-next/` is now the first ~55 words of the Belgrade entry. Fine, but a hand-written excerpt or a Rank Math description would read better in search results.
- Docs rewritten in the same pass: the folder-level `CLAUDE.md` still described the pre-Astro WordPress theme site, and `README.md` was still the untouched Astro minimal starter template.

## [1.3.3] — 2026-05-21

### Fixed

- **Homepage OG card was blank** (just an orange border on a cream background). Root cause: `astro-og-canvas` + `canvaskit-wasm` silently failed to load the Albert Sans TTFs at build time (`---- failed to open <0> as a font`), so text was never drawn. Rewrote `src/pages/og-default.png.ts` to use the same Satori + Resvg pipeline already used for per-post OG cards, plus a new `renderHomeOg()` helper in `src/lib/og.ts`. Result is a branded card with "SOFTWARE ENGINEER · Marcel Schmitz · Writing on agentic development, security…" on a white background with the same teal/Albert Sans treatment as post cards. Removed `astro-og-canvas` and `canvaskit-wasm` from dependencies.

## [1.3.2] — 2026-05-21

### Changed

- **Language switcher moved to the top of the post page, on the same line as the "← All writing" link, with a country flag instead of the `↔` arrow.** Was previously below the description, which buried it. Now: left side shows `← All writing`, right side shows `🇵🇹 Ler em Português` (on an EN post) or `🇬🇧 Read in English` (on a PT post). Flags are emoji so they inherit the page font and need no asset pipeline. Used 🇬🇧 for English since the audience is European and `🇬🇧` is the conventional "international English" toggle (vs `🇺🇸` which reads US-specific).

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
