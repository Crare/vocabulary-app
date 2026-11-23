import { useState } from "react";
import { GuessWordTitle } from "./GuessWordTitle";
import { QuestionCard } from "./QuestionCard";
import { AnswerPanel } from "./AnswerPanel";
import { TypedAnswerField } from "./TypedAnswerField";
import { TestOption, TestState, TestWord } from "./types";
import { GuessDirection, getExpectedAnswer } from "./testLogic";
import { buildFeedback } from "./feedback";

interface WriteTestCardProps {
  testState: TestState | undefined;
  guessWord: TestWord;
  testOption: TestOption;
  onSendAnswer: (value: string) => void;
  onDontKnow: () => void;
  onContinue: () => void;
  autoAdvanceMs?: number;
  guessDirection?: GuessDirection;
  targetLanguageName?: string;
}

/** Writing question: type the translation. */
export const WriteTestCard = ({
  guessWord,
  testOption,
  testState,
  onSendAnswer,
  onDontKnow,
  onContinue,
  autoAdvanceMs,
  guessDirection = "lang1to2",
  targetLanguageName,
}: WriteTestCardProps) => {
  const [typed, setTyped] = useState("");
  const answer = getExpectedAnswer(guessWord, guessDirection);
  const feedback = buildFeedback(
    testState,
    answer,
    testState === TestState.CheckedAnswer ? "" : typed,
  );

  return (
    <>
      <QuestionCard label="Question">
        <GuessWordTitle
          guessWord={guessWord}
          testOption={testOption}
          guessDirection={guessDirection}
          targetLanguageName={targetLanguageName}
        />
      </QuestionCard>
      <AnswerPanel
        feedback={feedback}
        onDontKnow={onDontKnow}
        onContinue={onContinue}
        autoAdvanceMs={feedback?.tone === "revealed" ? undefined : autoAdvanceMs}
      >
        <TypedAnswerField
          id="answer"
          label={`Your answer${targetLanguageName ? ` (${targetLanguageName})` : ""}`}
          value={typed}
          onChange={setTyped}
          onSubmit={() => onSendAnswer(typed)}
        />
      </AnswerPanel>
    </>
  );
};
