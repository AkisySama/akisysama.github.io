import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const styles = read("src/styles/global.css");
const header = read("src/components/Header.astro");
const postCard = read("src/components/PostCard.astro");

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
  "--color-icon: #9aa7b5",
  "--color-icon-soft: #b8c1cc",
  "--color-icon-faint: #d7dee8",
  "--shadow-raised:",
  "--shadow-inset:",
]) {
  assert.ok(styles.includes(token), `Missing theme token ${token}`);
}

for (const selector of [
  ".neumo-surface",
  ".hero-showcase",
  ".icon-muted",
  ".post-card-no-cover",
  ".post-grid .post-card-description",
  ".tag-sidebar",
  ".footer-social",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(styles.includes(selector), `Missing selector ${selector}`);
}

assert.ok(styles.includes("-webkit-line-clamp: 5"), "Homepage post cards should clamp long excerpts");
assert.ok(postCard.includes("post-card-no-cover"), "PostCard should handle posts without covers");
assert.match(
  header,
  /aria-current=\{[^}]*["']page["'][^}]*\}/,
  "Header should expose the active page",
);

console.log("Verified neumorphic anime theme contract.");
