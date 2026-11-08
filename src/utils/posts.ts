import { getCollection, type CollectionEntry } from "astro:content";
import { pathForPost, stripMarkdownExtension } from "./slug";

export type BlogPost = CollectionEntry<"blog">;

export function getPostSlug(post: BlogPost): string {
  return stripMarkdownExtension(post.id);
}

export function getPostUrl(post: BlogPost): string {
  return pathForPost(getPostSlug(post));
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return sortPostsByDate(posts);
}

function getPlainText(post: BlogPost): string {
  return (post.body ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, "")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPostDescription(post: BlogPost): string {
  return post.data.description || getPlainText(post).slice(0, 120);
}

/** Readable characters in the post, ignoring markup, code blocks and whitespace. */
export function getPostLength(post: BlogPost): number {
  return getPlainText(post).replace(/\s/g, "").length;
}

/** Record numbers count up from the oldest post, so new posts never renumber old ones. */
export function getMemoryNumbers(postsNewestFirst: BlogPost[]): Map<string, number> {
  return new Map(postsNewestFirst.map((post, index) => [post.id, postsNewestFirst.length - index]));
}

export function formatMemoryId(number: number): string {
  return String(number).padStart(3, "0");
}
