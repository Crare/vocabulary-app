// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GuessWordTitle } from "../src/pages/Testing/GuessWordTitle";
import { DragDropTestCard } from "../src/pages/Testing/DragDropTestCard";
import { checkAnswer } from "../src/pages/Testing/testLogic";
import { TestOption, TestWord } from "../src/pages/Testing/types";
import verbs2 from "../src/wordsets/words13.json";

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
  timesSkipped: 0,
  timesCheckedAnswer: 0,
  totalAnswerTimeMs: 0,
  answerAttempts: 0,
});

describe("word hints", () => {
  it("shows the hint with the question in both directions", () => {
    const word = makeWord(0, "play", "soittaa", "instrument");
    const { rerender } = render(
      <GuessWordTitle
        guessWord={word}
        testOption={TestOption.WriteCorrectAnswer}
        guessDirection="lang1to2"
      />,
    );
    expect(screen.getByText("play")).toBeInTheDocument();
    expect(screen.getByText("(instrument)")).toBeInTheDocument();

    rerender(
      <GuessWordTitle
        guessWord={word}
        testOption={TestOption.WriteCorrectAnswer}
        guessDirection="lang2to1"
      />,
    );
    expect(screen.getByText("soittaa")).toBeInTheDocument();
    expect(screen.getByText("(instrument)")).toBeInTheDocument();
  });

  it("shows no hint line for words without a hint", () => {
    render(
      <GuessWordTitle
        guessWord={makeWord(0, "eat", "syödä")}
        testOption={TestOption.WriteCorrectAnswer}
      />,
    );
    expect(screen.queryByText(/^\(.*\)$/)).not.toBeInTheDocument();
  });

  it("does not require the hint in the written answer", () => {
    const word = makeWord(0, "call", "soittaa", "phone");
    expect(checkAnswer("call", word, "lang2to1", false)).toBe("correct");
    expect(checkAnswer("soittaa", word, "lang1to2", false)).toBe("correct");
  });

  it("renders drag and drop when every answer is the same word", () => {
    const words = [
      makeWord(0, "play", "soittaa", "instrument"),
      makeWord(1, "call", "soittaa", "phone"),
    ];
    render(
      <DragDropTestCard
        words={words}
        guessDirection="lang1to2"
        onComplete={() => {}}
      />,
    );
    expect(screen.getByText("(instrument)")).toBeInTheDocument();
    expect(screen.getByText("(phone)")).toBeInTheDocument();
  });

  it("keeps hints separate from the words in verbs part 2", () => {
    const hinted = verbs2.words.filter((w) => "hint" in w);
    expect(hinted).toEqual([
      { lang1: "play", lang2: "pelata", hint: "game" },
      { lang1: "play", lang2: "soittaa", hint: "instrument" },
      { lang1: "call", lang2: "soittaa", hint: "phone" },
    ]);
    expect(verbs2.words.every((w) => !/[()]/.test(w.lang1))).toBe(true);
  });
});
