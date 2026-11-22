// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { SettingsView } from "../src/pages/Settings/SettingsView";

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

const stored = () => JSON.parse(store.SETTINGS);

beforeEach(() => {
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
  store.SETTINGS = JSON.stringify({
    language1Words: "eat\nplay\nplay",
    language2Words: "syödä\npelata\nsoittaa",
    hints: "\ngame\ninstrument",
    lang1Name: "🇬🇧 English",
    lang2Name: "🇫🇮 Finnish",
    langSetName: "verbs",
    answerDelayMs: 900,
  });
});

describe("word list editor", () => {
  it("loads the stored list into rows with hints on their words", () => {
    render(<SettingsView onStartTest={() => {}} />);
    expect(screen.getByLabelText("English word 2")).toHaveValue("play");
    expect(screen.getByLabelText("Hint for word 2")).toHaveValue("game");
    expect(screen.getByText(/3 words · 2 hints/)).toBeInTheDocument();
  });

  it("keeps hints with their words after deleting a row", () => {
    render(<SettingsView onStartTest={() => {}} />);
    fireEvent.click(screen.getByLabelText("Delete word 1"));
    expect(stored()).toMatchObject({
      language1Words: "play\nplay",
      language2Words: "pelata\nsoittaa",
      hints: "game\ninstrument",
      answerDelayMs: 900,
    });
  });

  it("starts a test with the stored options and the hints", () => {
    const onStartTest = vi.fn();
    render(<SettingsView onStartTest={onStartTest} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Start test · 3 words/ }),
    );
    const [settings] = onStartTest.mock.calls[0];
    expect(settings.answerDelayMs).toBe(900);
    expect(settings.languageSet).toMatchObject({
      name: "verbs",
      language1Words: ["eat", "play", "play"],
      hints: ["", "game", "instrument"],
    });
  });

  it("blocks the test while a row is missing a word", () => {
    render(<SettingsView onStartTest={() => {}} />);
    fireEvent.change(screen.getByLabelText("Finnish word 3"), {
      target: { value: "" },
    });
    expect(
      screen.getByText("Word 3 needs both languages."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start test/ })).toBeDisabled();
  });

  it("adds pasted rows to the end of the list", () => {
    render(<SettingsView onStartTest={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Paste list" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Your list"), {
      target: { value: "call = soittaa | phone\nnot a pair" },
    });
    expect(
      within(dialog).getByText(/Preview · 1 row, 1 with hints/),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/Skipped line 2/)).toBeInTheDocument();
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Add to the end" }),
    );
    expect(stored()).toMatchObject({
      language1Words: "eat\nplay\nplay\ncall",
      hints: "\ngame\ninstrument\nphone",
    });
  });

  it("updates a named saved list but adds unnamed ones separately", () => {
    render(<SettingsView onStartTest={() => {}} />);
    const save = screen.getByRole("button", { name: "Save to My lists" });
    fireEvent.click(save);
    fireEvent.click(save);
    expect(JSON.parse(store.LANGUAGE_SETS)).toHaveLength(1);

    fireEvent.change(screen.getByLabelText("List name"), {
      target: { value: "" },
    });
    fireEvent.click(save);
    fireEvent.click(save);
    const sets = JSON.parse(store.LANGUAGE_SETS);
    expect(sets.map((s: { name: string }) => s.name)).toEqual([
      "verbs",
      "unnamed language set",
      "unnamed language set",
    ]);
    expect(sets[0].hints).toEqual(["", "game", "instrument"]);
  });
});
