import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = join(dirname(thisFile), "..");
const skippedDirs = new Set([".git", "node_modules", ".review"]);
const oldBrand = /atelier/i;
const previousBrand = /maison norr/i;

function walk(dir) {
  const paths = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skippedDirs.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    const isDirectory = entry.isDirectory();
    paths.push({ path: fullPath, isDirectory });
    if (isDirectory) paths.push(...walk(fullPath));
  }
  return paths;
}

function readRepoFile(name) {
  return readFileSync(join(repoRoot, name), "utf8");
}

test('no file contains the old brand name "Atelier"', () => {
  const textFiles = walk(repoRoot)
    .filter(({ path, isDirectory }) => !isDirectory && path !== thisFile)
    .map(({ path }) => path);
  const hits = [];
  for (const file of textFiles) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (oldBrand.test(line)) {
          hits.push(`${relative(repoRoot, file)}:${i + 1}: ${line.trim()}`);
        }
      });
  }
  assert.deepEqual(hits, [], `old brand name found:\n${hits.join("\n")}`);
});

test('no file or folder name contains "atelier"', () => {
  const bad = walk(repoRoot)
    .map(({ path }) => relative(repoRoot, path))
    .filter((p) => p.split(/[\\/]/).some((segment) => oldBrand.test(segment)));
  assert.deepEqual(bad, [], `paths still named after old brand: ${bad.join(", ")}`);
});

test('no file contains the old brand name "Maison Norr"', () => {
  const textFiles = walk(repoRoot)
    .filter(({ path, isDirectory }) => !isDirectory && path !== thisFile)
    .map(({ path }) => path);
  const hits = [];
  for (const file of textFiles) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (previousBrand.test(line)) {
          hits.push(`${relative(repoRoot, file)}:${i + 1}: ${line.trim()}`);
        }
      });
  }
  assert.deepEqual(hits, [], `previous brand name found:\n${hits.join("\n")}`);
});

test("page title uses Maison Nor", () => {
  assert.ok(
    readRepoFile("index.html").includes("<title>Maison Nor | Fashion Design</title>"),
    "index.html <title> is not 'Maison Nor | Fashion Design'",
  );
});

test("header logo shows Maison Nor", () => {
  assert.ok(
    readRepoFile("index.html").includes('<h1 class="logo">Maison Nor</h1>'),
    "index.html header logo is not 'Maison Nor'",
  );
});

test("footer copyright names Maison Nor", () => {
  assert.ok(
    readRepoFile("index.html").includes("&copy; 2026 Maison Nor."),
    "index.html footer copyright does not name Maison Nor",
  );
});

test("stylesheet header comment names Maison Nor", () => {
  assert.ok(
    readRepoFile("style.css").startsWith("/* Maison Nor fashion theme"),
    "style.css does not start with '/* Maison Nor fashion theme'",
  );
});

test("image references still resolve after rename", () => {
  const refs = ["script.js", "index.html"].flatMap((name) =>
    [...readRepoFile(name).matchAll(/images\/[\w-]+\.svg/g)].map((m) => ({ name, path: m[0] })),
  );
  assert.ok(refs.length > 0, "no images/*.svg references found");
  const missing = refs.filter(({ path }) => !existsSync(join(repoRoot, path)));
  assert.deepEqual(
    missing,
    [],
    `missing images: ${missing.map(({ name, path }) => `${name} -> ${path}`).join(", ")}`,
  );
});
