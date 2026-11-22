import { LanguageSet, PartitionContext, TestSettings } from "../Testing/types";
import { PersistedSettings } from "../../util/wordListStorage";

type TestType = TestSettings["testType"];

const ALL_TEST_TYPES: TestType = {
  writing: true,
  multiSelect: true,
  dragDrop: true,
  sentenceFillBlank: true,
};

/** Reads the test types; old versions stored a string, which means "all". */
export const readTestType = (stored: unknown): TestType => {
  if (!stored || typeof stored !== "object") return ALL_TEST_TYPES;
  const t = stored as Partial<TestType>;
  return {
    writing: t.writing ?? true,
    multiSelect: t.multiSelect ?? true,
    dragDrop: t.dragDrop ?? true,
    sentenceFillBlank: t.sentenceFillBlank ?? true,
  };
};

export const hasAnyTestType = (stored: unknown): boolean => {
  const t = readTestType(stored);
  return t.writing || t.multiSelect || t.dragDrop || t.sentenceFillBlank;
};

const sliceSet = (set: LanguageSet, end: number): LanguageSet => ({
  ...set,
  language1Words: set.language1Words.slice(0, end),
  language2Words: set.language2Words.slice(0, end),
  language1Sentences: set.language1Sentences?.slice(0, end),
  language2Sentences: set.language2Sentences?.slice(0, end),
  hints: set.hints?.slice(0, end),
});

/**
 * Builds the settings for a new test from the full list and the stored test
 * options. With a split, the test covers the first part and the partition
 * context lets the results page continue with the next one.
 */
export const buildTestStart = (
  fullLanguageSet: LanguageSet,
  parts: 1 | 2 | 4,
  persisted: PersistedSettings,
): { settings: TestSettings; partition?: PartitionContext } => {
  const total = fullLanguageSet.language1Words.length;
  const partSize = Math.ceil(total / parts);
  const num = (key: string, fallback: number) =>
    typeof persisted[key] === "number" ? (persisted[key] as number) : fallback;
  const bool = (key: string, fallback: boolean) =>
    typeof persisted[key] === "boolean"
      ? (persisted[key] as boolean)
      : fallback;

  const settings: TestSettings = {
    languageSet:
      parts === 1
        ? fullLanguageSet
        : sliceSet(fullLanguageSet, Math.min(partSize, total)),
    wordNeedsToGetCorrectTimes: num("wordNeedsToGetCorrectTimes", 3),
    multiSelectChoicesAmount: num("multiSelectChoicesAmount", 4),
    onlySecondLanguageWordsTested: bool("onlySecondLanguageWordsTested", false),
    everySecondTestIsMultiOrWriting: bool(
      "everySecondTestIsMultiOrWriting",
      false,
    ),
    sentenceTestAllWords: bool("sentenceTestAllWords", true),
    answerDelayMs: num("answerDelayMs", 1500),
    allowTypos: bool("allowTypos", true),
    progressOnMistakes: bool("progressOnMistakes", false),
    testType: readTestType(persisted.testType),
  };
  const partition =
    parts > 1
      ? { fullLanguageSet, totalParts: parts, partIndex: 0, partSize }
      : undefined;
  return { settings, partition };
};
