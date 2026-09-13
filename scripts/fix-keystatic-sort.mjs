import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bundle = resolve(projectRoot, "node_modules/@keystatic/core/dist/keystatic-core-ui.js");
const original = `let [sortDescriptor, setSortDescriptor] = useState({
    column: SLUG,
    direction: 'ascending'
  });`;
const replacement = `let [sortDescriptor, setSortDescriptor] = useState({
    column: props.collection === 'blog' ? 'pubDate' : SLUG,
    direction: props.collection === 'blog' ? 'descending' : 'ascending'
  });`;

const source = readFileSync(bundle, "utf8");
if (!source.includes(replacement)) {
  if (source.split(original).length !== 2) {
    throw new Error("Keystatic's default sorting code changed; review the date sorting patch.");
  }
  writeFileSync(bundle, source.replace(original, replacement));
  // Discard the prebundled UI so the next dev session uses the new default.
  rmSync(resolve(projectRoot, "node_modules/.vite-keystatic"), { recursive: true, force: true });
}

console.log("Applied Keystatic blog sorting: newest publication date first.");
