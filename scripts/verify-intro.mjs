import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const intro = read("src/components/IntroSequence.astro");
const timeline = read("src/components/TimelineDrawer.astro");

assert.ok(baseLayout.includes('<slot name="intro" />'), "Base layout should render the intro before the header");
assert.ok(baseLayout.includes('data-page={isHome ? "home" : "inner"}'), "Base layout should identify the homepage");
assert.ok(homepage.includes('<IntroSequence slot="intro" />'), "Homepage should mount the intro sequence");

for (const asset of [
  "public/audio/rain-window-loop.m4a",
  "public/fonts/PressStart2P-Regular.ttf",
  "public/images/intro/pixel-room-side-open.webp",
  "public/images/intro/pixel-room-side-enter.webp",
  "public/images/intro/pixel-room-side-blink.webp",
  "public/images/intro/rain-clock-device.webp",
]) {
  assert.ok(existsSync(join(root, asset)), `Intro artwork missing ${asset}`);
}

for (const contract of [
  "data-pixel-rain",
  "data-rain-audio",
  "data-rain-sound",
  "rain-window-loop.m4a",
  'window.addEventListener("wheel", handleWheel',
  'window.addEventListener("touchend", handleTouchEnd',
  "entryController.abort()",
  '"ArrowDown", "PageDown", " ", "Enter"',
  "prefers-reduced-motion: reduce",
  'document.addEventListener("astro:page-load", setupIntro)',
]) {
  assert.ok(intro.includes(contract), `Intro sequence missing ${contract}`);
}

assert.match(
  intro,
  /aria-label="进入博客"/,
  "The intro entry action should retain an accessible name",
);
assert.match(
  intro,
  /rainAudio\.play\(\)/,
  "The intro should attempt to start its looping rain audio",
);
assert.match(
  intro,
  /window\.addEventListener\("pointerdown", handleRainSoundUnlock/,
  "A first pointer gesture should unlock audio when autoplay is blocked",
);
assert.match(
  intro,
  /button\.setAttribute\("aria-pressed", String\(isOn\)\)/,
  "Rain-sound controls should expose their current state",
);
assert.equal(
  statSync(join(root, "public/audio/rain-window-loop.m4a")).size < 3 * 1024 * 1024,
  true,
  "The processed two-minute loop should stay below 3MB",
);
assert.match(intro, /height:\s*100svh/, "Intro should fill the opening viewport");
assert.match(intro, /window\.scrollTo\(/, "Entry action should scroll into the blog");
assert.ok(baseLayout.includes('history.scrollRestoration = "manual"'), "Scroll restoration must be disabled before paint");
assert.ok(
  baseLayout.includes('document.addEventListener("astro:before-swap", cleanupHomeScroll'),
  "Homepage-only scroll listeners should be removed during client navigation",
);
assert.ok(intro.includes('root.dataset.blogEntered = "true"'), "Entering the blog should reveal homepage utilities");
assert.ok(
  timeline.includes(':not([data-blog-entered="true"]) .timeline-shell'),
  "Timeline should stay hidden until the homepage intro has been entered",
);

console.log("Verified intro assets, entry controls, audio accessibility, and cleanup contracts.");
