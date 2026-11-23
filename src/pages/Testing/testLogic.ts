import { LanguageSet, TestOption, TestSettings, TestWord } from "./types";
import {
  randomIntFromInterval,
  shuffle,
  stringSimilarity,
} from "../../util/helpers";
import { BlankedSentence, blankOutWord } from "./sentenceLogic";

/** Maximum words in a single match-the-pairs round. */
export const DRAG_DROP_BATCH_SIZE = 4;

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
  return normalize(guess) === normalize(getExpectedAnswer(word, direction));
}

export type AnswerResult = "correct" | "typo" | "wrong";

/** Similarity threshold (0-1) for a guess to count as a typo match. */
const TYPO_SIMILARITY_THRESHOLD = 0.8;

const normalize = (s: string) => s.toLowerCase().trim();

/**
 * Compare a guess with the expected answer (case-insensitive, trimmed).
 * Returns "correct" for an exact match, "typo" for a close match
 * (>= 80% similar) when typos are allowed, or "wrong" otherwise.
 */
export function matchAnswer(
  guess: string,
  expected: string,
  allowTypos: boolean,
): AnswerResult {
  const g = normalize(guess);
  const e = normalize(expected);
  if (g === e) return "correct";
  if (allowTypos && stringSimilarity(g, e) >= TYPO_SIMILARITY_THRESHOLD) {
    return "typo";
  }
  return "wrong";
}

/** Check the user's guess for a word in the given direction. */
export function checkAnswer(
  guess: string,
  word: TestWord,
  direction: GuessDirection,
  allowTypos: boolean,
): AnswerResult {
  return matchAnswer(guess, getExpectedAnswer(word, direction), allowTypos);
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

/** Progress a word has made towards being learned. */
export function wordProgress(
  word: TestWord,
  settings: Pick<TestSettings, "progressOnMistakes">,
): number {
  return settings.progressOnMistakes
    ? word.timesCorrect + word.timesFailed
    : word.timesCorrect;
}

type ProgressSettings = Pick<
  TestSettings,
  "wordNeedsToGetCorrectTimes" | "progressOnMistakes"
>;

/**
 * Count how many words still need to reach the correct-times threshold.
 */
export function countWordsLeft(
  words: TestWord[],
  correctTimesNeeded: number,
  progressOnMistakes = false,
): number {
  return getRemainingWords(words, {
    wordNeedsToGetCorrectTimes: correctTimesNeeded,
    progressOnMistakes,
  }).length;
}

/** Words that still need practice. */
export function getRemainingWords(
  words: TestWord[],
  settings: ProgressSettings,
): TestWord[] {
  return words.filter(
    (w) => wordProgress(w, settings) < settings.wordNeedsToGetCorrectTimes,
  );
}

/** Fresh counters for every word of a language set. */
export function createTestWords(languageSet: LanguageSet): TestWord[] {
  return languageSet.language1Words.map((lang1Word, index) => ({
    id: index,
    lang1Word,
    lang2Word: languageSet.language2Words[index],
    hint: languageSet.hints?.[index]?.trim() || undefined,
    lang1Sentence: languageSet.language1Sentences?.[index],
    lang2Sentence: languageSet.language2Sentences?.[index],
    timesCorrect: 0,
    timesFailed: 0,
    timesCheckedAnswer: 0,
    totalAnswerTimeMs: 0,
    answerAttempts: 0,
  }));
}

/** How a single attempt at a word ended. */
export type AttemptOutcome = "correct" | "wrong" | "dontKnow";

/** Record one attempt on a word (mutates its counters). */
export function recordAttempt(
  word: TestWord,
  outcome: AttemptOutcome,
  elapsedMs: number,
): void {
  word.totalAnswerTimeMs += elapsedMs;
  word.answerAttempts += 1;
  if (outcome === "correct") word.timesCorrect += 1;
  else if (outcome === "wrong") word.timesFailed += 1;
  else word.timesCheckedAnswer += 1;
}

/** The sentence in the language being answered (the one with the gap). */
export function getTargetSentence(
  word: TestWord,
  direction: GuessDirection,
): string | undefined {
  return direction === "lang1to2" ? word.lang2Sentence : word.lang1Sentence;
}

/** The same sentence in full, in the other language. */
export function getReferenceSentence(
  word: TestWord,
  direction: GuessDirection,
): string | undefined {
  return direction === "lang1to2" ? word.lang1Sentence : word.lang2Sentence;
}

/** One question of the test loop. */
export type Question =
  | {
      option: TestOption.WriteCorrectAnswer | TestOption.SelectFromMultiple;
      direction: GuessDirection;
      word: TestWord;
    }
  | {
      option: TestOption.SentenceFillBlank;
      direction: GuessDirection;
      word: TestWord;
      blank: BlankedSentence;
    }
  | {
      option: TestOption.DragAndDrop;
      direction: GuessDirection;
      batch: TestWord[];
    };

/**
 * Pick the next question from the words still to practise. Match-the-pairs
 * needs two words and fill-the-gap needs a sentence; otherwise the question
 * falls back to writing (or multiple choice when writing is off).
 */
export function pickQuestion(
  settings: TestSettings,
  remaining: TestWord[],
  questionIndex: number,
): Question {
  let option = chooseTestOption(settings, questionIndex);
  const direction = chooseGuessDirection(settings);
  const fallback = settings.testType.writing
    ? TestOption.WriteCorrectAnswer
    : TestOption.SelectFromMultiple;

  if (option === TestOption.DragAndDrop && remaining.length < 2) {
    option = fallback;
  }

  const word = remaining[randomIntFromInterval(0, remaining.length - 1)];
  const sentence = getTargetSentence(word, direction);
  if (option === TestOption.SentenceFillBlank && !sentence) option = fallback;

  if (option === TestOption.DragAndDrop) {
    const shuffled = [...remaining];
    shuffle(shuffled);
    return { option, direction, batch: shuffled.slice(0, DRAG_DROP_BATCH_SIZE) };
  }
  if (option === TestOption.SentenceFillBlank) {
    const blank = blankOutWord(
      sentence!,
      settings.sentenceTestAllWords,
      word.sentenceResults?.map((r) => r.testedWord),
    );
    return { option, direction, word, blank };
  }
  return { option, direction, word };
}

/** The answer expected for a single-word question. */
export function expectedAnswerFor(
  question: Exclude<Question, { option: TestOption.DragAndDrop }>,
): string {
  return question.option === TestOption.SentenceFillBlank
    ? question.blank.missingWord
    : getExpectedAnswer(question.word, question.direction);
}

const OPTION_LABELS: Record<TestOption, string> = {
  [TestOption.WriteCorrectAnswer]: "write",
  [TestOption.SelectFromMultiple]: "multi-select",
  [TestOption.DragAndDrop]: "drag-drop",
  [TestOption.SentenceFillBlank]: "sentence",
};

/** Short name of a question type, for logs. */
export const testOptionLabel = (option: TestOption): string =>
  OPTION_LABELS[option];
