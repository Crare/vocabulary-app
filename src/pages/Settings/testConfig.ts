import { createLogger } from "../../util/logger";

const log = createLogger("test-config");

/** localStorage key shared with `SettingsView`, which owns the other fields. */
export const SETTINGS_KEY = "SETTINGS";

export interface TestTypes {
  writing: boolean;
  multiSelect: boolean;
  dragDrop: boolean;
  sentenceFillBlank: boolean;
}

/** The fields of `SETTINGS` that the Settings tab owns. */
export interface TestConfig {
  wordNeedsToGetCorrectTimes: number;
  multiSelectChoicesAmount: number;
  onlySecondLanguageWordsTested: boolean;
  everySecondTestIsMultiOrWriting: boolean;
  sentenceTestAllWords: boolean;
  answerDelayMs: number;
  allowTypos: boolean;
  progressOnMistakes: boolean;
  testType: TestTypes;
}

export const DEFAULT_TEST_CONFIG: TestConfig = {
  wordNeedsToGetCorrectTimes: 3,
  multiSelectChoicesAmount: 4,
  onlySecondLanguageWordsTested: false,
  everySecondTestIsMultiOrWriting: false,
  sentenceTestAllWords: true,
  answerDelayMs: 1500,
  allowTypos: true,
  progressOnMistakes: false,
  testType: {
    writing: true,
    multiSelect: true,
    dragDrop: true,
    sentenceFillBlank: true,
  },
};

export const CORRECT_TIMES_RANGE = { min: 1, max: 10 } as const;
export const CHOICES_RANGE = { min: 2, max: 10 } as const;

/** -1 waits for the Continue button; 0 moves on at once. */
export const MANUAL_DELAY = -1;

export const ANSWER_DELAY_OPTIONS: { value: number; label: string }[] = [
  { value: MANUAL_DELAY, label: "Tap" },
  { value: 0, label: "None" },
  { value: 500, label: "0.5 s" },
  { value: 1000, label: "1 s" },
  { value: 1500, label: "1.5 s" },
  { value: 2000, label: "2 s" },
  { value: 3000, label: "3 s" },
  { value: 5000, label: "5 s" },
];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Stored = Record<string, unknown>;

const bool = (stored: Stored, key: keyof TestConfig, fallback: boolean) =>
  typeof stored[key] === "boolean" ? (stored[key] as boolean) : fallback;

const int = (
  stored: Stored,
  key: keyof TestConfig,
  fallback: number,
  range: { min: number; max: number },
) => {
  const v = stored[key];
  return typeof v === "number" && Number.isFinite(v)
    ? clamp(Math.round(v), range.min, range.max)
    : fallback;
};

/**
 * Reads the test types. Old versions stored a string here, which meant a mix
 * of all types, so anything that is not an object reads as the defaults.
 */
const readTestTypes = (stored: unknown): TestTypes => {
  const d = DEFAULT_TEST_CONFIG.testType;
  if (!stored || typeof stored !== "object") return { ...d };
  const t = stored as Partial<Record<keyof TestTypes, unknown>>;
  const pick = (k: keyof TestTypes) =>
    typeof t[k] === "boolean" ? (t[k] as boolean) : d[k];
  return {
    writing: pick("writing"),
    multiSelect: pick("multiSelect"),
    dragDrop: pick("dragDrop"),
    sentenceFillBlank: pick("sentenceFillBlank"),
  };
};

/** Turns whatever is stored into a complete, valid test config. */
export const readTestConfig = (stored: unknown): TestConfig => {
  const s: Stored = stored && typeof stored === "object" ? (stored as Stored) : {};
  const d = DEFAULT_TEST_CONFIG;
  const delay = s.answerDelayMs;
  return {
    wordNeedsToGetCorrectTimes: int(
      s,
      "wordNeedsToGetCorrectTimes",
      d.wordNeedsToGetCorrectTimes,
      CORRECT_TIMES_RANGE,
    ),
    multiSelectChoicesAmount: int(
      s,
      "multiSelectChoicesAmount",
      d.multiSelectChoicesAmount,
      CHOICES_RANGE,
    ),
    onlySecondLanguageWordsTested: bool(
      s,
      "onlySecondLanguageWordsTested",
      d.onlySecondLanguageWordsTested,
    ),
    everySecondTestIsMultiOrWriting: bool(
      s,
      "everySecondTestIsMultiOrWriting",
      d.everySecondTestIsMultiOrWriting,
    ),
    sentenceTestAllWords: bool(s, "sentenceTestAllWords", d.sentenceTestAllWords),
    answerDelayMs: ANSWER_DELAY_OPTIONS.some((o) => o.value === delay)
      ? (delay as number)
      : d.answerDelayMs,
    allowTypos: bool(s, "allowTypos", d.allowTypos),
    progressOnMistakes: bool(s, "progressOnMistakes", d.progressOnMistakes),
    testType: readTestTypes(s.testType),
  };
};

export const hasAnyTestType = (t: TestTypes) =>
  t.writing || t.multiSelect || t.dragDrop || t.sentenceFillBlank;

const readStored = (): Stored => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Stored) : {};
  } catch (err) {
    log.error("settings_load_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return {};
  }
};

export const loadTestConfig = (): TestConfig => readTestConfig(readStored());

/** Saves the test config, keeping every other field in `SETTINGS`. */
export const saveTestConfig = (config: TestConfig) => {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ ...readStored(), ...config }),
    );
  } catch (err) {
    log.error("settings_save_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

/** Plain-words explanation of the answer delay choice. */
export const answerDelayHelp = (delayMs: number) => {
  if (delayMs === MANUAL_DELAY) return "The answer stays until you press Continue.";
  if (delayMs === 0) return "The next word comes right away.";
  return "How long the result stays on screen before the next word.";
};

export const directionHelp = (oneWay: boolean) =>
  oneWay
    ? "You always see your own language and answer in the one you are learning."
    : "You translate in both directions, picked at random.";
