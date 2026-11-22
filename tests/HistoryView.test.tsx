// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HistoryView } from "../src/pages/History/HistoryView";
import { loadHistory, restoreHistoryEntry } from "../src/util/historyStorage";
import { HistoryEntry, TestWord } from "../src/pages/Testing/types";

const word = (lang1Word: string, right: number, wrong: number): TestWord => ({
  id: 0,
  lang1Word,
  lang2Word: `${lang1Word}-en`,
  timesCorrect: right,
  timesFailed: wrong,
  timesSkipped: 0,
  timesCheckedAnswer: 0,
  totalAnswerTimeMs: 1000,
  answerAttempts: 1,
});

const entry = (
  id: string,
  set: string,
  day: number,
  right: number,
): HistoryEntry => ({
  id,
  date: new Date(2026, 0, day, 10).toISOString(),
  languageSetName: set,
  timeTaken: "1m 0s",
  score: 0,
  wordCount: 1,
  wordResults: [word("olla", right, 10 - right)],
});

const seed = (entries: HistoryEntry[]) =>
  localStorage.setItem("TEST_HISTORY", JSON.stringify(entries));

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  });
});

describe("HistoryView", () => {
  it("shows the empty state with a way to the word lists", async () => {
    let went = false;
    render(<HistoryView onGoToWordLists={() => (went = true)} />);
    expect(screen.getByText("No tests yet")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: /go to word lists/i }),
    );
    expect(went).toBe(true);
  });

  it("lists word lists with their latest score, newest list first", () => {
    seed([
      entry("b", "Animals", 5, 6),
      entry("a2", "Verbs", 3, 8),
      entry("a1", "Verbs", 1, 5),
    ]);
    render(<HistoryView />);
    const items = within(
      screen.getByRole("list", { name: "Word lists" }),
    ).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Animals");
    expect(items[1]).toHaveTextContent("Verbs");
    expect(items[1]).toHaveTextContent("80%");
    expect(items[1]).toHaveTextContent("+30 pts");
  });

  it("asks before clearing all history and keeps it on cancel", async () => {
    seed([entry("a1", "Verbs", 1, 5)]);
    render(<HistoryView />);
    await userEvent.click(
      screen.getByRole("button", { name: /clear all history/i }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Keep them" }));
    expect(loadHistory()).toHaveLength(1);

    await userEvent.click(
      await screen.findByRole("button", { name: /clear all history/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Delete 1 test" }),
    );
    expect(loadHistory()).toHaveLength(0);
    expect(screen.getByText("No tests yet")).toBeInTheDocument();
  });

  it("deletes one test with an undo", async () => {
    seed([entry("a2", "Verbs", 3, 8), entry("a1", "Verbs", 1, 5)]);
    render(<HistoryView />);
    await userEvent.click(screen.getByRole("button", { name: /Verbs/ }));
    const tests = screen.getAllByRole("button", { expanded: false });
    await userEvent.click(tests[0]);
    await userEvent.click(
      screen.getByRole("button", { name: /delete this test/i }),
    );
    expect(loadHistory().map((e) => e.id)).toEqual(["a1"]);

    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(loadHistory().map((e) => e.id)).toEqual(["a2", "a1"]);
  });
});

describe("restoreHistoryEntry", () => {
  it("puts the entry back in date order once", () => {
    const a = entry("a", "X", 1, 1);
    const b = entry("b", "X", 2, 1);
    seed([a]);
    restoreHistoryEntry(b);
    restoreHistoryEntry(b);
    expect(loadHistory().map((e) => e.id)).toEqual(["b", "a"]);
  });
});
