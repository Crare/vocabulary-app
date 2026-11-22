import { describe, it, expect } from "vitest";
import { flipPasted, parsePastedList } from "../src/pages/Settings/pasteList";

describe("parsePastedList", () => {
  it("parses word = translation lines", () => {
    expect(parsePastedList("nauraa = laugh\nnousta=get up")).toEqual({
      rows: [
        { lang1: "nauraa", lang2: "laugh", hint: "" },
        { lang1: "nousta", lang2: "get up", hint: "" },
      ],
      skippedLines: [],
    });
  });

  it("reads a hint after a bar", () => {
    expect(parsePastedList("soittaa = play | instrument").rows).toEqual([
      { lang1: "soittaa", lang2: "play", hint: "instrument" },
    ]);
  });

  it("parses tab-separated spreadsheet rows with an optional hint column", () => {
    expect(parsePastedList("pelata\tplay\tgame\r\nsyödä\teat").rows).toEqual([
      { lang1: "pelata", lang2: "play", hint: "game" },
      { lang1: "syödä", lang2: "eat", hint: "" },
    ]);
  });

  it("keeps an equals sign inside a tab-separated cell", () => {
    expect(parsePastedList("a = b\tc").rows).toEqual([
      { lang1: "a = b", lang2: "c", hint: "" },
    ]);
  });

  it("splits on the first equals sign only", () => {
    expect(parsePastedList("x = y = z").rows).toEqual([
      { lang1: "x", lang2: "y = z", hint: "" },
    ]);
  });

  it("ignores empty lines and reports lines it cannot read", () => {
    const result = parsePastedList(
      "\n  \nhello\na = b\n= missing\nmissing =\n",
    );
    expect(result.rows).toEqual([{ lang1: "a", lang2: "b", hint: "" }]);
    expect(result.skippedLines).toEqual([3, 5, 6]);
  });

  it("returns nothing for empty input", () => {
    expect(parsePastedList("")).toEqual({ rows: [], skippedLines: [] });
  });

  it("flips pairs so the left side goes to the second language", () => {
    expect(flipPasted([{ lang1: "a", lang2: "b", hint: "h" }])).toEqual([
      { lang1: "b", lang2: "a", hint: "h" },
    ]);
  });
});
