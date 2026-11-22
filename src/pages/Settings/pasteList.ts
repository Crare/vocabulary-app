import { RowValues } from "./wordRows";

export interface PasteResult {
  /** Parsed pairs in the order they were pasted, left side in `lang1`. */
  rows: RowValues[];
  /** 1-based line numbers that held text but no recognisable pair. */
  skippedLines: number[];
}

/**
 * Parses a pasted word list. Each non-empty line is one pair, in either form:
 *
 * - `word = translation | hint` (the hint part is optional)
 * - spreadsheet rows: `word<TAB>translation<TAB>hint`
 *
 * The left side always goes to `lang1`; callers decide which language that is.
 * Lines without a separator, or with an empty side, are reported as skipped.
 */
export const parsePastedList = (text: string): PasteResult => {
  const rows: RowValues[] = [];
  const skippedLines: number[] = [];

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) return;
    const pair = line.includes("\t")
      ? parseTabLine(rawLine)
      : parseEqualsLine(line);
    if (pair) rows.push(pair);
    else skippedLines.push(index + 1);
  });

  return { rows, skippedLines };
};

const parseTabLine = (line: string): RowValues | null => {
  const [lang1 = "", lang2 = "", hint = ""] = line
    .split("\t")
    .map((cell) => cell.trim());
  return lang1 && lang2 ? { lang1, lang2, hint } : null;
};

const parseEqualsLine = (line: string): RowValues | null => {
  const eq = line.indexOf("=");
  if (eq < 0) return null;
  const lang1 = line.slice(0, eq).trim();
  const rest = line.slice(eq + 1);
  const bar = rest.indexOf("|");
  const lang2 = (bar < 0 ? rest : rest.slice(0, bar)).trim();
  const hint = bar < 0 ? "" : rest.slice(bar + 1).trim();
  return lang1 && lang2 ? { lang1, lang2, hint } : null;
};

/** Puts each parsed pair's left side into language 2 instead of language 1. */
export const flipPasted = (rows: RowValues[]): RowValues[] =>
  rows.map((r) => ({ ...r, lang1: r.lang2, lang2: r.lang1 }));
