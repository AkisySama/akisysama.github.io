import { getCollection, type CollectionEntry } from "astro:content";
import { pathForPost, stripMarkdownExtension } from "./slug";

export type BlogPost = CollectionEntry<"blog">;

export const DEFAULT_POST_COVER = "/images/default-post-cover.jpeg";

export function getPostSlug(post: BlogPost): string {
  return stripMarkdownExtension(post.id);
}

export function getPostUrl(post: BlogPost): string {
  return pathForPost(getPostSlug(post));
}

export function getPostCover(post: BlogPost): string {
  return post.data.cover ?? DEFAULT_POST_COVER;
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

export function getPostDescription(post: BlogPost): string {
  if (post.data.description) return post.data.description;

  return (post.body ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[[^\]]+]\([^)]+\)/g, "")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
