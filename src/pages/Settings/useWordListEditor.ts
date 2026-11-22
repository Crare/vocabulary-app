import { useEffect, useState } from "react";
import { LanguageSet } from "../Testing/types";
import { WordSet } from "../../wordsets/types";
import {
  loadPersistedSettings,
  saveWordListFields,
} from "../../util/wordListStorage";
import {
  SentenceText,
  WordRow,
  rowsFromLanguageSet,
  rowsFromText,
  rowsFromWordSet,
  rowsToText,
} from "./wordRows";

/** Everything that makes up the list being edited. */
export interface EditorList {
  name: string;
  lang1Name: string;
  lang2Name: string;
  rows: WordRow[];
  sentences: SentenceText;
}

export const NO_SENTENCES: SentenceText = {
  language1Sentences: "",
  language2Sentences: "",
};

export const listFromWordSet = (set: WordSet): EditorList => ({
  name: set.name,
  lang1Name: set.language1 ?? "",
  lang2Name: set.language2 ?? "",
  rows: rowsFromWordSet(set.words),
  sentences: {
    language1Sentences: set.sentences?.map((s) => s.lang1).join("\n") ?? "",
    language2Sentences: set.sentences?.map((s) => s.lang2).join("\n") ?? "",
  },
});

export const listFromLanguageSet = (set: LanguageSet): EditorList => ({
  name: set.name,
  lang1Name: set.language1Name ?? "",
  lang2Name: set.language2Name ?? "",
  rows: rowsFromLanguageSet(set),
  sentences: {
    language1Sentences: set.language1Sentences?.join("\n") ?? "",
    language2Sentences: set.language2Sentences?.join("\n") ?? "",
  },
});

/** The list stored in `SETTINGS` by this or an older version of the page. */
const listFromStorage = (): EditorList => {
  const s = loadPersistedSettings();
  return {
    name: s.langSetName ?? "",
    lang1Name: s.lang1Name ?? "",
    lang2Name: s.lang2Name ?? "",
    rows: rowsFromText(s.language1Words, s.language2Words, s.hints),
    sentences: {
      language1Sentences: s.language1Sentences ?? "",
      language2Sentences: s.language2Sentences ?? "",
    },
  };
};

/**
 * Holds the list being edited and keeps it in `SETTINGS` in the original
 * newline-joined format, so older app versions can still read it.
 */
export const useWordListEditor = (initialTemplate: WordSet | null) => {
  const [list, setList] = useState<EditorList>(() =>
    initialTemplate ? listFromWordSet(initialTemplate) : listFromStorage(),
  );

  useEffect(() => {
    saveWordListFields({
      ...rowsToText(list.rows),
      lang1Name: list.lang1Name,
      lang2Name: list.lang2Name,
      langSetName: list.name,
      ...list.sentences,
    });
  }, [list]);

  const patch = (changes: Partial<EditorList>) =>
    setList((prev) => ({ ...prev, ...changes }));
  const setRows = (update: (rows: WordRow[]) => WordRow[]) =>
    setList((prev) => ({ ...prev, rows: update(prev.rows) }));

  return { list, setList, patch, setRows };
};
