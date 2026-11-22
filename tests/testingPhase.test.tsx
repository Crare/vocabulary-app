// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import {
  DONT_KNOW_LABEL,
  buildFeedback,
  buildPairsFeedback,
} from "../src/pages/Testing/feedback";
import { WriteTestCard } from "../src/pages/Testing/WriteTestCard";
import { SelectAnswerCard } from "../src/pages/Testing/SelectAnswerCard";
import {
  DragDropResult,
  DragDropTestCard,
} from "../src/pages/Testing/DragDropTestCard";
import { TestTopBar } from "../src/pages/Testing/TestTopBar";
import {
  TestOption,
  TestSettings,
  TestState,
  TestWord,
} from "../src/pages/Testing/types";

const makeWord = (
  id: number,
  lang1Word: string,
  lang2Word: string,
  hint?: string,
): TestWord => ({
  id,
  lang1Word,
  lang2Word,
  hint,
  timesCorrect: 0,
  timesFailed: 0,
  timesCheckedAnswer: 0,
  totalAnswerTimeMs: 0,
  answerAttempts: 0,
});

const noop = () => {};

describe("buildFeedback", () => {
  it("returns nothing while answering", () => {
    expect(buildFeedback(undefined, "lukea", "")).toBeUndefined();
  });

  it("shows what the learner wrote next to the right spelling", () => {
    const fb = buildFeedback(TestState.TypoMatch, "syödä", "syöda");
    expect(fb).toMatchObject({ tone: "typo", answer: "syödä" });
    expect(fb?.text).toContain("syöda");
  });

  it("explains a wrong typed answer and a wrong pick differently", () => {
    expect(buildFeedback(TestState.Failed, "lukea", "talo")?.text).toContain(
      "talo",
    );
    expect(buildFeedback(TestState.Failed, "lukea")?.text).toBe(
      "The answer is",
    );
  });

  it("marks I don't know as a miss with the answer shown", () => {
    expect(buildFeedback(TestState.CheckedAnswer, "juosta")).toMatchObject({
      tone: "revealed",
      answer: "juosta",
    });
  });
});

describe("buildPairsFeedback", () => {
  it("is correct only when every pair is right", () => {
    expect(buildPairsFeedback(4, 4).tone).toBe("correct");
    expect(buildPairsFeedback(2, 4)).toMatchObject({
      tone: "typo",
      title: "2 of 4 pairs right",
    });
    expect(buildPairsFeedback(0, 4).tone).toBe("wrong");
  });
});

describe("WriteTestCard", () => {
  const word = makeWord(0, "to read", "lukea", "book");

  it("shows the hint and one I-don't-know action instead of skip", () => {
    const onDontKnow = vi.fn();
    render(
      <WriteTestCard
        testState={undefined}
        guessWord={word}
        testOption={TestOption.WriteCorrectAnswer}
        onSendAnswer={noop}
        onDontKnow={onDontKnow}
        onContinue={noop}
        targetLanguageName="Finnish"
      />,
    );
    expect(screen.getByText("(book)")).toBeInTheDocument();
    expect(screen.queryByText(/skip/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: DONT_KNOW_LABEL }));
    expect(onDontKnow).toHaveBeenCalledOnce();
  });

  it("sends the typed answer and keeps it in the wrong-answer feedback", () => {
    const onSend = vi.fn();
    const props = {
      guessWord: word,
      testOption: TestOption.WriteCorrectAnswer,
      onSendAnswer: onSend,
      onDontKnow: noop,
      onContinue: noop,
    };
    const { rerender } = render(<WriteTestCard testState={undefined} {...props} />);
    fireEvent.change(screen.getByLabelText(/your answer/i), {
      target: { value: "talo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(onSend).toHaveBeenCalledWith("talo");

    rerender(<WriteTestCard testState={TestState.Failed} {...props} />);
    const status = screen.getByRole("status");
    expect(within(status).getByText(/talo/)).toBeInTheDocument();
    expect(within(status).getByText("lukea")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });
});

describe("SelectAnswerCard", () => {
  it("keeps the options visible and marks the right one after a wrong pick", () => {
    const words = [
      makeWord(0, "to read", "lukea"),
      makeWord(1, "to sleep", "nukkua"),
    ];
    const settings = { multiSelectChoicesAmount: 2 } as TestSettings;
    const props = {
      guessWord: words[0],
      testOption: TestOption.SelectFromMultiple,
      settings,
      testWords: words,
      onChooseOption: vi.fn(),
      onDontKnow: noop,
      onContinue: noop,
    };
    const { rerender } = render(<SelectAnswerCard testState={undefined} {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "nukkua" }));
    expect(props.onChooseOption).toHaveBeenCalledWith("nukkua");

    rerender(<SelectAnswerCard testState={TestState.Failed} {...props} />);
    expect(screen.getByRole("button", { name: "nukkua" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("lukea");
  });
});

describe("DragDropTestCard", () => {
  const words = [
    makeWord(0, "to write", "kirjoittaa", "pen"),
    makeWord(1, "to sleep", "nukkua"),
  ];

  it("reports each pair as don't-know after showing the answers", () => {
    const onComplete = vi.fn<(r: DragDropResult[]) => void>();
    render(
      <DragDropTestCard
        words={words}
        guessDirection="lang1to2"
        onComplete={onComplete}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "I don't know – show answers" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Answers shown");
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onComplete.mock.calls[0][0].map((r) => r.outcome)).toEqual([
      "dontKnow",
      "dontKnow",
    ]);
  });

  it("swaps two answers by tapping them, then checks the pairs", () => {
    const onComplete = vi.fn<(r: DragDropResult[]) => void>();
    render(
      <DragDropTestCard
        words={words}
        guessDirection="lang1to2"
        onComplete={onComplete}
      />,
    );
    // Two words always start swapped, so one tap-swap puts them right.
    fireEvent.click(screen.getByRole("button", { name: /Answer for to write/ }));
    fireEvent.click(screen.getByRole("button", { name: /Answer for to sleep/ }));
    fireEvent.click(screen.getByRole("button", { name: "Check pairs" }));
    expect(screen.getByRole("status")).toHaveTextContent("All 2 pairs right");
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onComplete.mock.calls[0][0].map((r) => r.outcome)).toEqual([
      "correct",
      "correct",
    ]);
  });
});

describe("TestTopBar", () => {
  it("asks before ending the test and defaults to keep practising", () => {
    const onEndTest = vi.fn();
    render(
      <TestTopBar title="Verbs" learned={3} total={10} onEndTest={onEndTest} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Test options" }));
    expect(screen.getByText("End the test now?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep practising" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Keep practising" }));
    expect(onEndTest).not.toHaveBeenCalled();
  });

  it("ends the test only from the confirm step", () => {
    const onEndTest = vi.fn();
    render(
      <TestTopBar title="Verbs" learned={3} total={10} onEndTest={onEndTest} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Test options" }));
    fireEvent.click(
      screen.getByRole("button", { name: "End test and see results" }),
    );
    expect(onEndTest).toHaveBeenCalledOnce();
  });
});
