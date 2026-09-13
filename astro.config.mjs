import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const isDevelopmentServer = process.argv.includes("dev");
// Vite's normal dependency hash does not notice edits made by local patches.
// Include the patch version in optimizer options to invalidate cached bundles.
const keystaticPatchVersion = createHash("sha256")
  .update(readFileSync(new URL("./scripts/fix-keystatic-sort.mjs", import.meta.url)))
  .digest("hex")
  .slice(0, 12);

function openBlogAlongsideKeystatic() {
  let devServer;
  let opened = false;

  return {
    name: "open-blog-alongside-keystatic",
    hooks: {
      "astro:server:setup": ({ server }) => { devServer = server; },
      "astro:server:start": () => {
        if (opened || process.env.npm_lifecycle_event !== "dev" || !devServer) return;
        const originalOpen = devServer.config.server.open;
        if (originalOpen !== "/keystatic") return;
        opened = true;
        // Reuse Vite's browser handling and resolved URL, including fallback ports.
        try {
          devServer.config.server.open = "/";
          devServer.openBrowser();
        } finally {
          devServer.config.server.open = originalOpen;
        }
      },
    },
  };
}

function refreshContentAfterKeystaticSave() {
  const contentDirectory = resolve("src/content/blog");

  const getContentSnapshot = () =>
    new Map(
      readdirSync(contentDirectory)
        .filter((filename) => /\.mdx?$/.test(filename))
        .map((filename) => {
          const path = resolve(contentDirectory, filename);
          const stats = statSync(path);
          return [path, `${stats.mtimeMs}:${stats.size}`];
        }),
    );

  return {
    name: "refresh-content-after-keystatic-save",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const isKeystaticSave =
          request.method === "POST" && request.url?.startsWith("/api/keystatic/update");

        if (isKeystaticSave) {
          const beforeSave = getContentSnapshot();

          response.once("finish", () => {
            const afterSave = getContentSnapshot();

            for (const [path, signature] of afterSave) {
              if (!beforeSave.has(path)) {
                server.watcher.emit("add", path);
              } else if (beforeSave.get(path) !== signature) {
                server.watcher.emit("change", path);
              }
            }

            for (const path of beforeSave.keys()) {
              if (!afterSave.has(path)) server.watcher.emit("unlink", path);
            }

            setTimeout(() => server.ws.send({ type: "full-reload" }), 150);
          });
        }

        next();
      });
    },
  };
}

export default defineConfig({
  site: "https://akisysama.github.io",
  // Keystatic's local JSON API uses slashless endpoints. Production keeps the
  // blog's existing trailing-slash URL policy.
  trailingSlash: isDevelopmentServer ? "ignore" : "always",
  devToolbar: { enabled: false },
  // The writing dashboard is local-only. Keeping these integrations out of the
  // production build preserves the existing fully static GitHub Pages output.
  integrations: isDevelopmentServer ? [react(), keystatic(), openBlogAlongsideKeystatic()] : [],
  vite: {
    // Keep the writing dashboard's patched Keystatic bundle isolated from
    // `astro check` and production builds, which use Vite's default cache.
    cacheDir: isDevelopmentServer ? "node_modules/.vite-keystatic" : undefined,
    // Astro's client router is discovered only after a blog page is opened.
    // Let Vite serve these ESM modules directly so that the late discovery
    // cannot rebuild the dependency graph underneath an open Keystatic tab.
    optimizeDeps: isDevelopmentServer
      ? {
          esbuildOptions: {
            define: { __AKISY_KEYSTATIC_PATCH_VERSION__: JSON.stringify(keystaticPatchVersion) },
          },
          exclude: [
            "astro/virtual-modules/transitions-router.js",
            "astro/virtual-modules/transitions-types.js",
            "astro/virtual-modules/transitions-events.js",
            "astro/virtual-modules/transitions-swap-functions.js",
          ],
        }
      : undefined,
    plugins: isDevelopmentServer ? [refreshContentAfterKeystaticSave()] : [],
  },
});
