// Marcel writes Portuguese in pt-PT, not pt-BR. Map raw WP language codes
// to BCP-47 tags for Intl.DateTimeFormat / og:locale derivation.
const BCP47: Record<string, string> = {
  en: "en-US",
  pt: "pt-PT",
};

export const bcp47For = (language?: string) =>
  BCP47[language ?? "en"] ?? language ?? "en-US";

// og:locale uses underscore form: "en_US", "pt_PT".
export const ogLocaleFor = (language?: string) =>
  bcp47For(language).replace("-", "_");

export const formatDate = (d: Date, language?: string) =>
  d.toLocaleDateString(bcp47For(language), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatDateLong = (d: Date, language?: string) =>
  d.toLocaleDateString(bcp47For(language), {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatDateMono = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
