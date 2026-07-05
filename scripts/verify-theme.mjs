import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");
const cssRule = (selector) =>
  styles.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const styles = read("src/styles/global.css");
const header = read("src/components/Header.astro");
const postCard = read("src/components/PostCard.astro");
const blogPostLayout = read("src/layouts/BlogPostLayout.astro");
const postsUtil = read("src/utils/posts.ts");

assert.match(
  baseLayout,
  /import\s+\{\s*ClientRouter\s*\}\s+from\s+["']astro:transitions["']/,
  "BaseLayout should import Astro ClientRouter",
);
assert.match(baseLayout, /<ClientRouter\s*\/>/, "BaseLayout should render ClientRouter");

for (const className of [
  "home-hero",
  "hero-copy",
  "hero-actions",
  "hero-stats",
  "hero-showcase",
  "home-content-grid",
  "tag-sidebar",
]) {
  assert.ok(homepage.includes(className), `Homepage missing ${className}`);
}

assert.ok(homepage.includes("/images/background.jpeg"), "Homepage should use the anime showcase image");
assert.ok(homepage.includes("热门标签"), "Homepage should render the hot tags section");
assert.ok(homepage.includes("getTagCounts"), "Homepage should derive hot tags from post data");

for (const token of [
  "--color-bg: #eef1f7",
  "--color-surface: #eef1f7",
  "--color-surface-soft: #eceff6",
  "--color-border: #d7dce7",
  "--color-accent: #2f6bea",
  "--color-accent-soft: #dfe7fb",
  "--color-code-bg: #e6eaf2",
  "--color-icon: #93a5bc",
  "--color-icon-soft: #b0bed0",
  "--color-icon-faint: #d4deec",
  "--shadow-raised:",
  "--shadow-inset:",
  "--shadow-sunken-soft:",
  "--shadow-button-raised:",
  "--shadow-button-pressed:",
]) {
  assert.ok(styles.includes(token), `Missing theme token ${token}`);
}

assert.ok(
  styles.includes(':root[data-theme="dark"]'),
  "Theme styles should expose an explicit dark color-token set",
);
assert.match(
  styles,
  /@media\s*\(prefers-color-scheme:\s*dark\)[\s\S]*:root:not\(\[data-theme\]\)/,
  "Theme styles should follow the system preference before a choice is stored",
);
assert.match(
  baseLayout,
  /localStorage\.getItem\(["']akisy-theme["']\)/,
  "BaseLayout should restore a saved theme before rendering",
);
assert.match(
  baseLayout,
  /matchMedia\(["']\(prefers-color-scheme: dark\)["']\)/,
  "BaseLayout should use the system preference when no theme is saved",
);
assert.match(
  baseLayout,
  /document\.documentElement\.dataset\.theme\s*=/,
  "BaseLayout should apply the resolved theme to the root element",
);
assert.match(
  header,
  /<button[^>]+class=["']theme-toggle["'][^>]+aria-label=["'][^"']+["']/,
  "Header should render an accessible theme toggle button",
);
assert.match(
  header,
  /localStorage\.setItem\(["']akisy-theme["']/,
  "Theme toggle should persist the visitor's explicit choice",
);
assert.ok(
  header.includes("astro:before-swap"),
  "Theme toggle should carry the active theme into Astro's incoming document",
);
assert.ok(header.includes("astro:page-load"), "Theme toggle should survive Astro page transitions");

for (const selector of [
  ".neumo-surface",
  ".hero-showcase",
  ".icon-muted",
  ".post-grid .post-card-description",
  ".tag-sidebar",
  ".footer-social",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(styles.includes(selector), `Missing selector ${selector}`);
}

assert.ok(styles.includes("-webkit-line-clamp: 5"), "Homepage post cards should clamp long excerpts");
assert.match(
  cssRule(".home-hero"),
  /box-shadow:\s*var\(--shadow-raised-strong\);/,
  "Homepage hero panel should use the strong raised neumorphic shadow",
);
assert.match(
  cssRule(".latest-posts"),
  /box-shadow:\s*var\(--shadow-raised-strong\);/,
  "Latest posts panel should use the strong raised neumorphic shadow",
);
assert.match(
  cssRule(".tag-sidebar"),
  /align-self:\s*stretch;/,
  "Hot tags sidebar should stretch to align with the latest posts panel",
);
assert.match(
  cssRule(".post-card"),
  /align-content:\s*start;/,
  "Post card rows should stay top-aligned when cards stretch to equal heights",
);
assert.match(
  cssRule(".site-nav a,\n.pill-link,\n.footer-social a"),
  /box-shadow:\s*var\(--shadow-button-raised\);/,
  "Primary clickable pills should use the raised button shadow",
);
assert.match(
  cssRule(".site-nav a:hover,\n.site-nav a[aria-current=\"page\"],\n.pill-link:hover,\n.footer-social a:hover"),
  /box-shadow:\s*var\(--shadow-button-pressed\);/,
  "Primary clickable pills should press inward on hover or active state",
);
assert.match(
  cssRule(".header-orb,\n.theme-toggle"),
  /box-shadow:\s*var\(--shadow-button-raised\);/,
  "Header utility controls should read as raised clickable controls",
);
assert.match(
  cssRule(".tag-list a,\n.tag-cloud a"),
  /box-shadow:\s*var\(--shadow-button-raised\);/,
  "Tag pills should use the raised button shadow",
);
assert.match(
  cssRule(".tag-sidebar a"),
  /box-shadow:\s*var\(--shadow-button-raised\);/,
  "Sidebar tag rows should read as raised clickable controls",
);
assert.ok(postsUtil.includes("DEFAULT_POST_COVER"), "Posts utility should define a default cover");
assert.ok(
  postsUtil.includes("/images/default-post-cover.jpeg"),
  "Default post cover should point to the bundled fallback image",
);
assert.ok(postCard.includes("getPostCover"), "PostCard should render fallback covers");
assert.ok(blogPostLayout.includes("getPostCover"), "BlogPostLayout should render fallback covers");
assert.match(
  header,
  /aria-current=\{[^}]*["']page["'][^}]*\}/,
  "Header should expose the active page",
);

console.log("Verified neumorphic anime theme contract.");
