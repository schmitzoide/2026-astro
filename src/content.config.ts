import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { fetchPosts, fetchPages, type Heading } from "./lib/wp";

const wordpressPostsLoader = (): Loader => ({
  name: "wordpress-posts",
  load: async ({ store, logger, parseData }) => {
    logger.info("Fetching posts from WordPress…");
    const posts = await fetchPosts();
    store.clear();
    for (const post of posts) {
      const data = await parseData({
        id: post.id,
        data: {
          ...post,
          publishDate: new Date(post.publishDate),
          updatedDate: new Date(post.updatedDate),
        },
      });
      store.set({ id: post.id, data });
    }
    logger.info(`Loaded ${posts.length} posts`);
  },
});

const wordpressPagesLoader = (): Loader => ({
  name: "wordpress-pages",
  load: async ({ store, logger, parseData }) => {
    logger.info("Fetching pages from WordPress…");
    const pages = await fetchPages();
    store.clear();
    for (const page of pages) {
      const data = await parseData({
        id: page.id,
        data: {
          ...page,
          updatedDate: new Date(page.updatedDate),
        },
      });
      store.set({ id: page.id, data });
    }
    logger.info(`Loaded ${pages.length} pages`);
  },
});

const posts = defineCollection({
  loader: wordpressPostsLoader(),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    category: z.string(),
    categoryName: z.string(),
    tags: z.array(z.string()).default([]),
    contentHtml: z.string(),
    headings: z.array(
      z.object({
        depth: z.union([z.literal(2), z.literal(3)]),
        text: z.string(),
        slug: z.string(),
      }),
    ) satisfies z.ZodType<Heading[]>,
    wordCount: z.number(),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: wordpressPagesLoader(),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    updatedDate: z.coerce.date(),
    contentHtml: z.string(),
  }),
});

export const collections = { posts, pages };
