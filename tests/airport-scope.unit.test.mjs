import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function sourceFiles(directory) {
  const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(relative));
    else if (/\.(?:ts|tsx|js|jsx|mjs)$/.test(entry.name)) files.push(relative);
  }

  return files;
}

test("shipping source limits the airport pilot to DCA and IAD", async () => {
  const files = [...await sourceFiles("app"), ...await sourceFiles("lib")];
  const violations = [];

  for (const file of files) {
    const source = await readFile(new URL(file, root), "utf8");
    if (/\bBWI\b|Baltimore\s*\/\s*Washington/i.test(source)) violations.push(file);
  }

  assert.deepEqual(violations, []);
});
