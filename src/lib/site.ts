export const SITE = {
  name: "Marcel Schmitz",
  url: "https://marcelschmitz.com",
  title: "Marcel Schmitz, software engineer, Porto",
  description:
    "Notes on agentic development, security and social engineering, and the craft of software, from a Porto-based engineer with 25+ years in the trade.",
  author: "Marcel Schmitz",
  email: "marcel@pluginslab.com",
  locale: "en",
  social: [
    { label: "GitHub", href: "https://github.com/pluginslab" },
    { label: "LinkedIn", href: "https://linkedin.com/in/marcelschmitz" },
    { label: "Instagram", href: "https://instagram.com/schmitzoide" },
    { label: "SoundCloud", href: "https://soundcloud.com/marcelschmitz" },
    { label: "Pluginslab", href: "https://pluginslab.com" },
  ],
  sameAs: [
    "https://github.com/pluginslab",
    "https://linkedin.com/in/marcelschmitz",
    "https://instagram.com/schmitzoide",
    "https://soundcloud.com/marcelschmitz",
    "https://pluginslab.com",
    "https://oide.photography",
  ],
  jobTitle: "Software Engineer",
  worksFor: { name: "Pluginslab", url: "https://pluginslab.com" },
  location: { city: "Porto", country: "Portugal" },
} as const;

export const NAV = [
  { label: "Writing", href: "/" },
  { label: "About", href: "/about" },
  { label: "Up Next", href: "/up-next" },
  { label: "Hire", href: "https://app.codeable.io/tasks/new?preferredContractor=22877&ref=4BTzD" },
] as const;
