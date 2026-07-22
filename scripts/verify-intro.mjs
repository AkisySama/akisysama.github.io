import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const intro = read("src/components/IntroSequence.astro");
const timeline = read("src/components/TimelineDrawer.astro");

assert.ok(baseLayout.includes('<slot name="intro" />'), "Base layout should render the intro before the header");
assert.ok(baseLayout.includes('data-page={isHome ? "home" : "inner"}'), "Base layout should identify the homepage");
assert.ok(baseLayout.includes('data-intro={isHome ? "pending" : undefined}'), "Homepage should reset the intro on every refresh");
assert.ok(!baseLayout.includes("sessionStorage"), "Refresh playback should not be suppressed by session state");
assert.ok(homepage.includes('<IntroSequence slot="intro" />'), "Homepage should mount the intro sequence");

for (const contract of [
  "terminal-window",
  "terminal-titlebar",
  "terminal-transcript",
  "terminal-output-line",
  "entry-line",
  "SCROLL TO ENTER",
  "journalctl --boot --priority=notice --no-pager",
  "npx vectorize ./memory --dimensions=1536 --incremental",
  "curl -s localhost:4321/health | jq -C",
  "all systems nominal — journal ready",
  'window.addEventListener("wheel", handleWheel, { passive: false })',
  'window.addEventListener("touchend", handleTouchEnd, { passive: true })',
  '"ArrowDown", "PageDown", " "',
  "prefers-reduced-motion: reduce",
  'document.addEventListener("astro:page-load", setupIntro)',
]) {
  assert.ok(intro.includes(contract), `Intro sequence missing ${contract}`);
}

assert.match(intro, /min-height:\s*135svh/, "Intro should create a deliberate scroll-to-enter journey");
assert.match(intro, /window\.scrollTo\(/, "Skip action should enter the blog");
assert.ok(baseLayout.includes('history.scrollRestoration = "manual"'), "Scroll restoration must be disabled before paint");
assert.ok(baseLayout.includes('window.addEventListener("pageshow", resetIntroScroll)'), "Restored scroll should be corrected after pageshow");
assert.ok(baseLayout.includes('window.addEventListener("beforeunload"'), "Refresh should save the homepage at scroll position zero");
assert.ok(intro.includes("Math.abs(window.scrollY - blogTop) > 2"), "One gesture should settle exactly at the blog top");
assert.ok(intro.includes('root.dataset.blogEntered = "true"'), "Entering the blog should reveal homepage utilities");
assert.ok(
  timeline.includes(':not([data-blog-entered="true"]) .timeline-shell'),
  "Timeline should stay hidden until the homepage intro has been entered",
);
assert.match(intro, /aria-live="polite"/, "Terminal progress should be announced without interrupting visitors");

assert.match(intro, /line-grow 2\.5s/, "Entry line should fully appear over 2.5 seconds");
assert.match(intro, /line-bob 2\.4s ease-in-out 2\.5s infinite/, "Completed entry line should bob gently");
assert.ok(!intro.includes("ascii-portrait"), "Intro should no longer render an ASCII portrait");
assert.ok(!intro.includes("anime_character_ascii"), "Intro should no longer load the portrait source");
assert.match(intro, /terminalSequence\.length/, "Terminal should play the complete command pipeline");

console.log("Verified simulated terminal intro contract.");
