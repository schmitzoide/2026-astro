// Podcast, video and conference appearances listed on /appearances/.
//
// Same reasoning as tools.ts: structured data, not prose, so it lives in the
// repo rather than WordPress.
//
// `image` is a slug in public/appearances/. Those files are the source page's
// own og:image, downloaded once by scripts/fetch-appearance-images.mjs rather
// than hotlinked, so a third party reorganising their media library cannot
// silently break the page.
//
// The Open Makers co-host episodes deliberately carry no per-item image: all
// eleven Open Channels pages return the identical show cover, so per-episode
// art would render ten copies of the same tile. The cover appears once on the
// group instead.

export interface Appearance {
  date: string; // ISO. Sorting and display both derive from this.
  title: string;
  /** Show, channel or event. */
  venue: string;
  url: string;
  /** "Co-host", "Guest", "Speaker". */
  role: string;
  /** Other people on the episode, already phrased for display. */
  withWhom?: string;
  note?: string;
  image?: string;
  /** Set when the date is inferred rather than published. */
  dateApprox?: boolean;
}

export interface AppearanceGroup {
  id: string;
  title: string;
  blurb: string;
  cover?: string;
  coverAlt?: string;
  items: Appearance[];
}

export const APPEARANCE_GROUPS: AppearanceGroup[] = [
  {
    id: "co-host",
    title: "Open Makers, as co-host",
    blurb:
      "Ten episodes co-hosting the WooCommerce developer show on Open Channels FM, formerly Do the Woo, with Mike Andreasen. Mostly performance, HPOS and the parts of WooCommerce development that only show up at scale.",
    cover: "open-makers-cover",
    coverAlt: "Open Makers, a show on the Open Channels FM podcast network",
    items: [
      {
        date: "2024-05-15",
        title: "Inside the Developer Experience with HPOS",
        venue: "Open Makers",
        url: "https://openchannels.fm/meet-new-hosts-marcel-and-mike-talking-woocommerce-hpos/",
        role: "Co-host",
        withWhom: "Mike Andreasen",
        note: "First episode as co-host.",
      },
      {
        date: "2024-06-04",
        title: "Shifting Gears in WooCommerce Development From PHP to React",
        venue: "Open Makers",
        url: "https://openchannels.fm/for-a-good-time-four-developers-four-hosts/",
        role: "Co-host",
        withWhom: "Carl Alexander, Mike Andreasen and Zach Stepek",
      },
      {
        date: "2024-07-17",
        title: "From Hosting to Core Web Vitals for Building Fast WooCommerce Sites",
        venue: "Open Makers",
        url: "https://openchannels.fm/boosting-woocommerce-performance-with-marcel-and-mike/",
        role: "Co-host",
        withWhom: "Mike Andreasen",
      },
      {
        date: "2024-09-02",
        title: "Scaling WooCommerce: Insights on High-Performance Order Storage",
        venue: "Open Makers",
        url: "https://openchannels.fm/scaling-woocommerce-insights-on-high-performance-order-storage-hpos-with-vedanshu-jain/",
        role: "Co-host",
        withWhom: "guest Vedanshu Jain",
      },
      {
        date: "2024-09-24",
        title: "The Ultimate Guide to WooCommerce Hosting",
        venue: "Open Makers",
        url: "https://openchannels.fm/the-ultimate-guide-to-woocommerce-hosting-performance-support-and-growth-with-marcel-and-mike/",
        role: "Co-host",
        withWhom: "Mike Andreasen",
      },
      {
        date: "2024-10-18",
        title: "Caching, Scaling, Plugin Optimization, Security, Headless, and AI",
        venue: "Open Makers",
        url: "https://openchannels.fm/woocommerce-caching-scaling-plugin-optimization-security-headless-and-ai-with-andre-faca/",
        role: "Co-host",
        withWhom: "guest Andre Faca",
      },
      {
        date: "2024-11-14",
        title: "Optimizing WooCommerce Performance and Code Quality",
        venue: "Open Makers",
        url: "https://openchannels.fm/behind-the-code-brian-jackson-on-wordpress-and-woocommerce-optimization/",
        role: "Co-host",
        withWhom: "guest Brian Jackson",
      },
      {
        date: "2024-12-18",
        title: "Advanced WooCommerce Development, Lessons and Challenges",
        venue: "Open Makers",
        url: "https://openchannels.fm/advanced-woocommerce-development-lessons-challenges-with-chase-gruszewski/",
        role: "Co-host",
        withWhom: "guest Chase Gruszewski",
      },
      {
        date: "2025-01-27",
        title: "Reflections on the WooCommerce Releases from 2024",
        venue: "Open Makers",
        url: "https://openchannels.fm/exploring-woocommerce-2024-new-features-and-developer-insights-with-marcel-and-mike/",
        role: "Co-host",
        withWhom: "Mike Andreasen",
      },
      {
        date: "2025-03-26",
        title: "Building Trust and Converting Online Sales with Simple UX Decisions",
        venue: "Open Makers",
        url: "https://openchannels.fm/building-trust-and-converting-sales-with-simple-ux-decisions-with-marc-mcdougall/",
        role: "Co-host",
        withWhom: "guest Marc McDougall",
      },
    ],
  },
  {
    id: "guest",
    title: "As a guest",
    blurb:
      "Interviews and panels on other people's shows, from the official WooCommerce channel to hosting companies and the WordPress press.",
    items: [
      {
        date: "2026-02-19",
        title: "Modern WordPress Architecture: What Agencies Should Actually Care About",
        venue: "Greyd Conversations #14",
        url: "https://www.youtube.com/watch?v=1BvoYchYAAk",
        role: "Guest",
        withWhom: "host Jessica Lyschik, with Tome Pajkovski",
        note: "Why reaching for headless rarely fixes a performance problem that is really unoptimised PHP.",
        image: "greyd-conversations-14",
      },
      {
        date: "2026-01-15",
        title: "From Tech Enthusiast to Digital Agency Founder",
        venue: "Changing Lives with Codeable",
        url: "https://www.youtube.com/watch?v=aO61zBL6x6w",
        role: "Guest",
        note: "The long version of the career, from first project to running an agency.",
        image: "codeable-changing-lives",
      },
      {
        date: "2025-04-11",
        title: "Is it time for WordPress distros?",
        venue: "Kinsta Talk",
        url: "https://www.youtube.com/watch?v=z4bQhNh1Pdw",
        role: "Guest",
        note: "Performance, custom builds, and why WooCommerce stopped being just a plugin.",
        image: "kinsta-talk-distros",
      },
      {
        date: "2022-09-14",
        title: "Finding Work With Codeable and Working With WooCommerce",
        venue: "WP Tavern Jukebox #42",
        url: "https://wptavern.com/podcast/42-marcel-schmitz-on-finding-work-with-codeable-and-working-with-woocommerce",
        role: "Guest",
        withWhom: "host Nathan Wrigley",
        note: "Recorded on the floor at WordCamp Europe in Porto.",
        image: "wptavern-jukebox-42",
      },
      {
        date: "2021-06-22",
        title: "The Benefits of WooCommerce Freelancing with a Company",
        venue: "Do the Woo",
        url: "https://openchannels.fm/the-benefits-of-freelancing-with-a-company-with-christopher-churchill-and-marcel-schmitz/",
        role: "Guest",
        withWhom: "Christopher Churchill",
        note: "Three years before joining the same network as a host.",
      },
      {
        date: "2021-02-24",
        title: "WooCommerce Live: eCommerce Design",
        venue: "WooCommerce",
        url: "https://www.youtube.com/watch?v=JliqsUgtwkE",
        role: "Guest",
        withWhom: "hosts Noëlle Steegs and Jonathan Wold",
        note: "First impressions, impersonating your customer, and treating branding as a revenue decision, on the official WooCommerce channel.",
        image: "woocommerce-live-design",
      },
    ],
  },
  {
    id: "talks",
    title: "Talks on video",
    blurb:
      "Conference sessions that made it to tape. Portuguese unless noted. The 2026 WordCamp Portugal pair are the current agentic material; the 2017 one is a period piece.",
    items: [
      {
        date: "2026-05-19",
        title: "A Nova Era do WordPress: De Developer a Arquiteto com Engenharia Agêntica",
        venue: "WordCamp Portugal 2026",
        url: "https://wordpress.tv/2026/05/19/a-nova-era-do-wordpress-de-developer-a-arquiteto-com-engenharia-agentica/",
        role: "Speaker",
        note: "55 minutes on orchestrating agents instead of writing code line by line.",
        image: "wctv-nova-era",
      },
      {
        date: "2026-05-19",
        title: "WP Agentic Admin",
        venue: "WordCamp Portugal 2026",
        url: "https://wordpress.tv/2026/05/19/wp-agentic-admin/",
        role: "Speaker",
        note: "The privacy-first admin assistant that runs entirely in the browser.",
        image: "wctv-agentic-admin",
      },
      {
        date: "2025-11-24",
        title: "Como instalar e integrar um servidor MCP com WooCommerce e ChatGPT",
        venue: "WordPress Day Porto 2025",
        url: "https://wordpress.tv/2025/11/24/como-instalar-e-integrar-um-servidor-mcp-com-woocommerce-e-chatgpt-para-criar-um-bot-inteligente-par/",
        role: "Speaker",
        image: "wctv-mcp-woocommerce",
      },
      {
        date: "2024-05-20",
        title: "Simplificando o WordPress para Empresas: Temas e Plugins Customizados",
        venue: "WordCamp Porto 2024",
        url: "https://wordpress.tv/2024/05/20/simplificando-o-wordpress-para-empresas-construindo-temas-e-plugins-customizados-com-sinergia-de-eq/",
        role: "Speaker",
        image: "wctv-simplificando",
      },
      {
        date: "2019-10-01",
        title: "Augmented Reality and WooCommerce",
        venue: "WPSessions",
        url: "https://wpsessions.com/sessions/augmented-reality-and-woocommerce/",
        role: "Speaker",
        dateApprox: true,
        note: "In English. Building AR into mobile apps backed by WooCommerce.",
        image: "wpsessions-ar",
      },
      {
        date: "2017-06-05",
        title: "Lojas on-line com WooCommerce: o que faz, o que não faz e o que deveria fazer",
        venue: "WordCamp Lisboa 2017",
        url: "https://wordpress.tv/2017/06/05/marcel-schmitz-lojas-on-line-com-woocommerce-o-que-faz-o-que-nao-faz-e-o-que-deveria-fazer/",
        role: "Speaker",
        note: "The earliest one on record.",
        image: "wctv-lisboa-2017",
      },
    ],
  },
];

export interface PressItem {
  date: string;
  title: string;
  venue: string;
  url: string;
}

// Coverage, not appearances. Kept separate so the distinction stays honest:
// these are articles about the work, not conversations Marcel took part in.
export const PRESS: PressItem[] = [
  {
    date: "2018-06-05",
    title: "WordCamp for iOS Renamed to WP Camps, More Events Added",
    venue: "WP Tavern",
    url: "https://wptavern.com/wordcamp-for-ios-renamed-to-wp-camps-more-events-added",
  },
  {
    date: "2018-05-21",
    title: "Marcel Schmitz Releases Unofficial WordCamp for iOS App",
    venue: "WP Tavern",
    url: "https://wptavern.com/marcel-schmitz-releases-unofficial-wordcamp-for-ios-app",
  },
];

export const ALL_APPEARANCES = APPEARANCE_GROUPS.flatMap((g) => g.items);
