import { LanguageSet } from "../Testing/types";
import { templates } from "../../wordsets/templates";
import { ListSummary } from "./ListPickerSheet";

export const plural = (n: number, word: string) =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

/** The count line of the list card: "29 words · 3 hints · no sentences". */
export const summarise = (
  wordCount: number,
  hintCount: number,
  sentenceCount: number,
) =>
  [
    plural(wordCount, "word"),
    hintCount ? plural(hintCount, "hint") : "no hints",
    sentenceCount ? plural(sentenceCount, "sentence") : "no sentences",
  ].join(" · ");

export const templateSummaries: ListSummary[] = templates.map((t) => ({
  name: t.name,
  language1: t.language1,
  language2: t.language2,
  wordCount: t.words.length,
  hasHints: t.words.some((w) => w.hint?.trim()),
  hasSentences: !!t.sentences?.length,
}));

export const savedSummary = (s: LanguageSet): ListSummary => ({
  name: s.name,
  language1: s.language1Name,
  language2: s.language2Name,
  wordCount: s.language1Words.length,
  hasHints: !!s.hints?.some((h) => h.trim()),
  hasSentences: !!s.language1Sentences?.some((x) => x.trim()),
});
