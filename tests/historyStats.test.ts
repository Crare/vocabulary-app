import { describe, it, expect } from "vitest";
import {
  entryAccuracy,
  entryAnswerCounts,
  groupBySet,
  relativeDay,
  summariseGroup,
  timesDidntKnow,
  weakestWords,
} from "../src/pages/History/historyStats";
import { HistoryEntry, TestWord } from "../src/pages/Testing/types";

const word = (
  lang1Word: string,
  right: number,
  wrong = 0,
  skipped = 0,
  checked = 0,
  hint?: string,
): TestWord => ({
  id: 0,
  lang1Word,
  lang2Word: `${lang1Word}-en`,
  hint,
  timesCorrect: right,
  timesFailed: wrong,
  timesSkipped: skipped,
  timesCheckedAnswer: checked,
  totalAnswerTimeMs: 0,
  answerAttempts: 0,
});

const entry = (
  id: string,
  set: string,
  date: string,
  words: TestWord[],
): HistoryEntry => ({
  id,
  date,
  languageSetName: set,
  timeTaken: "1m 0s",
  score: 0,
  wordCount: words.length,
  wordResults: words,
});

describe("timesDidntKnow", () => {
  it("adds skipped and shown answers together", () => {
    expect(timesDidntKnow(word("a", 0, 0, 2, 3))).toBe(5);
  });

  it("treats a missing skip count as zero", () => {
    const w = { ...word("a", 0, 0, 0, 1) } as Partial<TestWord>;
    delete w.timesSkipped;
    expect(timesDidntKnow(w as TestWord)).toBe(1);
  });
});

describe("entryAccuracy", () => {
  it("is the share of all answers that were right", () => {
    const e = entry("1", "A", "2026-01-01T00:00:00Z", [
      word("a", 3, 1),
      word("b", 1, 0, 1, 2),
    ]);
    expect(entryAnswerCounts(e)).toEqual({ right: 4, total: 8 });
    expect(entryAccuracy(e)).toBe(50);
  });

  it("is 0 when nothing was answered", () => {
    expect(entryAccuracy(entry("1", "A", "2026-01-01T00:00:00Z", []))).toBe(0);
  });
});

describe("groupBySet", () => {
  it("puts the newest test first, in groups and between groups", () => {
    const groups = groupBySet([
      entry("a1", "A", "2026-01-01T00:00:00Z", []),
      entry("b1", "B", "2026-01-05T00:00:00Z", []),
      entry("a2", "A", "2026-01-03T00:00:00Z", []),
    ]);
    expect(groups.map((g) => g.setName)).toEqual(["B", "A"]);
    expect(groups[1].entries.map((e) => e.id)).toEqual(["a2", "a1"]);
  });
});

describe("summariseGroup", () => {
  const entries = [
    entry("3", "A", "2026-01-03T00:00:00Z", [word("a", 4, 1)]), // 80
    entry("2", "A", "2026-01-02T00:00:00Z", [word("a", 9, 1)]), // 90
    entry("1", "A", "2026-01-01T00:00:00Z", [word("a", 1, 1)]), // 50
  ];

  it("reports latest, best, first and change since the previous test", () => {
    const s = summariseGroup(entries);
    expect(s.series).toEqual([50, 90, 80]);
    expect(s.latest).toBe(80);
    expect(s.best).toBe(90);
    expect(s.bestDate).toBe("2026-01-02T00:00:00Z");
    expect(s.first).toBe(50);
    expect(s.firstDate).toBe("2026-01-01T00:00:00Z");
    expect(s.change).toBe(-10);
  });

  it("has no change with a single test", () => {
    expect(summariseGroup(entries.slice(0, 1)).change).toBeNull();
  });
});

describe("weakestWords", () => {
  it("ranks missed words across tests, worst first, keeping hints", () => {
    const entries = [
      entry("2", "A", "2026-01-02T00:00:00Z", [
        word("olla", 1, 1, 0, 0, "irregular"),
        word("mennä", 1),
        word("nähdä", 0, 1),
      ]),
      entry("1", "A", "2026-01-01T00:00:00Z", [
        word("olla", 1, 0, 0, 1, "irregular"),
        word("mennä", 1),
        word("nähdä", 1, 0, 1),
      ]),
    ];
    const weak = weakestWords(entries);
    expect(weak.map((w) => [w.lang1Word, w.accuracy])).toEqual([
      ["nähdä", 33],
      ["olla", 50],
    ]);
    expect(weak[1].hint).toBe("irregular");
  });
});

describe("relativeDay", () => {
  const now = new Date(2026, 10, 22, 12);
  it("names recent days", () => {
    expect(relativeDay(new Date(2026, 10, 22, 8).toISOString(), now)).toBe(
      "today",
    );
    expect(relativeDay(new Date(2026, 10, 21, 23).toISOString(), now)).toBe(
      "yesterday",
    );
    expect(relativeDay(new Date(2026, 10, 19).toISOString(), now)).toBe(
      "3 days ago",
    );
  });
});
