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
  isBlankRow,
  makeRow,
  pickRows,
  removeRow,
  rowsFromLanguageSet,
  rowsFromText,
  rowsFromWordSet,
  rowsToColumns,
  rowsToText,
  sentenceColumns,
  swapRows,
  toWordSet,
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

export const DEFAULT_LIST_NAME = "unnamed language set";

/** The list as a `LanguageSet`, keeping only the rows that pass `keep`. */
export const listToLanguageSet = (
  list: EditorList,
  keep: (row: WordRow) => boolean,
): LanguageSet => {
  const picked = pickRows(list.rows, list.sentences, keep);
  return {
    name: list.name.trim() || DEFAULT_LIST_NAME,
    ...rowsToColumns(picked.rows),
    language1Name: list.lang1Name || undefined,
    language2Name: list.lang2Name || undefined,
    ...sentenceColumns(picked.sentences),
  };
};

/** The list as a downloadable word set file, without blank rows. */
export const listToWordSet = (list: EditorList): WordSet => {
  const picked = pickRows(list.rows, list.sentences, (r) => !isBlankRow(r));
  return toWordSet(
    list.name || "word-set",
    list.lang1Name,
    list.lang2Name,
    picked.rows,
    picked.sentences,
  );
};

/** Swap the two languages: names, words and sentences. */
export const swapLanguages = (list: EditorList): EditorList => ({
  ...list,
  lang1Name: list.lang2Name,
  lang2Name: list.lang1Name,
  rows: swapRows(list.rows),
  sentences: {
    language1Sentences: list.sentences.language2Sentences,
    language2Sentences: list.sentences.language1Sentences,
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

  /** Add an empty row at the end and return its id. */
  const addRow = () => {
    const row = makeRow();
    setRows((rows) => [...rows, row]);
    return row.id;
  };
  const deleteRow = (id: string) => setRows((rows) => removeRow(rows, id));
  const swap = () => setList(swapLanguages);

  return { list, setList, patch, setRows, addRow, deleteRow, swap };
};

const sameList = (a: EditorList, b: EditorList): boolean =>
  a.name === b.name &&
  a.lang1Name === b.lang1Name &&
  a.lang2Name === b.lang2Name &&
  a.sentences.language1Sentences === b.sentences.language1Sentences &&
  a.sentences.language2Sentences === b.sentences.language2Sentences &&
  a.rows.length === b.rows.length &&
  a.rows.every(
    (r, i) =>
      r.lang1 === b.rows[i].lang1 &&
      r.lang2 === b.rows[i].lang2 &&
      r.hint === b.rows[i].hint,
  );

/**
 * Index of the template the list is an unedited copy of, or -1. Matching by
 * content (not by URL) keeps the compact view after a reload and drops it as
 * soon as the user changes anything.
 */
export const findUnchangedTemplate = (
  list: EditorList,
  templates: WordSet[],
): number =>
  templates.findIndex(
    (t) => t.name === list.name && sameList(listFromWordSet(t), list),
  );
