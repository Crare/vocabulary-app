import { TestOption, TestSettings, TestWord } from "./types";
import { randomIntFromInterval, stringSimilarity } from "../../util/helpers";

/**
 * The direction of the question: which language is shown vs which is the answer.
 */
export type GuessDirection = "lang1to2" | "lang2to1";

/**
 * Determine which test option (writing, multi-select, or drag-and-drop) to use for the current question.
 */
export function chooseTestOption(
  settings: TestSettings,
  questionIndex: number,
): TestOption {
  const { writing, multiSelect, dragDrop, sentenceFillBlank } =
    settings.testType;

  const enabled: TestOption[] = [];
  if (writing) enabled.push(TestOption.WriteCorrectAnswer);
  if (multiSelect) enabled.push(TestOption.SelectFromMultiple);
  if (dragDrop) enabled.push(TestOption.DragAndDrop);
  if (sentenceFillBlank) enabled.push(TestOption.SentenceFillBlank);

  // If none enabled, default to writing + multi-select
  if (enabled.length === 0) {
    enabled.push(TestOption.WriteCorrectAnswer, TestOption.SelectFromMultiple);
  }

  if (enabled.length === 1) return enabled[0];

  if (settings.everySecondTestIsMultiOrWriting) {
    // Cycle through all enabled options
    return enabled[questionIndex % enabled.length];
  }

  // Random choice among enabled options
  return enabled[randomIntFromInterval(0, enabled.length - 1)];
}

/**
 * Determine the direction of the question.
 *
 * - `onlySecondLanguageWordsTested = true`:
 *   Always show lang1 (your language), answer with lang2 (the foreign language).
 *
 * - `onlySecondLanguageWordsTested = false` (default):
 *   Randomly alternate between both directions.
 */
export function chooseGuessDirection(settings: TestSettings): GuessDirection {
  if (settings.onlySecondLanguageWordsTested) {
    return "lang1to2";
  }
  // Test both directions randomly
  return randomIntFromInterval(0, 1) === 0 ? "lang1to2" : "lang2to1";
}

/**
 * Get the word shown to the user (the question).
 */
export function getDisplayWord(
  word: TestWord,
  direction: GuessDirection,
): string {
  return direction === "lang1to2" ? word.lang1Word : word.lang2Word;
}

/**
 * Get the expected answer for the current direction.
 */
export function getExpectedAnswer(
  word: TestWord,
  direction: GuessDirection,
): string {
  return direction === "lang1to2" ? word.lang2Word : word.lang1Word;
}

/**
 * Check if the user's guess matches the expected answer.
 */
export function isAnswerCorrect(
  guess: string,
  word: TestWord,
  direction: GuessDirection,
): boolean {
  return guess === getExpectedAnswer(word, direction);
}

export type AnswerResult = "correct" | "typo" | "wrong";

/** Similarity threshold (0-1) for a guess to count as a typo match. */
const TYPO_SIMILARITY_THRESHOLD = 0.8;

/**
 * Check the user's guess with optional typo tolerance.
 * Returns "correct" for an exact match, "typo" for a close match
 * (>= 80% similar, case-insensitive), or "wrong" otherwise.
 */
export function checkAnswer(
  guess: string,
  word: TestWord,
  direction: GuessDirection,
  allowTypos: boolean,
): AnswerResult {
  const expected = getExpectedAnswer(word, direction);
  if (guess === expected) return "correct";
  if (
    allowTypos &&
    stringSimilarity(
      guess.toLowerCase().trim(),
      expected.toLowerCase().trim(),
    ) >= TYPO_SIMILARITY_THRESHOLD
  ) {
    return "typo";
  }
  return "wrong";
}

/**
 * Get the answer options for multi-select from the word list for the current direction.
 */
export function getAnswerOptionsForDirection(
  words: TestWord[],
  direction: GuessDirection,
): string[] {
  return words.map((w) =>
    direction === "lang1to2" ? w.lang2Word : w.lang1Word,
  );
}

/**
 * Count how many words still need to reach the correct-times threshold.
 */
export function countWordsLeft(
  words: TestWord[],
  correctTimesNeeded: number,
  progressOnMistakes = false,
): number {
  const doneCount = words.filter((w) => {
    const progress = progressOnMistakes
      ? w.timesCorrect + w.timesFailed
      : w.timesCorrect;
    return progress >= correctTimesNeeded;
  }).length;
  return words.length - doneCount;
}
