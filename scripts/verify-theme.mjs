import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const styles = read("src/styles/global.css");
const header = read("src/components/Header.astro");
const footer = read("src/components/Footer.astro");

assert.match(baseLayout, /import\s+\{\s*ClientRouter\s*\}\s+from\s+["']astro:transitions["']/);
assert.match(baseLayout, /<ClientRouter\s*\/>/);
assert.match(baseLayout, /localStorage\.getItem\(["']akisy-theme["']\)/);
assert.match(baseLayout, /:\s*["']dark["'];/, "The redesigned blog should default to the dark theme");

for (const className of [
  "editorial-hero",
  "hero-copy",
  "hero-portrait",
  "focus-strip",
  "focus-grid",
  "editorial-grid",
  "featured-list",
  "journal-feature",
  "photo-selection",
]) {
  assert.ok(homepage.includes(className), `Homepage missing ${className}`);
}

assert.ok(
  homepage.includes("/images/digital-island-signal.webp"),
  "Homepage should use the supplied digital-island signal artwork",
);
assert.ok(homepage.includes("getPublishedPosts"), "Homepage should use real blog content");
assert.ok(homepage.includes("selectedImages"), "Homepage should render the monochrome photo selection");

for (const token of [
  "--color-bg: #030405",
  "--color-surface: #090a0b",
  "--color-text: #ded8cc",
  "--color-heading: #eee8dc",
  "--color-accent: #d2c4aa",
  "--font-serif:",
]) {
  assert.ok(styles.includes(token), `Missing editorial theme token ${token}`);
}

assert.ok(styles.includes(':root[data-theme="light"]'), "Theme should retain an optional light reading mode");
assert.ok(styles.includes("@media (max-width: 720px)"), "Theme should include a mobile layout");
assert.ok(styles.includes("@media (prefers-reduced-motion: reduce)"), "Theme should respect reduced motion");
assert.ok(!styles.includes("linear-gradient"), "Editorial theme should not fake image depth with CSS gradients");
for (const selector of [".journal-card > img", ".photo-grid img", ".post-card-cover img", ".post-cover"]) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  assert.ok(!rule.includes("grayscale"), `${selector} should preserve the original image colors`);
}

assert.match(header, /aria-current=\{[^}]*["']page["'][^}]*\}/);
assert.match(header, /<button[^>]+class=["']theme-toggle["'][^>]+aria-label=/);
assert.ok(header.includes("localStorage.setItem"), "Theme choice should persist");
assert.ok(header.includes("astro:before-swap"), "Theme should survive page transitions");
assert.ok(!header.includes("A.K."), "Main header should not render the A.K. mark");
assert.ok(footer.includes("快速导航"), "Footer should expose quick navigation");
assert.ok(footer.includes("保持联系"), "Footer should retain the reference-inspired editorial layout");
assert.ok(footer.includes("<blockquote>"), "Footer should render its editorial quote");

console.log("Verified dark editorial digital-island theme contract.");
