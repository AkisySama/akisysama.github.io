export function stripMarkdownExtension(id: string): string {
  return id.replace(/\.mdx?$/, "");
}

export function pathForPost(slug: string): string {
  return `/posts/${slug}/`;
}
