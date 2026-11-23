import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TestState } from "./types";
import { BlankedSentence } from "./sentenceLogic";
import { QuestionCard } from "./QuestionCard";
import { ModeLabel } from "./ModeLabel";
import { Hint } from "./Hint";
import { AnswerPanel, toneStyle } from "./AnswerPanel";
import { TypedAnswerField } from "./TypedAnswerField";
import { buildFeedback } from "./feedback";
import { alpha, colors } from "../../colors";

interface SentenceTestCardProps {
  testState: TestState | undefined;
  /** The sentence in the answer language, with one word taken out. */
  blank: BlankedSentence;
  /** The same sentence in full, in the other language. */
  referenceSentence?: string;
  hint?: string;
  targetLanguageName?: string;
  referenceLanguageName?: string;
  onSendAnswer: (guess: string) => void;
  onDontKnow: () => void;
  onContinue: () => void;
  autoAdvanceMs?: number;
}

/** Fill-in-the-blank question: type the word missing from the sentence. */
export const SentenceTestCard = ({
  testState,
  blank,
  referenceSentence,
  hint,
  targetLanguageName,
  referenceLanguageName,
  onSendAnswer,
  onDontKnow,
  onContinue,
  autoAdvanceMs,
}: SentenceTestCardProps) => {
  const [guess, setGuess] = useState("");
  const revealed = testState === TestState.CheckedAnswer;
  const feedback = buildFeedback(testState, blank.missingWord, revealed ? "" : guess);
  // Keep the learner's own writing in the gap; the right word is in the panel.
  const gapText = revealed ? blank.missingWord : guess;

  return (
    <>
      <QuestionCard label="Sentence">
        <ModeLabel>
          Fill the gap{targetLanguageName ? ` in ${targetLanguageName}` : ""}
        </ModeLabel>
        {referenceSentence && (
          <Box
            sx={(theme) => ({
              width: "100%",
              px: 1.75,
              py: 1.5,
              borderRadius: 3,
              bgcolor: theme.palette.mode === "dark" ? alpha.slate10 : colors.slate50,
            })}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {referenceLanguageName || "Reference"}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>{referenceSentence}</Typography>
          </Box>
        )}
        <Typography
          component="p"
          sx={{ m: 0, fontSize: "1.375rem", lineHeight: 1.6, fontWeight: 600 }}
        >
          {blank.before}
          <Box
            component="span"
            aria-label={gapText ? `gap: ${gapText}` : "gap"}
            sx={(theme) => {
              const tone = feedback ? toneStyle(feedback.tone, theme) : undefined;
              return {
                display: "inline-block",
                minWidth: 76,
                px: 0.75,
                borderBottom: `2.5px dashed ${tone ? tone.line : theme.palette.primary.main}`,
                color: tone ? tone.ink : "primary.main",
              };
            }}
          >
            {gapText || " "}
          </Box>
          {blank.after}
        </Typography>
        <Hint hint={hint} />
      </QuestionCard>
      <AnswerPanel
        feedback={feedback}
        onDontKnow={onDontKnow}
        onContinue={onContinue}
        autoAdvanceMs={revealed ? undefined : autoAdvanceMs}
      >
        <TypedAnswerField
          id="sentence-answer"
          label={`Missing word${targetLanguageName ? ` (${targetLanguageName})` : ""}`}
          value={guess}
          onChange={setGuess}
          onSubmit={() => onSendAnswer(guess)}
        />
      </AnswerPanel>
    </>
  );
};
