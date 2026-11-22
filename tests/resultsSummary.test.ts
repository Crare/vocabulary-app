import { describe, it, expect } from "vitest";
import {
  accuracyChange,
  didntKnowCount,
  formatOutcome,
  hasMistake,
  scoreHeadline,
  splitByMistakes,
  testAccuracy,
  wordOutcome,
} from "../src/pages/Results/resultsSummary";
import { pickActions } from "../src/pages/Results/ResultsActions";
import { toProgressPoints } from "../src/components/ProgressChart";
import { HistoryEntry, TestWord } from "../src/pages/Testing/types";

const word = (
  id: number,
  correct: number,
  failed = 0,
  skipped = 0,
  checked = 0,
): TestWord => ({
  id,
  lang1Word: `w${id}`,
  lang2Word: `s${id}`,
  timesCorrect: correct,
  timesFailed: failed,
  timesSkipped: skipped,
  timesCheckedAnswer: checked,
  totalAnswerTimeMs: 0,
  answerAttempts: 0,
});

const entry = (date: string, words: TestWord[]): HistoryEntry => ({
  id: date,
  date,
  languageSetName: "set",
  timeTaken: "1s",
  score: 0,
  wordCount: words.length,
  wordResults: words,
});

describe("didntKnowCount", () => {
  it("adds skipped and revealed answers together", () => {
    expect(didntKnowCount(word(1, 0, 0, 2, 3))).toBe(5);
  });

  it("treats a missing skip count in new results as zero", () => {
    const w = { ...word(1, 0, 0, 0, 2), timesSkipped: undefined } as unknown as TestWord;
    expect(didntKnowCount(w)).toBe(2);
  });
});

describe("wordOutcome", () => {
  it("splits right, wrong and didn't know and rounds accuracy", () => {
    expect(wordOutcome(word(1, 3, 2, 0, 1))).toEqual({
      right: 3,
      wrong: 2,
      didntKnow: 1,
      accuracy: 50,
    });
  });

  it("returns 0% accuracy for an untested word", () => {
    expect(wordOutcome(word(1, 0)).accuracy).toBe(0);
  });
});

describe("formatOutcome", () => {
  it("leaves out zero counts after the right count", () => {
    expect(formatOutcome(wordOutcome(word(1, 3, 0, 0, 1)))).toBe(
      "3 right · 1 didn’t know",
    );
    expect(formatOutcome(wordOutcome(word(1, 3)))).toBe("3 right");
  });

  it("shows all three when present", () => {
    expect(formatOutcome(wordOutcome(word(1, 3, 2, 1, 0)))).toBe(
      "3 right · 2 wrong · 1 didn’t know",
    );
  });
});

describe("splitByMistakes", () => {
  it("puts mistakes first, worst accuracy first, and keeps the rest in order", () => {
    const words = [word(1, 3), word(2, 3, 1), word(3, 3), word(4, 3, 3)];
    const { mistakes, right } = splitByMistakes(words);
    expect(mistakes.map((w) => w.id)).toEqual([4, 2]);
    expect(right.map((w) => w.id)).toEqual([1, 3]);
    expect(hasMistake(words[0])).toBe(false);
  });
});

describe("testAccuracy and accuracyChange", () => {
  it("computes the whole-test accuracy", () => {
    expect(testAccuracy([word(1, 3, 1), word(2, 4)])).toBe(88);
    expect(testAccuracy([])).toBe(0);
  });

  it("compares the newest test with the one before it", () => {
    const newest = entry("2026-11-22", [word(1, 4, 1)]); // 80%
    const older = entry("2026-11-20", [word(1, 3, 2)]); // 60%
    expect(accuracyChange([newest, older])).toBe(20);
  });

  it("skips earlier tests of other words, such as a retest or another part", () => {
    const newest = entry("2026-11-22", [word(1, 4, 1), word(2, 1)]);
    const retest = entry("2026-11-21", [word(1, 1)]);
    const sameWords = entry("2026-11-20", [word(2, 1), word(1, 1, 1)]);
    // newest: 5 of 6 = 83%; sameWords: 2 of 3 = 67%.
    expect(accuracyChange([newest, retest, sameWords])).toBe(16);
    expect(accuracyChange([newest, retest])).toBeNull();
  });

  it("returns null for the first test of a list", () => {
    expect(accuracyChange([entry("2026-11-22", [word(1, 1)])])).toBeNull();
  });
});

describe("scoreHeadline", () => {
  it("matches the score band", () => {
    expect(scoreHeadline(100)).toBe("Perfect round");
    expect(scoreHeadline(85)).toBe("Great work");
    expect(scoreHeadline(60)).toBe("Good progress");
    expect(scoreHeadline(10)).toBe("Keep practising");
  });
});

describe("pickActions", () => {
  it("makes retest the main action when words are ticked", () => {
    expect(pickActions(2, true, true)).toEqual({
      primary: "retest",
      secondary: ["next", "retry", "lists"],
    });
  });

  it("allows retesting a single word", () => {
    expect(pickActions(1, false, false).primary).toBe("retest");
  });

  it("goes to the next part when nothing is ticked", () => {
    expect(pickActions(0, true, true)).toEqual({
      primary: "next",
      secondary: ["retry", "lists"],
    });
  });

  it("falls back to the word lists without parts", () => {
    expect(pickActions(0, false, false)).toEqual({
      primary: "lists",
      secondary: [],
    });
  });
});

describe("toProgressPoints", () => {
  it("keeps the newest tests, oldest first, with separate x values for same-day tests", () => {
    const entries = Array.from({ length: 12 }, (_, i) =>
      entry(`2026-11-22T10:${String(59 - i).padStart(2, "0")}:00Z`, [
        word(1, i, 12 - i),
      ]),
    );
    const points = toProgressPoints(entries, 10);
    expect(points).toHaveLength(10);
    expect(points.map((p) => p.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // The last point is the newest entry (entries[0]: 0 right of 12).
    expect(points[9].accuracy).toBe(0);
    expect(points[0].accuracy).toBe(Math.round((9 / 12) * 100));
  });
});
