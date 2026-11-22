// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DEFAULT_TEST_CONFIG,
  SETTINGS_KEY,
  answerDelayHelp,
  readTestConfig,
  saveTestConfig,
} from "../src/pages/Settings/testConfig";
import { TestConfigView } from "../src/pages/Settings/TestConfigView";

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => Object.keys(store).forEach((k) => delete store[k]),
};

const stored = () => JSON.parse(store[SETTINGS_KEY] ?? "{}");

beforeEach(() => {
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
});

describe("readTestConfig", () => {
  it("returns the defaults when nothing is stored", () => {
    expect(readTestConfig(undefined)).toEqual(DEFAULT_TEST_CONFIG);
    expect(readTestConfig("nonsense")).toEqual(DEFAULT_TEST_CONFIG);
  });

  it("reads an old string test type as all types on", () => {
    expect(readTestConfig({ testType: "writing" }).testType).toEqual(
      DEFAULT_TEST_CONFIG.testType,
    );
  });

  it("fills in missing test types and keeps stored ones", () => {
    expect(readTestConfig({ testType: { writing: false } }).testType).toEqual({
      writing: false,
      multiSelect: true,
      dragDrop: true,
      sentenceFillBlank: true,
    });
  });

  it("clamps numbers into range and drops unknown delays", () => {
    const c = readTestConfig({
      wordNeedsToGetCorrectTimes: 99,
      multiSelectChoicesAmount: 0,
      answerDelayMs: 1234,
    });
    expect(c.wordNeedsToGetCorrectTimes).toBe(10);
    expect(c.multiSelectChoicesAmount).toBe(2);
    expect(c.answerDelayMs).toBe(DEFAULT_TEST_CONFIG.answerDelayMs);
  });

  it("keeps the manual delay", () => {
    expect(readTestConfig({ answerDelayMs: -1 }).answerDelayMs).toBe(-1);
    expect(answerDelayHelp(-1)).toMatch(/Continue/);
  });
});

describe("saveTestConfig", () => {
  it("keeps the fields the word list page stores", () => {
    store[SETTINGS_KEY] = JSON.stringify({ splitParts: 2, setName: "verbs" });
    saveTestConfig({ ...DEFAULT_TEST_CONFIG, allowTypos: false });
    expect(stored()).toMatchObject({
      splitParts: 2,
      setName: "verbs",
      allowTypos: false,
    });
  });
});

describe("TestConfigView", () => {
  it("saves a switch change straight away", async () => {
    render(<TestConfigView />);
    await userEvent.click(screen.getByRole("switch", { name: /Forgive small typos/ }));
    expect(stored().allowTypos).toBe(false);
  });

  it("explains each setting in words", () => {
    render(<TestConfigView />);
    expect(
      screen.getByRole("switch", { name: /Wrong answers count too/ }),
    ).toHaveAccessibleDescription(/test ends sooner/);
  });

  it("changes direction and its explanation", async () => {
    render(<TestConfigView />);
    await userEvent.click(screen.getByRole("radio", { name: "Into the new language" }));
    expect(stored().onlySecondLanguageWordsTested).toBe(true);
    expect(screen.getByText(/always see your own language/)).toBeInTheDocument();
  });

  it("steps the right answers per word within its limits", async () => {
    store[SETTINGS_KEY] = JSON.stringify({ wordNeedsToGetCorrectTimes: 9 });
    render(<TestConfigView />);
    const more = screen.getByRole("button", { name: "More right answers" });
    await userEvent.click(more);
    expect(stored().wordNeedsToGetCorrectTimes).toBe(10);
    expect(more).toBeDisabled();
  });

  it("warns when every question type is off", async () => {
    render(<TestConfigView />);
    for (const name of ["Writing", "Multiple choice", "Matching", "Fill in the blank"]) {
      await userEvent.click(screen.getByRole("switch", { name: new RegExp(`^${name}`) }));
    }
    expect(screen.getByText(/at least one question type/)).toHaveAttribute("role", "status");
  });

  it("hides the sentence option when fill in the blank is off", async () => {
    render(<TestConfigView />);
    expect(screen.getByRole("switch", { name: /Ask every word/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("switch", { name: /^Fill in the blank/ }));
    expect(screen.queryByRole("switch", { name: /Ask every word/ })).toBeNull();
  });

  it("resets only after confirming, and keeps word list fields", async () => {
    store[SETTINGS_KEY] = JSON.stringify({ allowTypos: false, setName: "verbs" });
    render(<TestConfigView />);
    await userEvent.click(screen.getAllByRole("button", { name: /Reset all to defaults/ })[0]);
    const dialog = screen.getByRole("dialog", { name: "Reset test settings?" });
    expect(stored().allowTypos).toBe(false);
    await userEvent.click(within(dialog).getByRole("button", { name: "Reset" }));
    expect(stored()).toMatchObject({ allowTypos: true, setName: "verbs" });
  });
});
