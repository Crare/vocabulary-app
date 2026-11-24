import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { TestWord } from "./types";
import { GuessDirection, getDisplayWord, getExpectedAnswer } from "./testLogic";
import { QuestionCard } from "./QuestionCard";
import { ModeLabel } from "./ModeLabel";
import { Hint } from "./Hint";
import { AnswerPanel } from "./AnswerPanel";
import { Feedback, buildPairsFeedback, MISTAKE_EXTRA_DELAY_MS } from "./feedback";
import { PairAnswerButton, PairTileState } from "./PairAnswerButton";
import { DragGhost } from "./DragGhost";
import { shuffle } from "../../util/helpers";
import { useSound } from "../../SoundContext";
import { useSwapDrag } from "../../hooks/useSwapDrag";
import { PairResult } from "./useTestSession";
import { colors } from "../../colors";

export { DRAG_DROP_BATCH_SIZE } from "./testLogic";
export type DragDropResult = PairResult;

type Phase = "answering" | "checked" | "revealed";

interface DragDropTestCardProps {
  words: TestWord[];
  guessDirection: GuessDirection;
  targetLanguageName?: string;
  onComplete: (results: DragDropResult[]) => void;
  /** Auto-continue this many ms after checking; manual when undefined. */
  autoAdvanceMs?: number;
}

/** Shuffle so at least one answer is out of place (unless all are equal). */
export const shuffledAnswers = (expected: string[]): string[] => {
  const answers = [...expected];
  do {
    shuffle(answers);
  } while (new Set(answers).size > 1 && answers.every((a, i) => a === expected[i]));
  return answers;
};

const REVEALED_FEEDBACK: Feedback = {
  tone: "revealed",
  title: "Answers shown",
  text: "Each pair counts as a miss and comes back later.",
};

/**
 * Match-the-pairs question. Answers swap by tapping two of them, or by
 * dragging one onto another; while dragging, a lifted copy follows the
 * pointer or finger and the tile it would land on lights up.
 */
export const DragDropTestCard = ({
  words,
  guessDirection,
  targetLanguageName,
  onComplete,
  autoAdvanceMs,
}: DragDropTestCardProps) => {
  const expected = useMemo(
    () => words.map((w) => getExpectedAnswer(w, guessDirection)),
    [words, guessDirection],
  );
  const [phase, setPhase] = useState<Phase>("answering");
  const { onCorrect, onWrong } = useSound();
  const {
    items: answers,
    selected,
    drag,
    itemProps,
  } = useSwapDrag(() => shuffledAnswers(expected), phase === "answering");

  const isRight = (i: number) => answers[i] === expected[i];
  const rightCount = answers.filter((_, i) => isRight(i)).length;
  const shown = phase === "revealed" ? expected : answers;

  const finish = () =>
    onComplete(
      words.map((word, i) => ({
        word,
        outcome: phase === "revealed" ? "dontKnow" : isRight(i) ? "correct" : "wrong",
      })),
    );
  // A round with a wrong pair keeps the right pairs on screen a bit longer.
  const pairsDelayMs =
    autoAdvanceMs === undefined
      ? undefined
      : autoAdvanceMs + (rightCount < words.length ? MISTAKE_EXTRA_DELAY_MS : 0);

  useEffect(() => {
    if (phase !== "checked" || pairsDelayMs === undefined) return;
    const timer = setTimeout(finish, pairsDelayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pairsDelayMs]);

  const check = () => {
    if (rightCount === words.length) onCorrect();
    else onWrong();
    setPhase("checked");
  };

  const tileState = (i: number): PairTileState => {
    if (phase === "checked") return isRight(i) ? "right" : "wrong";
    if (phase === "revealed") return "revealed";
    if (drag?.moved && drag.from === i) return "dragged";
    if (selected === i || (drag?.moved && drag.over === i)) return "selected";
    return "answering";
  };

  const feedback =
    phase === "checked"
      ? buildPairsFeedback(rightCount, words.length)
      : phase === "revealed"
        ? REVEALED_FEEDBACK
        : undefined;

  return (
    <>
      <QuestionCard label="Match the pairs">
        <ModeLabel>
          Match the {targetLanguageName ? `${targetLanguageName} ` : ""}words
        </ModeLabel>
        <Typography variant="body2" color="text.secondary">
          Tap two answers to swap them, or drag one onto another.
        </Typography>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {words.map((word, i) => {
            const question = getDisplayWord(word, guessDirection);
            return (
              <Box
                key={word.id}
                sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}
              >
                <Box
                  sx={(theme) => ({
                    minHeight: 64,
                    px: 1.25,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: theme.palette.mode === "dark" ? "action.hover" : colors.slate50,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowWrap: "anywhere",
                  })}
                >
                  <Typography sx={{ fontWeight: 600 }}>{question}</Typography>
                  <Hint hint={word.hint} small />
                </Box>
                <PairAnswerButton
                  {...itemProps(i)}
                  label={shown[i]}
                  state={tileState(i)}
                  correctAnswer={expected[i]}
                  aria-pressed={selected === i}
                  aria-label={`Answer for ${question}: ${shown[i]}`}
                />
              </Box>
            );
          })}
        </Box>
      </QuestionCard>

      {drag?.moved && <DragGhost x={drag.x} y={drag.y} label={answers[drag.from]} />}

      <AnswerPanel
        feedback={feedback}
        onDontKnow={() => setPhase("revealed")}
        dontKnowLabel="I don't know – show answers"
        onContinue={finish}
        autoAdvanceMs={phase === "checked" ? pairsDelayMs : undefined}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckIcon />}
          onClick={check}
          sx={{ minHeight: 52, fontSize: "1rem", fontWeight: 700 }}
        >
          Check pairs
        </Button>
      </AnswerPanel>
    </>
  );
};
