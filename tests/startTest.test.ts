import { describe, it, expect } from "vitest";
import {
  buildTestStart,
  hasAnyTestType,
  readTestType,
} from "../src/pages/Settings/startTest";
import { findTemplate, templates } from "../src/wordsets/templates";

const set = {
  name: "s",
  language1Words: ["a", "b", "c", "d", "e"],
  language2Words: ["1", "2", "3", "4", "5"],
  hints: ["", "h", "", "", ""],
};

describe("buildTestStart", () => {
  it("uses the whole list and stored options without a split", () => {
    const { settings, partition } = buildTestStart(set, 1, {
      answerDelayMs: 900,
      allowTypos: false,
    });
    expect(settings.languageSet).toBe(set);
    expect(settings.answerDelayMs).toBe(900);
    expect(settings.allowTypos).toBe(false);
    expect(settings.wordNeedsToGetCorrectTimes).toBe(3);
    expect(partition).toBeUndefined();
  });

  it("tests the first part and keeps hints aligned with a split", () => {
    const { settings, partition } = buildTestStart(set, 2, {});
    expect(settings.languageSet.language1Words).toEqual(["a", "b", "c"]);
    expect(settings.languageSet.hints).toEqual(["", "h", ""]);
    expect(partition).toEqual({
      fullLanguageSet: set,
      totalParts: 2,
      partIndex: 0,
      partSize: 3,
    });
  });
});

describe("test types", () => {
  it("treats the old string format as all types on", () => {
    expect(readTestType("both")).toEqual({
      writing: true,
      multiSelect: true,
      dragDrop: true,
      sentenceFillBlank: true,
    });
  });

  it("knows when every type is turned off", () => {
    const off = {
      writing: false,
      multiSelect: false,
      dragDrop: false,
      sentenceFillBlank: false,
    };
    expect(hasAnyTestType(off)).toBe(false);
    expect(hasAnyTestType({ ...off, dragDrop: true })).toBe(true);
  });
});

describe("findTemplate", () => {
  it("resolves 1-based indexes and names, case-insensitively", () => {
    expect(findTemplate("1")).toBe(0);
    expect(findTemplate(templates[12].name.toUpperCase())).toBe(12);
    expect(findTemplate("0")).toBe(-1);
    expect(findTemplate("nope")).toBe(-1);
    expect(findTemplate(null)).toBe(-1);
  });
});
