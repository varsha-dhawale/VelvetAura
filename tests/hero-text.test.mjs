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

test("hero button reads 'Shop the collection' with original href and class", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    content.includes('<a href="#collections" class="btn">Shop the collection</a>'),
    "index.html hero button is not '<a href=\"#collections\" class=\"btn\">Shop the collection</a>'",
  );
});

test("old hero button text 'View Collections' is no longer in index.html", () => {
  const content = readRepoFile("index.html");
  assert.ok(
    !content.includes("View Collections"),
    "old 'View Collections' button text is still in the file",
  );
});

test("hero button appears after the hero heading and inside the hero section", () => {
  const content = readRepoFile("index.html");
  const heroStart = content.indexOf('<section class="hero">');
  const heroEnd = content.indexOf("</section>", heroStart);
  const headingIndex = content.indexOf("<h2>Clothes that tell your story</h2>");
  const buttonIndex = content.indexOf('<a href="#collections" class="btn">Shop the collection</a>');
  assert.ok(
    heroStart !== -1 && heroEnd !== -1 && headingIndex !== -1 && buttonIndex !== -1,
    "hero section, heading or 'Shop the collection' button is missing",
  );
  assert.ok(
    headingIndex < buttonIndex && buttonIndex < heroEnd,
    "'Shop the collection' button should follow the heading inside the hero section",
  );
});
