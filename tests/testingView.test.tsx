// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TestingView } from "../src/pages/Testing/TestingView";
import { TestResults, TestSettings } from "../src/pages/Testing/types";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const none = { writing: false, multiSelect: false, dragDrop: false, sentenceFillBlank: false };

const makeSettings = (over: Partial<TestSettings> = {}): TestSettings => ({
  languageSet: {
    name: "Animals",
    language1Words: ["cat"],
    language2Words: ["kissa"],
    language2Name: "Finnish",
    hints: ["pet"],
  },
  wordNeedsToGetCorrectTimes: 1,
  multiSelectChoicesAmount: 4,
  onlySecondLanguageWordsTested: true,
  everySecondTestIsMultiOrWriting: false,
  sentenceTestAllWords: true,
  answerDelayMs: -1,
  allowTypos: true,
  progressOnMistakes: false,
  testType: { ...none, writing: true },
  ...over,
});

const renderView = (settings = makeSettings()) => {
  const onEndTesting = vi.fn<(r: TestResults) => void>();
  const onBackToStart = vi.fn();
  render(
    <TestingView settings={settings} onEndTesting={onEndTesting} onBackToStart={onBackToStart} />,
  );
  return { onEndTesting, onBackToStart };
};

const typeAnswer = (text: string) => {
  const input = screen.getByRole("textbox", { name: /Your answer|Missing word/ });
  fireEvent.change(input, { target: { value: text } });
  fireEvent.keyUp(input, { key: "Enter" });
};
const clickButton = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name }));
const endTestFromMenu = () => {
  clickButton("Test options");
  clickButton("End test and see results");
};
const firstResult = (fn: ReturnType<typeof renderView>["onEndTesting"]) =>
  fn.mock.calls[0][0].wordResults[0];

describe("TestingView — writing", () => {
  it("shows the word, its hint and the target language", () => {
    renderView();
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText(/pet/)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Your answer (Finnish)" })).toBeInTheDocument();
  });

  it("records a correct answer and ends after Continue", () => {
    const { onEndTesting } = renderView();
    typeAnswer("Kissa");
    expect(screen.getByRole("status")).toHaveTextContent("Correct");
    expect(onEndTesting).not.toHaveBeenCalled();
    clickButton("Continue");
    expect(onEndTesting).toHaveBeenCalledTimes(1);
    expect(firstResult(onEndTesting)).toMatchObject({
      lang1Word: "cat",
      hint: "pet",
      timesCorrect: 1,
      timesFailed: 0,
      answerAttempts: 1,
    });
  });

  it("accepts a close typo when typos are allowed", () => {
    renderView(
      makeSettings({ languageSet: { name: "x", language1Words: ["house"], language2Words: ["talossa"] } }),
    );
    typeAnswer("talosa");
    expect(screen.getByRole("status")).toHaveTextContent("Almost");
  });

  it("keeps a wrongly answered word in the pool", () => {
    const { onEndTesting } = renderView();
    typeAnswer("koira");
    expect(screen.getByRole("status")).toHaveTextContent("Not quite");
    clickButton("Continue");
    expect(onEndTesting).not.toHaveBeenCalled();
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("counts mistakes as progress when progressOnMistakes is on", () => {
    const { onEndTesting } = renderView(makeSettings({ progressOnMistakes: true }));
    typeAnswer("koira");
    clickButton("Continue");
    expect(firstResult(onEndTesting).timesFailed).toBe(1);
  });

  it("I don't know shows the answer and counts a miss", () => {
    const { onEndTesting } = renderView();
    clickButton("I don't know – show answer");
    expect(screen.getByRole("status")).toHaveTextContent("Answer shown");
    expect(screen.getByRole("status")).toHaveTextContent("kissa");
    clickButton("Continue");
    endTestFromMenu();
    expect(firstResult(onEndTesting)).toMatchObject({ timesCheckedAnswer: 1, timesCorrect: 0 });
  });

  it("ignores a second answer to the same question", () => {
    const { onEndTesting } = renderView(makeSettings({ wordNeedsToGetCorrectTimes: 3 }));
    typeAnswer("kissa");
    // The answer field is gone, but a stray second submit must not count.
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    endTestFromMenu();
    expect(firstResult(onEndTesting).answerAttempts).toBe(1);
  });

  it("offers Back to word list only before the first answer", () => {
    const { onBackToStart } = renderView(makeSettings({ wordNeedsToGetCorrectTimes: 2 }));
    clickButton("Back to word list");
    expect(onBackToStart).toHaveBeenCalled();
    typeAnswer("kissa");
    expect(screen.queryByRole("button", { name: "Back to word list" })).not.toBeInTheDocument();
  });

  it("ends the test only once", () => {
    const { onEndTesting } = renderView(makeSettings({ wordNeedsToGetCorrectTimes: 2 }));
    endTestFromMenu();
    expect(onEndTesting).toHaveBeenCalledTimes(1);
  });

  it("auto-advances after the delay, with extra time after a mistake", () => {
    vi.useFakeTimers();
    const { onEndTesting } = renderView(makeSettings({ answerDelayMs: 1000, progressOnMistakes: true }));
    typeAnswer("koira");
    act(() => vi.advanceTimersByTime(1000));
    expect(onEndTesting).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(500));
    expect(onEndTesting).toHaveBeenCalledTimes(1);
  });
});

describe("TestingView — multiple choice", () => {
  const multi = (allowTypos: boolean) =>
    makeSettings({
      allowTypos,
      progressOnMistakes: true,
      multiSelectChoicesAmount: 2,
      languageSet: { name: "x", language1Words: ["cat", "cats"], language2Words: ["kissa", "kissat"] },
      testType: { ...none, multiSelect: true },
    });

  it("never treats a near-miss option as a typo of the right one", () => {
    // Shown word is chosen at random; answer with the *other* option.
    const { onEndTesting } = renderView(multi(true));
    const shown = screen.getByText(/^cats?$/).textContent!;
    clickButton(shown === "cat" ? "kissat" : "kissa");
    expect(screen.getByRole("status")).toHaveTextContent("Not quite");
    clickButton("Continue");
    endTestFromMenu();
    const results = onEndTesting.mock.calls[0][0].wordResults;
    expect(results.reduce((s, w) => s + w.timesCorrect, 0)).toBe(0);
  });
});

describe("TestingView — sentence", () => {
  const sentenceSettings = makeSettings({
    languageSet: {
      name: "x",
      language1Words: ["cat"],
      language2Words: ["kissa"],
      language1Sentences: ["The cat sleeps"],
      language2Sentences: ["Kissa nukkuu."],
    },
    testType: { ...none, sentenceFillBlank: true },
  });

  it("asks for the blanked word and records the sentence result", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99); // blank the last word
    const { onEndTesting } = renderView(sentenceSettings);
    expect(screen.getByText("The cat sleeps")).toBeInTheDocument();
    typeAnswer("nukkuu");
    expect(screen.getByRole("status")).toHaveTextContent("Correct");
    clickButton("Continue");
    expect(firstResult(onEndTesting).sentenceResults).toEqual([
      { testedWord: "nukkuu", correct: true, sentence: "Kissa nukkuu." },
    ]);
  });

  it("shows the blanked word for I don't know", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderView(sentenceSettings);
    clickButton("I don't know – show answer");
    expect(screen.getByRole("status")).toHaveTextContent("Kissa");
  });
});

describe("TestingView — match the pairs", () => {
  it("records every pair of a round", () => {
    const { onEndTesting } = renderView(
      makeSettings({
        progressOnMistakes: true,
        languageSet: { name: "x", language1Words: ["cat", "dog"], language2Words: ["kissa", "koira"] },
        testType: { ...none, dragDrop: true },
      }),
    );
    clickButton("Check pairs");
    clickButton("Continue");
    expect(onEndTesting).toHaveBeenCalledTimes(1);
    const results = onEndTesting.mock.calls[0][0].wordResults;
    expect(results.map((w) => w.answerAttempts)).toEqual([1, 1]);
  });
});
