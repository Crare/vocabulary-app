// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultsView } from "../src/pages/Results/ResultsView";
import { TestWord } from "../src/pages/Testing/types";

const word = (id: number, correct: number, failed = 0, checked = 0): TestWord => ({
  id,
  lang1Word: `word${id}`,
  lang2Word: `sana${id}`,
  timesCorrect: correct,
  timesFailed: failed,
  timesSkipped: 0,
  timesCheckedAnswer: checked,
  totalAnswerTimeMs: 1000,
  answerAttempts: 1,
});

const renderView = (words: TestWord[], extra: Partial<Parameters<typeof ResultsView>[0]> = {}) => {
  const onRetestWords = vi.fn();
  render(
    <ResultsView
      results={{ wordResults: words, timeTaken: "1min 5s", date: new Date(), score: 0 }}
      languageSetName="verbs"
      onBackToStart={vi.fn()}
      onRetestWords={onRetestWords}
      {...extra}
    />,
  );
  return { onRetestWords };
};

describe("ResultsView", () => {
  // No earlier tests of this list: a fresh in-memory store per test.
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    });
  });

  it("leads with the score and ticks the mistakes for a retest", () => {
    const { onRetestWords } = renderView([word(1, 3), word(2, 3, 1), word(3, 3, 0, 2)]);
    expect(screen.getByText("9 of 12 answers right")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retest 2 words" }));
    expect(onRetestWords.mock.calls[0][0].map((w: TestWord) => w.id)).toEqual([2, 3]);
  });

  it("can retest a single mistake", () => {
    const { onRetestWords } = renderView([word(1, 3), word(2, 3, 1)]);
    fireEvent.click(screen.getByRole("button", { name: "Retest 1 word" }));
    expect(onRetestWords).toHaveBeenCalledTimes(1);
  });

  it("offers the next part first when every word was right", () => {
    const onNextPart = vi.fn();
    renderView([word(1, 3), word(2, 3)], {
      onNextPart,
      onRetryPart: vi.fn(),
      partitionInfo: { partIndex: 0, totalParts: 2 },
    });
    expect(screen.getByText("Perfect round")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Next part · 2 of 2/ }));
    expect(onNextPart).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Retry part" })).toBeTruthy();
  });
});
