import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(name) {
  return readFileSync(join(repoRoot, name), "utf8");
}

test("header nav has no About link", () => {
  const html = readRepoFile("index.html");
  assert.ok(!html.includes('href="#about"'), 'index.html still links to "#about"');
  assert.ok(!html.includes(">About<"), 'index.html still has an "About" link label');
});

test("page has no About section", () => {
  const html = readRepoFile("index.html");
  assert.ok(!html.includes('id="about"'), 'index.html still has id="about"');
  assert.ok(!html.includes('class="about"'), 'index.html still has class="about"');
  assert.ok(!html.includes("About the Designer"), 'index.html still has "About the Designer"');
});

test("stylesheet has no About rules", () => {
  assert.doesNotMatch(readRepoFile("style.css"), /\.about\b/, "style.css still has .about rules");
});

test("header nav still links Collections and Contact", () => {
  const html = readRepoFile("index.html");
  assert.ok(html.includes('href="#collections"'), 'index.html is missing the "#collections" link');
  assert.ok(html.includes('href="#contact"'), 'index.html is missing the "#contact" link');
});

test("removed about-sketch image is gone and unreferenced", () => {
  assert.ok(
    !existsSync(join(repoRoot, "images/about-sketch.svg")),
    "images/about-sketch.svg still exists",
  );
  const referencing = ["index.html", "style.css", "script.js", "README.md"].filter((name) =>
    readRepoFile(name).includes("about-sketch"),
  );
  assert.deepEqual(referencing, [], `about-sketch still referenced in: ${referencing.join(", ")}`);
});
