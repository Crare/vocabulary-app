#!/usr/bin/env node
/**
 * Checks all src/wordsets/words*.json files for:
 *   1. Duplicate words within the same set (lang1 or lang2)
 *   2. Duplicate words across different sets (lang1 or lang2)
 *
 * Exits with code 1 if any conflicts are found.
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wordsetsDir = join(__dirname, "../src/wordsets");

const files = readdirSync(wordsetsDir)
  .filter((f) => /^words\d+\.json$/.test(f))
  .sort();

/** @type {Map<string, {file: string, index: number}[]>} */
let totalConflicts = 0;

for (const file of files) {
  const path = join(wordsetsDir, file);
  const set = JSON.parse(readFileSync(path, "utf8"));
  const words = set.words ?? [];

  const seenLang1 = new Map();
  const seenLang2 = new Map();

  for (let i = 0; i < words.length; i++) {
    const { lang1, lang2 } = words[i];

    const l1key = lang1.trim().toLowerCase();
    const l2key = lang2.trim().toLowerCase();

    if (seenLang1.has(l1key)) {
      console.error(
        `[${file}] Duplicate lang1 "${lang1}" at index ${i} (first seen at index ${seenLang1.get(l1key)})`,
      );
      totalConflicts++;
    } else {
      seenLang1.set(l1key, i);
    }

    if (seenLang2.has(l2key)) {
      console.error(
        `[${file}] Duplicate lang2 "${lang2}" at index ${i} (first seen at index ${seenLang2.get(l2key)})`,
      );
      totalConflicts++;
    } else {
      seenLang2.set(l2key, i);
    }
  }
}

if (totalConflicts === 0) {
  console.log(`✓ No conflicts found across ${files.length} wordset(s).`);
  process.exit(0);
} else {
  console.error(`\n✗ ${totalConflicts} conflict(s) found.`);
  process.exit(1);
}
