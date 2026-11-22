import { describe, it, expect } from "vitest";
import {
  checkRows,
  isCompleteRow,
  pickRows,
  sentenceColumns,
  countSentences,
  makeRow,
  partSizeFor,
  removeRow,
  rowsFromColumns,
  rowsFromLanguageSet,
  rowsFromText,
  rowsFromWordSet,
  rowsToColumns,
  rowsToText,
  swapRows,
  toWordSet,
  updateRow,
} from "../src/pages/Settings/wordRows";

const values = (rows: { lang1: string; lang2: string; hint: string }[]) =>
  rows.map(({ lang1, lang2, hint }) => ({ lang1, lang2, hint }));

describe("word rows", () => {
  it("reads the stored SETTINGS text into rows with hints on their words", () => {
    const rows = rowsFromText(
      "play\ncall\neat",
      "soittaa\nsoittaa\nsyödä",
      "instrument\nphone\n",
    );
    expect(values(rows)).toEqual([
      { lang1: "play", lang2: "soittaa", hint: "instrument" },
      { lang1: "call", lang2: "soittaa", hint: "phone" },
      { lang1: "eat", lang2: "syödä", hint: "" },
    ]);
  });

  it("returns no rows for empty stored text", () => {
    expect(rowsFromText("", "", "")).toEqual([]);
    expect(rowsFromText(undefined, undefined)).toEqual([]);
  });

  it("pads uneven columns instead of dropping words", () => {
    const rows = rowsFromColumns(
      ["a", "b", "c"],
      ["x"],
      ["h1", "h2", "h3", "extra"],
    );
    expect(values(rows)).toEqual([
      { lang1: "a", lang2: "x", hint: "h1" },
      { lang1: "b", lang2: "", hint: "h2" },
      { lang1: "c", lang2: "", hint: "h3" },
    ]);
  });

  it("keeps each hint with its word when a row above it is removed", () => {
    const rows = rowsFromWordSet([
      { lang1: "eat", lang2: "syödä" },
      { lang1: "play", lang2: "pelata", hint: "game" },
      { lang1: "play", lang2: "soittaa", hint: "instrument" },
    ]);
    const after = removeRow(rows, rows[0].id);
    expect(rowsToColumns(after)).toEqual({
      language1Words: ["play", "play"],
      language2Words: ["pelata", "soittaa"],
      hints: ["game", "instrument"],
    });
  });

  it("writes text in the stored format and leaves hints empty when unused", () => {
    const rows = [
      makeRow({ lang1: "a", lang2: "b" }),
      makeRow({ lang1: "c", lang2: "d" }),
    ];
    expect(rowsToText(rows)).toEqual({
      language1Words: "a\nc",
      language2Words: "b\nd",
      hints: "",
    });
    expect(rowsToColumns(rows).hints).toBeUndefined();
  });

  it("round-trips a saved language set", () => {
    const set = {
      name: "s",
      language1Words: ["play", "eat"],
      language2Words: ["pelata", "syödä"],
      hints: ["game", ""],
    };
    const rows = rowsFromLanguageSet(set);
    expect(rowsToColumns(rows)).toEqual({
      language1Words: set.language1Words,
      language2Words: set.language2Words,
      hints: set.hints,
    });
  });

  it("gives every row its own id", () => {
    const rows = rowsFromColumns(["a", "b"], ["c", "d"]);
    expect(rows[0].id).not.toBe(rows[1].id);
  });

  it("updates one row by id", () => {
    const rows = rowsFromColumns(["a", "b"], ["c", "d"]);
    const after = updateRow(rows, rows[1].id, { hint: "note" });
    expect(after[0].hint).toBe("");
    expect(after[1]).toMatchObject({ lang1: "b", lang2: "d", hint: "note" });
  });

  it("swaps languages and keeps hints in place", () => {
    const rows = rowsFromColumns(["play"], ["pelata"], ["game"]);
    expect(values(swapRows(rows))).toEqual([
      { lang1: "pelata", lang2: "play", hint: "game" },
    ]);
  });

  it("separates complete, blank and half-filled rows", () => {
    const rows = [
      makeRow({ lang1: "a", lang2: "b" }),
      makeRow(),
      makeRow({ lang1: "c" }),
      makeRow({ lang1: "  ", lang2: "d" }),
      makeRow({ lang1: "e", lang2: "f" }),
    ];
    const { complete, incomplete } = checkRows(rows);
    expect(complete.map((r) => r.lang1)).toEqual(["a", "e"]);
    expect(incomplete).toEqual([3, 4]);
  });

  it("sizes the split parts like the test partition", () => {
    expect(partSizeFor(29, 1)).toBe(29);
    expect(partSizeFor(29, 2)).toBe(15);
    expect(partSizeFor(29, 4)).toBe(8);
    expect(partSizeFor(0, 4)).toBe(0);
  });

  it("builds the download JSON with hints only where set", () => {
    const rows = rowsFromColumns(
      ["play", "eat"],
      ["pelata", "syödä"],
      ["game", ""],
    );
    const set = toWordSet("verbs", "🇬🇧 English", "", rows, {
      language1Sentences: "",
      language2Sentences: "",
    });
    expect(set).toEqual({
      name: "verbs",
      language1: "🇬🇧 English",
      language2: undefined,
      words: [
        { lang1: "play", lang2: "pelata", hint: "game" },
        { lang1: "eat", lang2: "syödä" },
      ],
    });
  });

  it("includes sentences in the download JSON and counts them", () => {
    const sentences = {
      language1Sentences: "I eat\n",
      language2Sentences: "Minä syön\n",
    };
    const set = toWordSet("s", "", "", [], sentences);
    expect(set.sentences).toEqual([
      { lang1: "I eat", lang2: "Minä syön" },
      { lang1: "", lang2: "" },
    ]);
    expect(countSentences(sentences)).toBe(1);
    expect(
      countSentences({ language1Sentences: "", language2Sentences: "" }),
    ).toBe(0);
  });
});

describe("pickRows", () => {
  it("drops blank rows and keeps sentences on their words", () => {
    const rows = [
      makeRow({ lang1: "eat", lang2: "syödä" }),
      makeRow(),
      makeRow({ lang1: "go", lang2: "mennä" }),
    ];
    const picked = pickRows(
      rows,
      {
        language1Sentences: "I eat\n\nI go",
        language2Sentences: "Syön\n\nMenen",
      },
      isCompleteRow,
    );
    expect(picked.rows.map((r) => r.lang1)).toEqual(["eat", "go"]);
    expect(picked.sentences).toEqual({
      language1Sentences: "I eat\nI go",
      language2Sentences: "Syön\nMenen",
    });
    expect(sentenceColumns(picked.sentences)).toEqual({
      language1Sentences: ["I eat", "I go"],
      language2Sentences: ["Syön", "Menen"],
    });
  });

  it("returns empty sentence text when the kept rows have none", () => {
    const picked = pickRows(
      [makeRow({ lang1: "a", lang2: "b" })],
      { language1Sentences: "", language2Sentences: "" },
      isCompleteRow,
    );
    expect(picked.sentences).toEqual({
      language1Sentences: "",
      language2Sentences: "",
    });
    expect(sentenceColumns(picked.sentences)).toEqual({
      language1Sentences: undefined,
      language2Sentences: undefined,
    });
  });
});

describe("makeRow", () => {
  it("turns non-text cells from imported JSON into text", () => {
    const row = makeRow({
      lang1: 5 as unknown as string,
      lang2: null as unknown as string,
    });
    expect(row).toMatchObject({ lang1: "5", lang2: "", hint: "" });
  });
});
