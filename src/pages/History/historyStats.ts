import { HistoryEntry, TestWord } from "../Testing/types";

/**
 * "Didn't know" answers for one word: the merged Skip / Show answer action.
 * Older entries stored the two separately, so both are added together.
 */
export const timesDidntKnow = (word: TestWord): number =>
  (word.timesCheckedAnswer ?? 0) + (word.timesSkipped ?? 0);

/** Every answer given for a word, right or not. */
const timesAnswered = (word: TestWord): number =>
  word.timesCorrect + word.timesFailed + timesDidntKnow(word);

/** Share of answers that were right in one test, 0–100 (0 when unanswered). */
export const entryAccuracy = (entry: HistoryEntry): number => {
  let right = 0;
  let total = 0;
  for (const w of entry.wordResults) {
    right += w.timesCorrect;
    total += timesAnswered(w);
  }
  return total > 0 ? Math.round((right / total) * 100) : 0;
};

/** Right answers and all answers in one test. */
export const entryAnswerCounts = (
  entry: HistoryEntry,
): { right: number; total: number } =>
  entry.wordResults.reduce(
    (acc, w) => ({
      right: acc.right + w.timesCorrect,
      total: acc.total + timesAnswered(w),
    }),
    { right: 0, total: 0 },
  );

export interface HistoryGroup {
  setName: string;
  /** Newest first. */
  entries: HistoryEntry[];
}

const byNewest = (a: HistoryEntry, b: HistoryEntry) =>
  b.date.localeCompare(a.date);

/**
 * Group entries by word list. Entries inside a group are newest first, and
 * the group with the most recent test comes first.
 */
export const groupBySet = (entries: HistoryEntry[]): HistoryGroup[] => {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.languageSetName);
    if (list) list.push(entry);
    else map.set(entry.languageSetName, [entry]);
  }
  return Array.from(map, ([setName, list]) => ({
    setName,
    entries: [...list].sort(byNewest),
  })).sort((a, b) => byNewest(a.entries[0], b.entries[0]));
};

export interface GroupSummary {
  latest: number;
  best: number;
  bestDate: string;
  first: number;
  firstDate: string;
  /** Points gained since the previous test; null with a single test. */
  change: number | null;
  /** Accuracy per test, oldest first (for charts). */
  series: number[];
}

/** Headline numbers for one group; `entries` must be newest first. */
export const summariseGroup = (entries: HistoryEntry[]): GroupSummary => {
  const series = entries.map(entryAccuracy).reverse();
  const last = series.length - 1;
  let bestIndex = 0;
  series.forEach((v, i) => {
    if (v >= series[bestIndex]) bestIndex = i;
  });
  return {
    latest: series[last],
    best: series[bestIndex],
    bestDate: entries[last - bestIndex].date,
    first: series[0],
    firstDate: entries[last].date,
    change: series.length > 1 ? series[last] - series[last - 1] : null,
    series,
  };
};

export interface WordAccuracy {
  lang1Word: string;
  lang2Word: string;
  hint?: string;
  accuracy: number;
  answers: number;
}

/**
 * Words with the lowest accuracy over all the given tests, worst first.
 * Words are matched by their two-language pair; only words with a miss count.
 */
export const weakestWords = (
  entries: HistoryEntry[],
  limit = 3,
): WordAccuracy[] => {
  const map = new Map<
    string,
    { word: TestWord; right: number; answers: number }
  >();
  for (const entry of entries) {
    for (const w of entry.wordResults) {
      const key = `${w.lang1Word}\u0000${w.lang2Word}`;
      const acc = map.get(key) ?? { word: w, right: 0, answers: 0 };
      acc.right += w.timesCorrect;
      acc.answers += timesAnswered(w);
      map.set(key, acc);
    }
  }
  return Array.from(map.values())
    .filter((a) => a.answers > 0 && a.right < a.answers)
    .map((a) => ({
      lang1Word: a.word.lang1Word,
      lang2Word: a.word.lang2Word,
      hint: a.word.hint || undefined,
      accuracy: Math.round((a.right / a.answers) * 100),
      answers: a.answers,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.answers - a.answers)
    .slice(0, limit);
};

const DAY_MS = 86_400_000;

/** "today", "yesterday", "3 days ago", else a short date like "Nov 2". */
export const relativeDay = (iso: string, now = new Date()): string => {
  const d = new Date(iso);
  const startOf = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(d)) / DAY_MS);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};
