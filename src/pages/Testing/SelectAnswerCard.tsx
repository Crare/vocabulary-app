import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { GuessWordTitle } from "./GuessWordTitle";
import { QuestionCard } from "./QuestionCard";
import { AnswerPanel } from "./AnswerPanel";
import { TestOption, TestSettings, TestState, TestWord } from "./types";
import {
  GuessDirection,
  getExpectedAnswer,
  getAnswerOptionsForDirection,
} from "./testLogic";
import { buildFeedback } from "./feedback";
import { shuffle } from "../../util/helpers";
import { alpha, colors } from "../../colors";

interface SelectAnswerCardProps {
  testState: TestState | undefined;
  guessWord: TestWord;
  testOption: TestOption;
  settings: TestSettings;
  testWords: TestWord[];
  onChooseOption: (value: string) => void;
  onDontKnow: () => void;
  onContinue: () => void;
  autoAdvanceMs?: number;
  guessDirection?: GuessDirection;
  targetLanguageName?: string;
}

/** Pick the right answer among shuffled options (unique, correct included). */
const pickOptions = (
  words: TestWord[],
  word: TestWord,
  direction: GuessDirection,
  amount: number,
) => {
  const correct = getExpectedAnswer(word, direction);
  const wrong = [
    ...new Set(
      getAnswerOptionsForDirection(words, direction).filter((a) => a !== correct),
    ),
  ];
  shuffle(wrong);
  const options = [correct, ...wrong.slice(0, Math.max(0, amount - 1))];
  shuffle(options);
  return options;
};

/** Multiple-choice question. */
export const SelectAnswerCard = ({
  guessWord,
  testOption,
  testState,
  settings,
  testWords,
  onChooseOption,
  onDontKnow,
  onContinue,
  autoAdvanceMs,
  guessDirection = "lang1to2",
  targetLanguageName,
}: SelectAnswerCardProps) => {
  const [picked, setPicked] = useState("");
  const correct = getExpectedAnswer(guessWord, guessDirection);
  const options = useMemo(
    () =>
      pickOptions(
        testWords,
        guessWord,
        guessDirection,
        settings.multiSelectChoicesAmount,
      ),
    // Re-shuffle only for a new question, not on every answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guessWord, guessDirection],
  );
  const answered = testState !== undefined;
  const feedback = buildFeedback(testState, correct);
  const oneColumn = options.some((o) => o.length > 14);

  const choose = (option: string) => {
    if (answered) return;
    setPicked(option);
    onChooseOption(option);
  };

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
        keepControls
        onDontKnow={onDontKnow}
        onContinue={onContinue}
        autoAdvanceMs={feedback?.tone === "revealed" ? undefined : autoAdvanceMs}
      >
        <Box
          role="group"
          aria-label="Answer options"
          sx={{
            display: "grid",
            gridTemplateColumns: oneColumn ? "1fr" : "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {options.map((option) => {
            const isRight = answered && option === correct;
            const isWrongPick =
              answered && option === picked && option !== correct;
            return (
              <Button
                key={option}
                variant="outlined"
                onClick={() => choose(option)}
                aria-disabled={answered}
                startIcon={
                  isRight ? <CheckIcon /> : isWrongPick ? <CloseIcon /> : undefined
                }
                sx={(theme) => ({
                  minHeight: 60,
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  borderWidth: isRight || isWrongPick ? 2 : 1.5,
                  borderColor: isRight
                    ? colors.emerald600
                    : isWrongPick
                      ? colors.red600
                      : colors.indigo200,
                  bgcolor: isRight
                    ? theme.palette.mode === "dark"
                      ? alpha.success10
                      : colors.emerald50
                    : isWrongPick
                      ? theme.palette.mode === "dark"
                        ? alpha.error10
                        : colors.red50
                      : "background.paper",
                  color: isRight
                    ? "success.dark"
                    : isWrongPick
                      ? "error.dark"
                      : "primary.main",
                  opacity: answered && !isRight && !isWrongPick ? 0.45 : 1,
                  overflowWrap: "anywhere",
                  pointerEvents: answered ? "none" : undefined,
                  "&:hover": {
                    borderWidth: isRight || isWrongPick ? 2 : 1.5,
                    bgcolor: answered ? undefined : alpha.primary08,
                  },
                })}
              >
                {option}
              </Button>
            );
          })}
        </Box>
      </AnswerPanel>
    </>
  );
};
