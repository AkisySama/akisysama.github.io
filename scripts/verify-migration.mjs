import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

const requiredFiles = [
  "astro.config.mjs",
  "src/content.config.ts",
  "src/pages/posts/[...slug].astro",
  "src/pages/[...legacy].astro",
  "src/data/url-mapping.csv",
  "public/images/t1.PNG",
  "public/assets/ring.webp",
];

const removedHexoPaths = [
  "_config.yml",
  "_config.stellar.yml",
  "_config.landscape.yml",
  "scaffolds",
  "source",
  "test/sakura-shape.test.js",
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(root, file)), `Missing required migration file: ${file}`);
}

for (const file of removedHexoPaths) {
  assert.ok(!existsSync(join(root, file)), `Hexo-era path should be removed: ${file}`);
}

const mappingPath = join(root, "src/data/url-mapping.csv");
const rows = readFileSync(mappingPath, "utf8")
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

assert.equal(rows[0], "old-url,new-url,status", "URL mapping header changed");

const mappings = rows.slice(1).map((row) => {
  const [oldUrl, newUrl, status] = row.split(",");
  return { oldUrl, newUrl, status };
});

assert.ok(mappings.length >= 8, "Expected at least eight migrated post URL mappings");

for (const mapping of mappings) {
  assert.ok(mapping.oldUrl.startsWith("/20"), `Unexpected old URL: ${mapping.oldUrl}`);
  assert.ok(mapping.newUrl.startsWith("/posts/"), `Unexpected new URL: ${mapping.newUrl}`);
  assert.equal(mapping.status, "changed", `Unexpected mapping status for ${mapping.oldUrl}`);
}

console.log(`Verified ${mappings.length} migrated URL mappings.`);
