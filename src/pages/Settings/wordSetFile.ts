import { WordSet } from "../../wordsets/types";

const isPairObject = (w: unknown) => !!w && typeof w === "object";

/**
 * Parse an imported word set file. Returns null when the text is not JSON or
 * not shaped like a word set (a name plus `words`, and optional `sentences`,
 * made of { lang1, lang2 } objects).
 */
export const parseWordSetFile = (text: string): WordSet | null => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  const set = parsed as Partial<WordSet> | null;
  if (
    !set ||
    typeof set !== "object" ||
    !set.name ||
    !Array.isArray(set.words) ||
    !set.words.every(isPairObject) ||
    (set.sentences !== undefined &&
      (!Array.isArray(set.sentences) || !set.sentences.every(isPairObject)))
  ) {
    return null;
  }
  return set as WordSet;
};
