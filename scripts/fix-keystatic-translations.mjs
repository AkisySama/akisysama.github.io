import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const keystaticDist = resolve(projectRoot, "node_modules/@keystatic/core/dist");

const replacements = new Map([
  ['"branchName": `分店名称`', '"branchName": `分支名称`'],
  ['"branches": `分支机构`', '"branches": `分支`'],
  ['"clear": `透明`', '"clear": `清除`'],
  ['"collection": `收藏`', '"collection": `内容集合`'],
  ['"collections": `收藏品`', '"collections": `内容集合`'],
  ['"create": `创造`', '"create": `创建`'],
  ['"newBranch": `新分行`', '"newBranch": `新分支`'],
  ['"otherBranches": `其他分行`', '"otherBranches": `其他分支`'],
  ['"save": `节省`', '"save": `保存`'],
  ['"singleton": `单例`', '"singleton": `单项内容`'],
  ['"singletons": `单例`', '"singletons": `单项内容`'],
]);

let foundChineseLocale = false;

for (const filename of readdirSync(keystaticDist)) {
  if (!/^index-.*\.js$/.test(filename)) continue;

  const path = resolve(keystaticDist, filename);
  let source = readFileSync(path, "utf8");
  if (!source.includes('"zh-CN": {')) continue;

  foundChineseLocale = true;

  for (const [incorrect, corrected] of replacements) {
    source = source.replace(incorrect, corrected);
  }

  writeFileSync(path, source);
}

if (!foundChineseLocale) {
  throw new Error("Could not find the Keystatic zh-CN locale bundle to patch.");
}

console.log("Applied Akisy's Keystatic Chinese translation fixes.");
