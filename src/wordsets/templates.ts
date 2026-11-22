import { WordSet } from "./types";
import set1 from "./words1.json";
import set2 from "./words2.json";
import set3 from "./words3.json";
import set4 from "./words4.json";
import set5 from "./words5.json";
import set6 from "./words6.json";
import set7 from "./words7.json";
import set8 from "./words8.json";
import set9 from "./words9.json";
import set10 from "./words10.json";
import set11 from "./words11.json";
import set12 from "./words12.json";
import set13 from "./words13.json";

/**
 * Built-in word sets, bundled at build time. The order is public: `?template=N`
 * links use the 1-based position in this array, so only append new sets.
 */
export const templates: WordSet[] = [
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
  set9,
  set10,
  set11,
  set12,
  set13,
];

/** Resolves a `?template=` value: a 1-based index or a template name. */
export const findTemplate = (param: string | null): number => {
  if (!param) return -1;
  const idx = parseInt(param, 10) - 1;
  if (!isNaN(idx) && idx >= 0 && idx < templates.length) return idx;
  return templates.findIndex(
    (t) => t.name.toLowerCase() === param.toLowerCase(),
  );
};

/** Points `?template=` at the loaded template, or removes it (null). */
export const setTemplateParam = (index: number | null) => {
  const url = new URL(window.location.href);
  if (index === null) url.searchParams.delete("template");
  else url.searchParams.set("template", String(index + 1));
  window.history.replaceState({}, "", url.toString());
};
