import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const styles = read("src/styles/global.css");
const header = read("src/components/Header.astro");
const metroScene = read("src/components/MetroScene.astro");

assert.match(baseLayout, /import\s+\{\s*ClientRouter\s*\}\s+from\s+["']astro:transitions["']/);
assert.match(baseLayout, /<ClientRouter\s*\/>/);
assert.match(baseLayout, /localStorage\.getItem\(["']akisy-theme["']\)/);

assert.ok(homepage.includes("getPublishedPosts"), "Homepage should render published blog content");
assert.ok(homepage.includes("<MetroScene />"), "Homepage should include the metro scene");
assert.ok(
  metroScene.includes("@media (prefers-reduced-motion: reduce)"),
  "Metro scene should respect reduced motion",
);

assert.ok(styles.includes(':root[data-theme="light"]'), "Theme should retain an optional light reading mode");
assert.ok(styles.includes("@media (max-width: 720px)"), "Theme should include a mobile layout");
assert.ok(styles.includes("@media (prefers-reduced-motion: reduce)"), "Theme should respect reduced motion");

assert.match(header, /aria-current=\{[^}]*["']page["'][^}]*\}/);
assert.match(header, /<button[^>]+class=["']theme-toggle["'][^>]+aria-label=/);
assert.ok(header.includes("localStorage.setItem"), "Theme choice should persist");
assert.ok(header.includes("astro:before-swap"), "Theme should survive page transitions");

console.log("Verified navigation, content, theme, and accessibility contracts.");
