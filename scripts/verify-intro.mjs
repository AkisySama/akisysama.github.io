import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const intro = read("src/components/IntroSequence.astro");
const introScreenRenderer = read("scripts/render-intro-enter-screen.mjs");
const rainAudioGenerator = read("scripts/generate-rain-audio.mjs");
const timeline = read("src/components/TimelineDrawer.astro");

assert.ok(baseLayout.includes('<slot name="intro" />'), "Base layout should render the intro before the header");
assert.ok(baseLayout.includes('data-page={isHome ? "home" : "inner"}'), "Base layout should identify the homepage");
assert.ok(baseLayout.includes('data-intro={isHome ? "pending" : undefined}'), "Homepage should reset the intro on every refresh");
assert.ok(!baseLayout.includes("sessionStorage"), "Refresh playback should not be suppressed by session state");
assert.ok(homepage.includes('<IntroSequence slot="intro" />'), "Homepage should mount the intro sequence");

for (const asset of [
  "public/audio/rain-window-loop.m4a",
  "public/fonts/PressStart2P-Regular.ttf",
  "public/fonts/PressStart2P-OFL.txt",
  "public/images/intro/pixel-room-side-open.webp",
  "public/images/intro/pixel-room-side-enter.webp",
  "public/images/intro/pixel-room-side-blink.webp",
  "public/images/intro/rain-clock-device.webp",
]) {
  assert.ok(existsSync(join(root, asset)), `Intro artwork missing ${asset}`);
}

for (const contract of [
  "pixel-scene",
  "pixel-room-side-enter.webp",
  "pixel-room-side-blink.webp",
  "data-blink-frame",
  "data-pixel-rain",
  "data-rain-audio",
  "data-rain-sound",
  "rain-window-loop.m4a",
  "RAIN:",
  "进入博客",
  "CLICK SCREEN · SCROLL DOWN",
  "SWIPE UP · ENTER",
  "scene-coordinate-space",
  "scheduleBlink",
  "startRainSound",
  "pauseRainSound",
  "soundUnlocked",
  "soundPlayAttempt",
  "rainFrameInterval",
  "rainContext.clip(rainGlassMask)",
  'rainContext.globalCompositeOperation = "destination-out"',
  "rainContext.fill(rainForegroundMask)",
  "requestAnimationFrame(drawRainFrame)",
  "is-blinking",
  "Math.random()",
  'window.addEventListener("wheel", handleWheel',
  'window.addEventListener("touchend", handleTouchEnd',
  "signal: entryController.signal",
  "entryController.abort()",
  'motionQuery.addEventListener("change", handleMotionChange)',
  '"IntersectionObserver" in window',
  "window.cancelAnimationFrame(rainAnimationFrame)",
  '"ArrowDown", "PageDown", " ", "Enter"',
  "prefers-reduced-motion: reduce",
  'document.addEventListener("astro:page-load", setupIntro)',
]) {
  assert.ok(intro.includes(contract), `Intro sequence missing ${contract}`);
}

assert.ok(!intro.includes("terminal-window"), "Intro should no longer render a simulated terminal");
assert.ok(!intro.includes("terminalSequence"), "Intro should no longer run a terminal command sequence");
assert.ok(!intro.includes(".animate("), "Blinking should not depend on the Web Animations API");
assert.ok(!intro.includes("getAnimations"), "Blinking should use a broadly compatible frame switch");
assert.ok(!intro.includes("@keyframes pixel-blink"), "Blinking should switch frames without smooth tweening");
assert.ok(!intro.includes("doubleBlink"), "Blinking should never schedule a second consecutive blink");
assert.ok(!intro.includes("handleScenePointer"), "Clicking the scene should not trigger a blink");
assert.ok(!intro.includes('addEventListener("pointerup"'), "The scene should not install a pointer blink listener");
assert.ok(!intro.includes("finishEntry"), "Entering should not permanently finish or disable the intro");
assert.ok(!intro.includes("let entering"), "Entry should not use an irreversible one-shot state");
assert.ok(!intro.includes(".is-entering"), "Entry should not dim or hide the opening scene");
assert.doesNotMatch(
  intro,
  /\.pixel-scene\s*\{[^}]*cursor:\s*pointer/s,
  "The non-interactive scene should not show a hand cursor",
);
assert.match(
  intro,
  /\.pixel-scene\s*\{[^}]*cursor:\s*default/s,
  "The scene should explicitly restore the default cursor",
);
assert.match(
  intro,
  /\.intro-enter\s*\{[^}]*top:\s*70\.03%[^}]*left:\s*75\.18%[^}]*clip-path:\s*polygon\(/s,
  "The semantic entry button should align to the laptop screen polygon",
);
assert.match(
  intro,
  /aria-label="进入博客"/,
  "The image-aligned laptop entry target should retain an accessible name",
);
assert.match(
  intro,
  /1000\s*\/\s*16/,
  "Heavy rain should update at a smoother 16fps while retaining pixel-art stepping",
);
assert.match(
  intro,
  /drop\.length = 16 \+ Math\.floor\(randomRain\(\) \* 5\) \* 4/,
  "Rain streaks should use the larger 16–32px pixel-art scale",
);
assert.match(
  intro,
  /drop\.width = randomRain\(\) > 0\.78 \? 4 : 3/,
  "Rain streaks should be visibly thicker without increasing their count",
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
  /window\.addEventListener\("click", handleRainSoundUnlock/,
  "A first click should retry audio for browsers that grant activation on click",
);
assert.match(
  intro,
  /if \(playAttempt !== soundPlayAttempt\)/,
  "Stale playback promises should not overwrite the latest sound state",
);
assert.match(
  intro,
  /button\.setAttribute\("aria-pressed", String\(isOn\)\)/,
  "Both responsive rain-sound controls should expose their current state",
);
assert.match(
  intro,
  /\.intro-sound-clock\s*\{[^}]*top:\s*43\.7832%[^}]*left:\s*90\.4306%[^}]*width:\s*8\.6124%[^}]*height:\s*8\.5016%/s,
  "The desktop rain-sound control should align to the source-image clock",
);
assert.match(
  intro,
  /\.intro-sound-mobile\s*\{[^}]*width:\s*116px[^}]*height:\s*64px/s,
  "The narrow-screen clock fallback should retain a comfortable touch target",
);
assert.match(
  intro,
  /fadeRainSound\(0\.38\)/,
  "The normalized source recording should use a restrained ambient volume",
);
assert.match(
  intro,
  /introAudible = \(entry\?\.intersectionRatio \?\? 1\) >= 0\.18/,
  "Rain audio should fade out before the opening scene has almost completely left view",
);
assert.match(
  intro,
  /!soundControlAvailable\(\)[\s\S]*!introAudible[\s\S]*!documentVisible[\s\S]*!soundDesired/,
  "Rain audio should pause when its control is unavailable, the intro is offscreen, the tab is hidden, or sound is disabled",
);
assert.match(intro, /},\s*165\);/, "Closed-eye frame should be held briefly as one discrete beat");
assert.match(
  intro,
  /initial\s*\?\s*5000\s*\+\s*Math\.random\(\)\s*\*\s*3000\s*:\s*9000\s*\+\s*Math\.random\(\)\s*\*\s*6000/,
  "Automatic blinks should be infrequent and randomized",
);
assert.match(
  intro,
  /object-position:\s*var\(--scene-position-x\)\s+center/,
  "Rain and artwork should share the same responsive crop",
);
assert.match(
  intro,
  /--scene-position-x:\s*98%[\s\S]*--scene-translate-x:\s*-98%/,
  "Intermediate landscape crops should keep the right-side clock visible and aligned",
);
assert.equal(
  statSync(join(root, "public/audio/rain-window-loop.m4a")).size < 3 * 1024 * 1024,
  true,
  "The processed two-minute loop should stay below 3MB",
);
assert.match(
  rainAudioGenerator,
  /trimStartSeconds = 125[\s\S]*loopDurationSeconds = 120[\s\S]*crossfadeSeconds = 4/,
  "The supplied recording should skip its long fade-in and use a four-second loop seam",
);
assert.match(
  rainAudioGenerator,
  /tailGain = Math\.cos\(\(Math\.PI \* progress\) \/ 2\)[\s\S]*headGain = Math\.sin\(\(Math\.PI \* progress\) \/ 2\)/,
  "The loop seam should retain its equal-power cosine/sine crossfade",
);
assert.match(
  intro,
  /const enterBlog = \(\) => \{[\s\S]*?if \(enterScrollTimer\) return;[\s\S]*?markEntered\(\);[\s\S]*?enterScrollTimer = 0;[\s\S]*?window\.scrollTo\(/,
  "The laptop entry action should be repeatable after its short debounce",
);
assert.match(
  intro,
  /const handleScroll = \(\) => \{[\s\S]*?markEntered\(\);[\s\S]*?\};/,
  "Manual scrolling should reveal blog utilities without disabling entry",
);
assert.equal(
  intro.match(/entryController\.abort\(\)/g)?.length,
  1,
  "Entry listeners should only be removed during component cleanup",
);
assert.ok(
  introScreenRenderer.includes("playIconBounds") &&
    introScreenRenderer.includes("playIconEraseMask"),
  "The rendered laptop entry screen should remove the original play triangle",
);
assert.match(intro, /height:\s*100svh/, "Intro should fill the opening viewport");
assert.match(intro, /window\.scrollTo\(/, "Entry action should scroll into the blog");
assert.ok(baseLayout.includes('history.scrollRestoration = "manual"'), "Scroll restoration must be disabled before paint");
assert.ok(
  baseLayout.includes('currentRoot.dataset.blogEntered === "true"'),
  "Late load events should not reset scroll after the visitor enters the blog",
);
assert.ok(baseLayout.includes('window.addEventListener("pageshow", resetIntroScroll)'), "Restored scroll should be corrected after pageshow");
assert.ok(baseLayout.includes('window.addEventListener("beforeunload"'), "Refresh should save the homepage at scroll position zero");
assert.ok(
  baseLayout.includes('document.addEventListener("astro:before-swap", cleanupHomeScroll'),
  "Homepage-only scroll listeners should be removed during client navigation",
);
assert.ok(intro.includes('root.dataset.blogEntered = "true"'), "Entering the blog should reveal homepage utilities");
assert.ok(
  timeline.includes(':not([data-blog-entered="true"]) .timeline-shell'),
  "Timeline should stay hidden until the homepage intro has been entered",
);

console.log("Verified pixel-art gaze and blink intro contract.");
