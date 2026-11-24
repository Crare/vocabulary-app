import { randomIntFromInterval } from "../../util/helpers";

/** A sentence with one word replaced by a gap. */
export interface BlankedSentence {
  /** The original sentence. */
  sentence: string;
  /** Text before the gap, including its trailing space (may be empty). */
  before: string;
  /** Text after the gap, including its leading space (may be empty). */
  after: string;
  /** The removed word without punctuation: the expected answer. */
  missingWord: string;
}

const PUNCTUATION = /[.,!?;:"“”‘’'()[\]{}]/g;

export const stripPunctuation = (word: string): string =>
  word.replace(PUNCTUATION, "");

/**
 * Pick a word of the sentence to blank out. With `testAllWords`, words not in
 * `alreadyTested` are preferred; once every word has been asked, any word can
 * come up again.
 */
export function blankOutWord(
  sentence: string,
  testAllWords?: boolean,
  alreadyTested: string[] = [],
): BlankedSentence {
  const words = sentence.trim().split(/\s+/);
  if (words.length <= 1) {
    return { sentence, before: "", after: "", missingWord: sentence.trim() };
  }

  let candidates = words.map((_, i) => i);
  if (testAllWords && alreadyTested.length > 0) {
    const tested = new Set(alreadyTested.map((w) => w.toLowerCase()));
    const untested = candidates.filter((i) => {
      const cleaned = stripPunctuation(words[i]).toLowerCase();
      return cleaned.length > 0 && !tested.has(cleaned);
    });
    if (untested.length > 0) candidates = untested;
  }

  const idx = candidates[randomIntFromInterval(0, candidates.length - 1)];
  const before = words.slice(0, idx).join(" ");
  const after = words.slice(idx + 1).join(" ");
  return {
    sentence,
    before: before ? `${before} ` : "",
    after: after ? ` ${after}` : "",
    missingWord: stripPunctuation(words[idx]),
  };
}
