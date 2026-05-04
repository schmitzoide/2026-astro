import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderPostOg } from "../../../lib/og";
import { SITE } from "../../../lib/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<"posts">>>[number] };
  const png = await renderPostOg({
    title: post.data.title,
    snippet: post.data.description,
    category: post.data.categoryName,
    date: post.data.publishDate,
    author: SITE.author,
  });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
