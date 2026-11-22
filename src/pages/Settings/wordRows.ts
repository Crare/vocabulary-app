import { LanguageSet } from "../Testing/types";
import { WordInSet, WordSet } from "../../wordsets/types";

/**
 * One editable word pair. The hint lives on the same object as its words, so
 * adding or removing a row can never shift a hint onto another word.
 */
export interface WordRow {
  /** Stable key for React and focus handling; never persisted. */
  id: string;
  lang1: string;
  lang2: string;
  hint: string;
}

export type RowValues = Omit<WordRow, "id">;

let nextId = 0;
export const newRowId = (): string => `row-${++nextId}`;

/** Cells may come from imported or stored JSON, so anything is made text. */
const cellText = (value: unknown): string =>
  value === undefined || value === null ? "" : String(value);

export const makeRow = (values: Partial<RowValues> = {}): WordRow => ({
  id: newRowId(),
  lang1: cellText(values.lang1),
  lang2: cellText(values.lang2),
  hint: cellText(values.hint),
});

const splitLines = (text: string | undefined): string[] =>
  text ? text.split("\n") : [];

/**
 * Builds rows from line-aligned arrays (the stored `LanguageSet` and the
 * `SETTINGS` text format). Uneven lists are padded with empty cells instead of
 * dropping words; hints beyond the last word are dropped.
 */
export const rowsFromColumns = (
  lang1: string[],
  lang2: string[],
  hints: string[] = [],
): WordRow[] => {
  const count = Math.max(lang1.length, lang2.length);
  return Array.from({ length: count }, (_, i) =>
    makeRow({ lang1: lang1[i], lang2: lang2[i], hint: hints[i] }),
  );
};

/** Rows from the newline-joined strings kept in the `SETTINGS` key. */
export const rowsFromText = (
  lang1Text: string | undefined,
  lang2Text: string | undefined,
  hintsText?: string,
): WordRow[] =>
  rowsFromColumns(
    splitLines(lang1Text),
    splitLines(lang2Text),
    splitLines(hintsText),
  );

export const rowsFromWordSet = (words: WordInSet[]): WordRow[] =>
  words.map((w) => makeRow(w));

export const rowsFromLanguageSet = (set: LanguageSet): WordRow[] =>
  rowsFromColumns(set.language1Words, set.language2Words, set.hints);

export const hasHints = (rows: RowValues[]): boolean =>
  rows.some((r) => r.hint.trim() !== "");

/** Newline-joined strings for the `SETTINGS` key (the pre-table format). */
export const rowsToText = (rows: RowValues[]) => ({
  language1Words: rows.map((r) => r.lang1).join("\n"),
  language2Words: rows.map((r) => r.lang2).join("\n"),
  hints: hasHints(rows) ? rows.map((r) => r.hint).join("\n") : "",
});

/** Line-aligned arrays for a `LanguageSet`; `hints` is left out when unused. */
export const rowsToColumns = (rows: RowValues[]) => ({
  language1Words: rows.map((r) => r.lang1),
  language2Words: rows.map((r) => r.lang2),
  hints: hasHints(rows) ? rows.map((r) => r.hint) : undefined,
});

export const rowsToWordSetWords = (rows: RowValues[]): WordInSet[] =>
  rows.map((r) => {
    const hint = r.hint.trim();
    return { lang1: r.lang1, lang2: r.lang2, ...(hint ? { hint } : {}) };
  });

export const isBlankRow = (r: RowValues): boolean =>
  !r.lang1.trim() && !r.lang2.trim() && !r.hint.trim();

export const isCompleteRow = (r: RowValues): boolean =>
  r.lang1.trim() !== "" && r.lang2.trim() !== "";

export interface RowCheck {
  /** Rows with both words, in order: the words a test will use. */
  complete: WordRow[];
  /** 1-based numbers of rows that have only one of the two words. */
  incomplete: number[];
}

/** Splits rows into testable ones and ones that still need a word. */
export const checkRows = (rows: WordRow[]): RowCheck => {
  const complete: WordRow[] = [];
  const incomplete: number[] = [];
  rows.forEach((r, i) => {
    if (isCompleteRow(r)) complete.push(r);
    else if (!isBlankRow(r)) incomplete.push(i + 1);
  });
  return { complete, incomplete };
};

/** Swaps the two languages of every row; hints stay with their row. */
export const swapRows = (rows: WordRow[]): WordRow[] =>
  rows.map((r) => ({ ...r, lang1: r.lang2, lang2: r.lang1 }));

export const updateRow = (
  rows: WordRow[],
  id: string,
  patch: Partial<RowValues>,
): WordRow[] => rows.map((r) => (r.id === id ? { ...r, ...patch } : r));

export const removeRow = (rows: WordRow[], id: string): WordRow[] =>
  rows.filter((r) => r.id !== id);

/** How many words each split choice tests (the first part of the list). */
export const partSizeFor = (total: number, parts: number): number =>
  Math.min(Math.ceil(total / parts), total);

export interface SentenceText {
  language1Sentences: string;
  language2Sentences: string;
}

/** Builds the JSON word set used by download and import. */
export const toWordSet = (
  name: string,
  language1: string,
  language2: string,
  rows: RowValues[],
  sentences: SentenceText,
): WordSet => {
  const s1 = splitLines(sentences.language1Sentences);
  const s2 = splitLines(sentences.language2Sentences);
  const hasSentences = s1.some((s) => s) || s2.some((s) => s);
  return {
    name,
    language1: language1 || undefined,
    language2: language2 || undefined,
    words: rowsToWordSetWords(rows),
    ...(hasSentences
      ? {
          sentences: Array.from(
            { length: Math.max(s1.length, s2.length) },
            (_, i) => ({ lang1: s1[i] ?? "", lang2: s2[i] ?? "" }),
          ),
        }
      : {}),
  };
};

/** Counts sentence pairs that have text on at least one side. */
export const countSentences = (sentences: SentenceText): number => {
  const s1 = splitLines(sentences.language1Sentences);
  const s2 = splitLines(sentences.language2Sentences);
  let count = 0;
  for (let i = 0; i < Math.max(s1.length, s2.length); i++) {
    if ((s1[i] ?? "").trim() || (s2[i] ?? "").trim()) count++;
  }
  return count;
};

/**
 * Keeps the rows that pass `keep` together with the sentence lines at the same
 * positions, so sentences stay matched to their words.
 */
export const pickRows = (
  rows: WordRow[],
  sentences: SentenceText,
  keep: (row: WordRow) => boolean,
): { rows: WordRow[]; sentences: SentenceText } => {
  const s1 = splitLines(sentences.language1Sentences);
  const s2 = splitLines(sentences.language2Sentences);
  const picked: WordRow[] = [];
  const p1: string[] = [];
  const p2: string[] = [];
  rows.forEach((r, i) => {
    if (!keep(r)) return;
    picked.push(r);
    p1.push(s1[i] ?? "");
    p2.push(s2[i] ?? "");
  });
  const hasSentences = p1.some((s) => s.trim()) || p2.some((s) => s.trim());
  return {
    rows: picked,
    sentences: {
      language1Sentences: hasSentences ? p1.join("\n") : "",
      language2Sentences: hasSentences ? p2.join("\n") : "",
    },
  };
};

/** Sentence arrays for a `LanguageSet`, left out when there are none. */
export const sentenceColumns = (sentences: SentenceText) => ({
  language1Sentences: sentences.language1Sentences
    ? sentences.language1Sentences.split("\n")
    : undefined,
  language2Sentences: sentences.language2Sentences
    ? sentences.language2Sentences.split("\n")
    : undefined,
});
