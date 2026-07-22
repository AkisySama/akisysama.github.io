import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const isDevelopmentServer = process.argv.includes("dev");

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
  integrations: isDevelopmentServer ? [react(), keystatic()] : [],
  vite: {
    // Keep the writing dashboard's patched Keystatic bundle isolated from
    // `astro check` and production builds, which use Vite's default cache.
    cacheDir: isDevelopmentServer ? "node_modules/.vite-keystatic" : undefined,
    // Astro's client router is discovered only after a blog page is opened.
    // Let Vite serve these ESM modules directly so that the late discovery
    // cannot rebuild the dependency graph underneath an open Keystatic tab.
    optimizeDeps: isDevelopmentServer
      ? {
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
