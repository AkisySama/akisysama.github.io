# Astro Neumorphic Anime Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved restrained light-neumorphic Astro blog theme with a large anime homepage showcase and unified light-gray icon chrome.

**Architecture:** Keep the existing Astro routes and content utilities. Add one contract verification script, install a focused Astro icon package, then update the current layout, header, footer, post card, tag list, homepage, and global CSS without introducing a new UI framework.

**Tech Stack:** Astro 6, TypeScript, Node test scripts, CSS custom properties, Astro view transitions, /astro icons.

## Global Constraints

- Preserve the current blog information architecture: home, posts, tags, about, and post detail pages.
- Homepage image showcase starts with `/images/background.jpeg`.
- Avatar continues to use `/images/whitehairblueeyes.jpeg`.
- Icon system uses light gray and cool gray-blue only, around `#9aa7b5`, `#b8c1cc`, and `#d7dee8`.
- No carousel, auto-rotating gallery, heavy animation, or interactive image controls.
- Add Astro view transitions in `BaseLayout.astro` and respect `prefers-reduced-motion`.
- Existing routes and content must continue to work.

---

### Task 1: Add Theme Contract Verification

**Files:**
- Create: `scripts/verify-theme.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: source files under `src/`
- Produces: `npm test` runs `node scripts/verify-theme.mjs` after migration verification.

- [ ] **Step 1: Write the failing verification script**

Create `scripts/verify-theme.mjs` with source-level contract checks:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (file) => readFileSync(join(root, file), "utf8");

const baseLayout = read("src/layouts/BaseLayout.astro");
const homepage = read("src/pages/index.astro");
const styles = read("src/styles/global.css");
const header = read("src/components/Header.astro");

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
  ".tag-sidebar",
  ".footer-social",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(styles.includes(selector), `Missing selector ${selector}`);
}

assert.match(
  header,
  /aria-current=\{[^}]*["']page["'][^}]*\}/,
  "Header should expose the active page",
);

console.log("Verified neumorphic anime theme contract.");
```

- [ ] **Step 2: Wire the verification script into `npm test`**

Change the `test` script in `package.json` to:

```json
"test": "astro check && node scripts/verify-migration.mjs && node scripts/verify-theme.mjs"
```

- [ ] **Step 3: Run test to verify it fails**

Run:

```bash
npm test
```

Expected: `astro check` and `verify-migration.mjs` pass, then `verify-theme.mjs` fails because `BaseLayout.astro` does not yet import `ClientRouter`.

---

### Task 2: Add Layout Shell, View Transitions, And Header State

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: Astro URL from `Astro.url.pathname`
- Produces: active nav state, view transitions, footer social controls, and stable class hooks used by CSS.

- [ ] **Step 1: Install the icon package**

Run:

```bash
npm install --save-dev /astro
```

Expected: `package.json` and `package-lock.json` include `/astro`.

- [ ] **Step 2: Update `BaseLayout.astro`**

Add:

```astro
import { ClientRouter } from "astro:transitions";
```

Render `<ClientRouter />` inside `<head>`, and wrap the body with existing `Header`, `.site-main`, and `Footer` unchanged except for any needed class hooks.

- [ ] **Step 3: Update `Header.astro` active state**

Use `Astro.url.pathname` to compute active nav items. Render links with:

```astro
aria-current={isActive ? "page" : undefined}
```

Keep the same nav labels and brand assets.

- [ ] **Step 4: Update `Footer.astro` gray social controls**

Keep existing footer copy, add a `.footer-social` group with three text-accessible gray controls: `GitHub`, `关于`, and `文章`. Link them to `https://github.com/akisysama`, `/about/`, and `/posts/`. Ensure each icon-like glyph is wrapped in `.icon-muted`.

- [ ] **Step 5: Run focused verification**

Run:

```bash
npm test
```

Expected: the test still fails on homepage/CSS contract checks, but no longer fails on ClientRouter or header active state.

---

### Task 3: Rebuild Homepage Structure

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getPublishedPosts()`
- Produces: `latestPosts`, `tagCounts`, hero showcase, stats, and hot-tag sidebar for CSS.

- [ ] **Step 1: Compute latest posts and hot tags**

Use the existing posts array and add:

```ts
const featuredPosts = posts.slice(0, 4);
const tagCounts = getTagCounts(posts).slice(0, 8);
```

Define `getTagCounts` locally in the page:

```ts
function getTagCounts(allPosts: typeof posts) {
  const counts = new Map<string, number>();

  for (const post of allPosts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}
```

- [ ] **Step 2: Replace the hero markup**

Use `.home-hero`, `.hero-copy`, `.hero-actions`, `.hero-stats`, and `.hero-showcase`. Link actions to `/posts/` and `/tags/`.

- [ ] **Step 3: Replace latest-post section layout**

Use `.home-content-grid` with latest post cards on the left and `.tag-sidebar` on the right.

- [ ] **Step 4: Run focused verification**

Run:

```bash
npm test
```

Expected: the test still fails on missing CSS tokens/selectors until Task 4 is done.

---

### Task 4: Implement Neumorphic CSS System

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/PostCard.astro`
- Modify: `src/components/TagList.astro`
- Modify: `src/layouts/BlogPostLayout.astro` if class hooks are needed

**Interfaces:**
- Consumes: class hooks from existing components and Task 3
- Produces: visual theme tokens, muted icon styling, responsive layout, post cards, tags, prose, and reduced-motion behavior.

- [ ] **Step 1: Replace theme tokens**

Add the required tokens:

```css
--color-icon: #9aa7b5;
--color-icon-soft: #b8c1cc;
--color-icon-faint: #d7dee8;
--shadow-raised: 10px 10px 24px rgb(163 177 198 / 28%), -10px -10px 24px rgb(255 255 255 / 90%);
--shadow-inset: inset 6px 6px 14px rgb(163 177 198 / 20%), inset -6px -6px 14px rgb(255 255 255 / 86%);
```

- [ ] **Step 2: Add reusable CSS hooks**

Include `.neumo-surface`, `.icon-muted`, `.pill-link`, `.hero-showcase`, `.tag-sidebar`, `.footer-social`, `.home-content-grid`, and responsive rules.

- [ ] **Step 3: Restyle existing cards, tags, prose, and cover images**

Keep existing component markup wherever possible. Add only semantic class hooks needed for gray metadata icons and layout.

- [ ] **Step 4: Add motion constraints**

Add:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

---

### Task 5: Browser Visual QA And Design QA Report

**Files:**
- Create: `design-qa.md`
- Create as generated evidence if needed: `tmp/theme-qa/*.png`
- Modify CSS/components only if QA finds P0/P1/P2 issues.

**Interfaces:**
- Consumes: source reference `docs/superpowers/specs/2026-06-21-astro-neumorphic-anime-theme-reference.png`
- Produces: rendered screenshot evidence and `design-qa.md` with `final result: passed` or `final result: blocked`.

- [ ] **Step 1: Start local server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Astro dev server prints a local URL.

- [ ] **Step 2: Capture homepage desktop and mobile screenshots**

Open the local URL in the browser, capture `/` at desktop width and mobile width, and save screenshots under `tmp/theme-qa/`.

- [ ] **Step 3: Compare against the selected reference**

Create a side-by-side comparison input using the reference image and desktop screenshot, then review fonts/typography, spacing/layout rhythm, colors/tokens, image quality, and copy/content.

- [ ] **Step 4: Write `design-qa.md`**

Report source visual path, implementation screenshot path, viewport, state, findings, patches made, and `final result`.

- [ ] **Step 5: Fix blocking findings**

If `design-qa.md` has actionable P0/P1/P2 findings, patch CSS/components, rerun `npm test`, capture again, and update `design-qa.md`.

---

### Task 6: Final Verification And Commit

**Files:**
- All modified source/test/QA files.

**Interfaces:**
- Consumes: completed tasks
- Produces: clean build/test result and committed implementation.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 2: Check git status and diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only theme, test, plan, and QA files are modified; the pre-existing `Hexo to Astro Migration Spec.docx` remains untracked and untouched.

- [ ] **Step 3: Commit implementation**

Run:

```bash
git add package.json package-lock.json scripts/verify-theme.mjs src docs/superpowers/plans/2026-06-21-astro-neumorphic-anime-theme.md design-qa.md
git commit -m "feat: add neumorphic anime blog theme"
```

Expected: commit succeeds on `codex/astro-neumorphic-theme`.

## Self-Review

- Spec coverage: tasks cover view transitions, homepage showcase, gray icon system, existing routes, responsive behavior, testing, and design QA.
- Placeholder scan: no unfinished-marker language remains.
- Type consistency: `getTagCounts` is local to `src/pages/index.astro`; class hooks used by tests are produced by homepage/CSS tasks.
