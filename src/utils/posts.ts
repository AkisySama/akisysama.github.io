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

export function getAllTags(posts: BlogPost[]): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.data.tags))).sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) => post.data.tags.includes(tag));
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

export function getReadingMinutes(post: BlogPost): number {
  return Math.max(1, Math.round(getPostLength(post) / 400));
}

/** Record numbers count up from the oldest post, so new posts never renumber old ones. */
export function getMemoryNumbers(postsNewestFirst: BlogPost[]): Map<string, number> {
  return new Map(postsNewestFirst.map((post, index) => [post.id, postsNewestFirst.length - index]));
}

export function formatMemoryId(number: number): string {
  return String(number).padStart(3, "0");
}
