# Hexo to Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the Hexo blog with an Astro static blog while preserving published posts, necessary static assets, and compatibility for old Hexo URLs.

**Architecture:** Astro content collections will own blog posts under `src/content/blog`. Reusable Astro layouts and components will render the home page, post index, post detail pages, tag pages, and about page. A generated URL mapping CSV plus an Astro catch-all static route will emit meta-refresh redirect pages for each old Hexo permalink.

**Tech Stack:** Astro, TypeScript, Markdown content collections, plain CSS, npm, GitHub Actions Pages deployment.

## Global Constraints

- Use `/posts/:slug/` as the new article URL structure.
- Generate `src/data/url-mapping.csv` with `old-url,new-url,status`.
- Generate static redirect pages for every old Hexo URL in the mapping.
- Keep existing published Markdown posts and necessary image assets.
- Do not migrate Hexo framework config, themes, plugins, scaffolds, deploy config, or old theme JS.
- Use GitHub Pages with GitHub Actions and upload Astro `dist`.
- Use one package manager; this migration keeps npm because the repo already used npm.
- Keep the first-stage theme custom, responsive, readable, and light on client JavaScript.

---

### Task 1: Migration Verifier

**Files:**
- Create: `scripts/verify-migration.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: filesystem output from the migration.
- Produces: `npm test` command that runs `astro check` and verifies migration invariants.

- [x] **Step 1: Write the failing verifier**

Create `scripts/verify-migration.mjs` to assert:

```js
const requiredFiles = [
  "astro.config.mjs",
  "src/content.config.ts",
  "src/pages/posts/[...slug].astro",
  "src/pages/[...legacy].astro",
  "src/data/url-mapping.csv",
  "public/images/t1.PNG",
  "public/assets/ring.webp",
];
```

It must also parse `src/data/url-mapping.csv`, require a header of `old-url,new-url,status`, require at least eight mapped posts, require every `old-url` to start with `/20`, require every `new-url` to start with `/posts/`, and require every status to be `changed`.

- [x] **Step 2: Run verifier to verify it fails**

Run: `node scripts/verify-migration.mjs`

Expected: FAIL with missing Astro files because the project is still Hexo.

- [x] **Step 3: Wire verifier into npm scripts after Astro package migration**

Set `test` to `astro check && node scripts/verify-migration.mjs`.

- [x] **Step 4: Commit after the verifier passes at the end**

Commit message: `test: add astro migration verifier`.

### Task 2: Astro Project Shell

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content.config.ts`
- Delete: `_config.yml`
- Delete: `_config.landscape.yml`
- Delete: `_config.stellar.yml`
- Delete: `scaffolds/`
- Delete: `source/_data/widgets.yml`
- Delete: `source/js/sakura.js`
- Delete: `test/sakura-shape.test.js`

**Interfaces:**
- Consumes: npm dependency installation.
- Produces: Astro build, check, preview, and dev scripts.

- [x] **Step 1: Replace Hexo dependencies**

Use `astro`, `@astrojs/check`, and `typescript`. Use scripts:

```json
{
  "dev": "astro dev",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "test": "astro check && node scripts/verify-migration.mjs"
}
```

- [x] **Step 2: Configure Astro**

Create `astro.config.mjs` with `site: "https://akisysama.github.io"` and `trailingSlash: "always"`.

- [x] **Step 3: Configure content collection**

Create `src/content.config.ts` with `glob()` loaders and `title`, `description`, `pubDate`, `updatedDate`, `tags`, `categories`, `draft`, `slug`, and `cover`.

- [x] **Step 4: Remove Hexo-only files**

Remove Hexo config, scaffolds, theme data, old theme JavaScript, and its old test.

### Task 3: Content And Asset Migration

**Files:**
- Create: `src/content/blog/*.md`
- Create: `src/content/pages/about.md`
- Create: `public/images/**`
- Create: `public/assets/**`
- Delete: `source/`

**Interfaces:**
- Consumes: `source/_posts`, `source/about/index.md`, `source/images`, and `source/assets`.
- Produces: Astro-compatible content and public assets.

- [x] **Step 1: Copy posts**

Move the eight published posts into `src/content/blog/`.

- [x] **Step 2: Normalize frontmatter**

Convert `date` to `pubDate`, convert scalar `tags` to arrays, set `draft: false`, and set `slug` to the original file stem.

- [x] **Step 3: Copy assets**

Move `source/images/**` to `public/images/**` and `source/assets/**` to `public/assets/**`.

- [x] **Step 4: Preserve about content**

Store the old about page body in `src/content/pages/about.md` for rendering by the new about route.

### Task 4: Blog UI And Routes

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/BlogPostLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`
- Create: `src/utils/posts.ts`
- Create: `src/utils/dates.ts`
- Create: `src/utils/slug.ts`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[...slug].astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

**Interfaces:**
- Consumes: Astro blog content collection.
- Produces: home, about, post index, post detail, and tag routes.

- [x] **Step 1: Implement post utilities**

Provide functions for fetching non-draft posts, deriving slugs from frontmatter or file ids, sorting by date, formatting dates in `zh-CN`, and collecting tags.

- [x] **Step 2: Implement layouts and components**

Build a custom responsive layout with header, footer, post cards, tag lists, and article layout.

- [x] **Step 3: Implement routes**

Build the required pages with static paths for `/posts/:slug/` and `/tags/:tag/`.

- [x] **Step 4: Implement styles**

Use plain CSS variables and responsive layout rules. Keep code blocks readable and images constrained.

### Task 5: URL Mapping And Redirects

**Files:**
- Create: `src/data/url-mapping.csv`
- Create: `src/pages/[...legacy].astro`

**Interfaces:**
- Consumes: old Hexo permalink format `/:year/:month/:day/:title/`.
- Produces: mapping CSV and static redirect pages.

- [x] **Step 1: Generate mapping**

For every post, write one row:

```csv
old-url,new-url,status
/2024/03/24/docker/,/posts/docker/,changed
```

- [x] **Step 2: Generate redirect static paths**

Parse the CSV and return catch-all static paths for old URLs. Each page must include canonical link, robots noindex, and meta refresh to the new URL.

- [x] **Step 3: Verify redirect output**

After `npm run build`, check that `dist/2024/03/24/docker/index.html` exists and contains `/posts/docker/`.

### Task 6: Deployment And Final Verification

**Files:**
- Modify: `.github/workflows/pages.yml`
- Modify: `.github/dependabot.yml`

**Interfaces:**
- Consumes: npm scripts and Astro `dist`.
- Produces: GitHub Pages deployment workflow.

- [x] **Step 1: Update workflow**

Use Node 24, npm cache, `npm ci`, `npm run build`, and upload `./dist`.

- [x] **Step 2: Run final checks**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

- [x] **Step 3: Review git diff**

Confirm Hexo-only files are gone, Astro files are present, mapped redirects exist, and no `node_modules` or `dist` files are tracked.
