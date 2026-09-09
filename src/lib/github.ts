// Star counts for /tools/, read once at build time.
//
// One request for the whole account rather than one per repo, so a page with a
// dozen tools still costs a single call and stays well inside the
// unauthenticated rate limit on the deploy host.
//
// Note `/users/`, not `/orgs/`: github.com/pluginslab is a User account, not an
// Organization, and the orgs endpoint 404s on it.
//
// Every failure path returns an empty map instead of throwing. Stars are
// decoration; GitHub being unreachable, rate limiting the build host, or
// changing its response shape must never take the site down with it.

const ACCOUNT = "pluginslab";

export type StarMap = Map<string, number>;

let cache: StarMap | null = null;

export async function fetchStars(): Promise<StarMap> {
  if (cache) return cache;

  const stars: StarMap = new Map();

  try {
    const res = await fetch(
      `https://api.github.com/users/${ACCOUNT}/repos?per_page=100&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "marcelschmitz.com-build",
        },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) {
      console.warn(
        `[github] stars unavailable: ${res.status} ${res.statusText}. Rendering without them.`,
      );
      cache = stars;
      return stars;
    }

    const repos: unknown = await res.json();
    if (!Array.isArray(repos)) {
      console.warn("[github] unexpected response shape. Rendering without stars.");
      cache = stars;
      return stars;
    }

    for (const repo of repos) {
      if (
        repo &&
        typeof repo === "object" &&
        typeof (repo as { name?: unknown }).name === "string" &&
        typeof (repo as { stargazers_count?: unknown }).stargazers_count === "number"
      ) {
        const r = repo as { name: string; stargazers_count: number };
        stars.set(r.name, r.stargazers_count);
      }
    }
  } catch (err) {
    console.warn(
      `[github] stars unavailable: ${err instanceof Error ? err.message : String(err)}. Rendering without them.`,
    );
  }

  cache = stars;
  return stars;
}
