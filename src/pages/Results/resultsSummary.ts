import { HistoryEntry, TestWord } from "../Testing/types";
import { calculateTotalScore } from "./resultUtils";

/**
 * How often the learner did not know a word: skipped plus revealed answers.
 * The test now has one "I don't know" action; older results still carry a
 * separate skip count, so both are added.
 *
 * Local fallback until the testing redesign adds `timesDidntKnow` to
 * resultUtils.ts; switch to that helper once it lands.
 */
export const didntKnowCount = (word: TestWord): number =>
  (word.timesCheckedAnswer ?? 0) + (word.timesSkipped ?? 0);

export interface WordOutcome {
  right: number;
  wrong: number;
  didntKnow: number;
  /** Right answers as a whole percentage of all answers (0 when none). */
  accuracy: number;
}

export const wordOutcome = (word: TestWord): WordOutcome => {
  const right = word.timesCorrect;
  const wrong = word.timesFailed;
  const didntKnow = didntKnowCount(word);
  const total = right + wrong + didntKnow;
  return {
    right,
    wrong,
    didntKnow,
    accuracy: total === 0 ? 0 : Math.round((right / total) * 100),
  };
};

/** True when the word got any wrong or "didn't know" answer. */
export const hasMistake = (word: TestWord): boolean => {
  const o = wordOutcome(word);
  return o.wrong + o.didntKnow > 0;
};

/** "3 right · 2 wrong · 1 didn't know", leaving out zero counts after the first. */
export const formatOutcome = (o: WordOutcome): string =>
  [
    `${o.right} right`,
    o.wrong > 0 ? `${o.wrong} wrong` : "",
    o.didntKnow > 0 ? `${o.didntKnow} didn’t know` : "",
  ]
    .filter(Boolean)
    .join(" · ");

/**
 * Words with mistakes first (worst accuracy first), then the words answered
 * right in test order. Words never asked (a test ended early) are in neither.
 */
export const splitByMistakes = (
  words: TestWord[],
): { mistakes: TestWord[]; right: TestWord[] } => {
  const mistakes = words
    .filter(hasMistake)
    .sort((a, b) => wordOutcome(a).accuracy - wordOutcome(b).accuracy);
  const right = words.filter((w) => !hasMistake(w) && w.timesCorrect > 0);
  return { mistakes, right };
};

/** Accuracy of a whole test as a whole percentage (0 when nothing was answered). */
export const testAccuracy = (words: TestWord[]): number => {
  const { correct, total } = calculateTotalScore(words);
  return total === 0 ? 0 : Math.round((correct / total) * 100);
};

/** Sorted word pairs, so two tests of the same words match in any order. */
const wordKey = (words: TestWord[]): string =>
  words
    .map((w) => `${w.lang1Word}\u0000${w.lang2Word}`)
    .sort()
    .join("\u0001");

/**
 * Change in accuracy from the last earlier test of exactly the same words, in
 * percentage points. `entries` are newest first and include the test just
 * finished, which `Main` saves before the results show. Retests of a few words
 * and other parts of a split set share the list name but are not compared.
 * Null when there is no earlier test of the same words.
 */
export const accuracyChange = (entries: HistoryEntry[]): number | null => {
  const [current, ...earlier] = entries;
  if (!current) return null;
  const key = wordKey(current.wordResults);
  const previous = earlier.find((e) => wordKey(e.wordResults) === key);
  if (!previous) return null;
  return (
    testAccuracy(current.wordResults) - testAccuracy(previous.wordResults)
  );
};

/** Short heading that matches the score. */
export const scoreHeadline = (accuracy: number): string => {
  if (accuracy >= 100) return "Perfect round";
  if (accuracy >= 80) return "Great work";
  if (accuracy >= 60) return "Good progress";
  return "Keep practising";
};
