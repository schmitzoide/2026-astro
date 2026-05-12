# Changelog

All notable changes to the marcelschmitz.com Astro frontend.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · versions follow [SemVer](https://semver.org/).

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
