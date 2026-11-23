import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { TestWord } from "./types";
import { GuessDirection, getDisplayWord, getExpectedAnswer } from "./testLogic";
import { Hint, ModeLabel, QuestionCard } from "./GuessWordTitle";
import { AnswerPanel, toneStyle } from "./AnswerPanel";
import { Feedback, buildPairsFeedback, MISTAKE_EXTRA_DELAY_MS } from "./feedback";
import { shuffle } from "../../util/helpers";
import { useSound } from "../../SoundContext";
import { colors } from "../../colors";

/** Maximum words to show in a single drag-and-drop round. */
export const DRAG_DROP_BATCH_SIZE = 4;

export interface DragDropResult {
  word: TestWord;
  outcome: "correct" | "wrong" | "dontKnow";
}

interface DragDropTestCardProps {
  words: TestWord[];
  guessDirection: GuessDirection;
  targetLanguageName?: string;
  onComplete: (results: DragDropResult[]) => void;
  /** Auto-continue this many ms after checking; manual when undefined. */
  autoAdvanceMs?: number;
}

interface DragState {
  from: number;
  over: number;
  moved: boolean;
  x: number;
  y: number;
}

/** Pixels the pointer must travel before a press becomes a drag. */
const DRAG_THRESHOLD = 6;

/** Shuffle so at least one answer is out of place (unless all are equal). */
const shuffledAnswers = (expected: string[]) => {
  const answers = [...expected];
  do {
    shuffle(answers);
  } while (
    new Set(answers).size > 1 &&
    answers.every((a, i) => a === expected[i])
  );
  return answers;
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
  const expected = words.map((w) => getExpectedAnswer(w, guessDirection));
  const [answers, setAnswers] = useState(() => shuffledAnswers(expected));
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"answering" | "checked" | "revealed">(
    "answering",
  );
  const [drag, setDrag] = useState<DragState | null>(null);
  const { onCorrect, onWrong } = useSound();
  const startRef = useRef({ x: 0, y: 0 });
  const suppressClickRef = useRef(false);

  const answering = phase === "answering";
  const shown = phase === "revealed" ? expected : answers;
  const rightCount = answers.filter((a, i) => a === expected[i]).length;

  const results = (): DragDropResult[] =>
    words.map((word, i) => ({
      word,
      outcome:
        phase === "revealed"
          ? "dontKnow"
          : answers[i] === expected[i]
            ? "correct"
            : "wrong",
    }));

  const finish = () => onComplete(results());
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

  const swap = (i: number, j: number) =>
    setAnswers((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const tap = (i: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!answering) return;
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      swap(selected, i);
      setSelected(null);
    }
  };

  const onPointerDown = (i: number, e: React.PointerEvent<HTMLElement>) => {
    if (!answering || e.button !== 0) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({ from: i, over: -1, moved: false, x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const moved =
      drag.moved ||
      Math.abs(e.clientX - startRef.current.x) +
        Math.abs(e.clientY - startRef.current.y) >
        DRAG_THRESHOLD;
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const tile = hit?.closest<HTMLElement>("[data-pair]");
    const over = tile ? Number(tile.dataset.pair) : -1;
    setDrag({
      from: drag.from,
      over: over === drag.from ? -1 : over,
      moved,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.moved) {
      suppressClickRef.current = true;
      if (drag.over >= 0) swap(drag.from, drag.over);
      setSelected(null);
    }
    setDrag(null);
  };

  const feedback: Feedback | undefined =
    phase === "checked"
      ? buildPairsFeedback(rightCount, words.length)
      : phase === "revealed"
        ? {
            tone: "revealed",
            title: "Answers shown",
            text: "Each pair counts as a miss and comes back later.",
          }
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
        <Box
          sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
        >
          {words.map((word, i) => {
            const isRight = phase === "checked" && answers[i] === expected[i];
            const isWrong = phase === "checked" && !isRight;
            const isDragged = drag?.moved && drag.from === i;
            const isTarget = drag?.moved && drag.over === i;
            const isSelected = selected === i || isTarget;
            return (
              <Box
                key={word.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1,
                }}
              >
                <Box
                  sx={(theme) => ({
                    minHeight: 64,
                    px: 1.25,
                    py: 1,
                    borderRadius: 3,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "action.hover"
                        : colors.slate50,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowWrap: "anywhere",
                  })}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {getDisplayWord(word, guessDirection)}
                  </Typography>
                  <Hint hint={word.hint} small />
                </Box>
                <Button
                  data-pair={i}
                  variant="outlined"
                  onClick={() => tap(i)}
                  onPointerDown={(e) => onPointerDown(i, e)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={() => setDrag(null)}
                  aria-pressed={selected === i}
                  aria-disabled={!answering}
                  aria-label={`Answer for ${getDisplayWord(word, guessDirection)}: ${shown[i]}`}
                  startIcon={
                    answering ? (
                      <DragIndicatorIcon />
                    ) : isRight ? (
                      <CheckIcon />
                    ) : isWrong ? (
                      <CloseIcon />
                    ) : undefined
                  }
                  sx={(theme) => {
                    const tone = isRight
                      ? toneStyle("correct", theme)
                      : isWrong
                        ? toneStyle("wrong", theme)
                        : phase === "revealed"
                          ? toneStyle("revealed", theme)
                          : undefined;
                    return {
                      minHeight: 64,
                      flexDirection: "column",
                      gap: 0.25,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      touchAction: answering ? "none" : undefined,
                      cursor: answering ? "grab" : "default",
                      pointerEvents: answering ? undefined : "none",
                      overflowWrap: "anywhere",
                      transition:
                        "background-color .15s ease, border-color .15s ease, opacity .15s ease",
                      borderWidth: 2,
                      borderStyle: isDragged ? "dashed" : "solid",
                      borderColor: tone
                        ? tone.line
                        : isSelected
                          ? "primary.main"
                          : colors.indigo200,
                      bgcolor: tone
                        ? tone.bg
                        : isSelected
                          ? colors.indigo100
                          : "background.paper",
                      color: tone ? tone.ink : "primary.main",
                      opacity: isDragged ? 0.5 : 1,
                      "& .MuiButton-startIcon": { m: 0 },
                      "&:hover": { borderWidth: 2 },
                    };
                  }}
                >
                  <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                    {shown[i]}
                  </Box>
                  {isWrong && (
                    <Box
                      component="span"
                      sx={(theme) => ({
                        fontSize: "0.8125rem",
                        color: toneStyle("correct", theme).ink,
                      })}
                    >
                      → {expected[i]}
                    </Box>
                  )}
                </Button>
              </Box>
            );
          })}
        </Box>
      </QuestionCard>

      {drag?.moved && (
        <Box
          aria-hidden="true"
          sx={{
            position: "fixed",
            left: drag.x - 84,
            top: drag.y - 32,
            zIndex: 1500,
            width: 168,
            minHeight: 60,
            px: 1,
            borderRadius: 3,
            border: 2,
            borderColor: "primary.main",
            bgcolor: "background.paper",
            color: "primary.dark",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            fontWeight: 600,
            pointerEvents: "none",
            transform: "rotate(-2deg) scale(1.05)",
            boxShadow: "0 14px 30px rgba(79,70,229,0.35)",
          }}
        >
          <DragIndicatorIcon fontSize="small" />
          {answers[drag.from]}
        </Box>
      )}

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
          onClick={() => {
            if (rightCount === words.length) onCorrect();
            else onWrong();
            setPhase("checked");
          }}
          sx={{ minHeight: 52, fontSize: "1rem", fontWeight: 700 }}
        >
          Check pairs
        </Button>
      </AnswerPanel>
    </>
  );
};
