import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = join(dirname(thisFile), "..");

function readRepoFile(name) {
  return readFileSync(join(repoRoot, name), "utf8");
}

test("hero section contains Spring / Summer Collection eyebrow", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    content.includes('<p class="eyebrow">Spring / Summer Collection</p>'),
    "index.html hero eyebrow is not 'Spring / Summer Collection'",
  );
});

test("hero section contains 'Clothes that tell your story' heading", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    content.includes("<h2>Clothes that tell your story</h2>"),
    "index.html hero heading is not 'Clothes that tell your story'",
  );
});

test("hero section has eyebrow before heading", () => {
  const content = readRepoFile("index.html");
  const eyebrowIndex = content.indexOf('<p class="eyebrow">Spring / Summer Collection</p>');
  const headingIndex = content.indexOf("<h2>Clothes that tell your story</h2>");
  assert.ok(
    eyebrowIndex !== -1 && headingIndex !== -1,
    "hero section is missing eyebrow or heading",
  );
  assert.ok(
    eyebrowIndex < headingIndex,
    "eyebrow should appear before heading in the HTML",
  );
});

test("old seasonal text 'Autumn / Winter' is no longer in hero", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    !content.includes("Autumn / Winter Collection"),
    "old 'Autumn / Winter Collection' text is still in the file",
  );
});

test("old hero heading 'Designs made to be worn' is no longer in index.html", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    !content.includes("Designs made to be worn"),
    "old 'Designs made to be worn' heading is still in the file",
  );
});
