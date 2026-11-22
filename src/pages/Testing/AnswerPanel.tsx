import { ReactNode, useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha, colors } from "../../colors";
import { DONT_KNOW_LABEL, Feedback, FeedbackTone } from "./feedback";

interface ToneStyle {
  bg: string;
  line: string;
  ink: string;
}

/** Background, accent line and text colour for each feedback tone. */
export const toneStyle = (tone: FeedbackTone, theme: Theme): ToneStyle => {
  const dark = theme.palette.mode === "dark";
  switch (tone) {
    case "correct":
      return dark
        ? { bg: alpha.success10, line: colors.emerald500, ink: colors.emerald400 }
        : { bg: colors.emerald50, line: colors.emerald600, ink: colors.emerald700 };
    case "typo":
      return dark
        ? { bg: alpha.warning10, line: colors.amber500, ink: colors.amber400 }
        : { bg: colors.amber50, line: colors.amber600, ink: colors.amber800 };
    case "wrong":
      return dark
        ? { bg: alpha.error10, line: colors.red500, ink: colors.red400 }
        : { bg: colors.red50, line: colors.red600, ink: colors.red700 };
    default:
      return dark
        ? { bg: alpha.primary15, line: colors.indigo400, ink: colors.indigo300 }
        : { bg: colors.indigo75, line: colors.indigo600, ink: colors.indigo800 };
  }
};

const ToneIcon = ({ feedback }: { feedback: Feedback }) => {
  if (feedback.tone === "revealed")
    return <VisibilityOutlinedIcon fontSize="small" />;
  if (feedback.tone === "wrong" || feedback.crossIcon)
    return <CloseIcon fontSize="small" />;
  return <CheckIcon fontSize="small" />;
};

/** How long fresh answer controls ignore taps after Continue. */
const ARM_DELAY_MS = 350;

interface AnswerPanelProps {
  /** Answer controls (text field, choices, check button) while answering. */
  children?: ReactNode;
  /** Set once the question is answered; replaces the controls. */
  feedback?: Feedback;
  /** "I don't know" action; hidden when undefined. */
  onDontKnow?: () => void;
  dontKnowLabel?: string;
  onContinue: () => void;
  /** When set, a thin bar drains over this many ms before auto-advance. */
  autoAdvanceMs?: number;
  /** Keep the controls visible above the feedback (e.g. coloured choices). */
  keepControls?: boolean;
}

/**
 * The panel at the bottom of every question. On phones it sticks to the
 * bottom of the screen so the answer controls and Continue stay under the
 * thumb, in the same place in every state.
 */
export const AnswerPanel = ({
  children,
  feedback,
  onDontKnow,
  dontKnowLabel = DONT_KNOW_LABEL,
  onContinue,
  autoAdvanceMs,
  keepControls = false,
}: AnswerPanelProps) => {
  const continueRef = useRef<HTMLButtonElement>(null);
  const hasFeedback = feedback !== undefined;
  // Continue and the next question's controls share the same spot, so a
  // double tap on Continue could answer the next question. Ignore taps on
  // fresh controls for a moment.
  const [armed, setArmed] = useState(true);

  useEffect(() => {
    if (hasFeedback) {
      continueRef.current?.focus();
      return;
    }
    setArmed(false);
    const timer = setTimeout(() => setArmed(true), ARM_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hasFeedback]);

  return (
    <Box
      sx={(theme) => {
        const tone = feedback ? toneStyle(feedback.tone, theme) : undefined;
        return {
          position: { xs: "sticky", md: "static" },
          bottom: 0,
          zIndex: 2,
          mx: { xs: -2, md: 0 },
          mb: { xs: -2, md: 0 },
          px: 2,
          pt: 1.75,
          pb: { xs: "calc(16px + env(safe-area-inset-bottom))", md: 2 },
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          bgcolor: tone ? tone.bg : "background.paper",
          borderTop: tone ? `3px solid ${tone.line}` : `1px solid ${alpha.slate25}`,
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { xs: "0 -8px 24px rgba(15,23,42,0.08)", md: "none" },
          border: { md: tone ? undefined : `1px solid ${alpha.slate15}` },
        };
      }}
    >
      {feedback ? (
        <>
          {keepControls && children}
          <Box
            role="status"
            aria-live="assertive"
            sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
          >
            <Box
              sx={(theme) => ({
                width: 36,
                height: 36,
                flex: "none",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: toneStyle(feedback.tone, theme).line,
                color: colors.white,
              })}
            >
              <ToneIcon feedback={feedback} />
            </Box>
            <Box
              sx={(theme) => ({
                flex: 1,
                minWidth: 0,
                color: toneStyle(feedback.tone, theme).ink,
              })}
            >
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 700 }}>
                {feedback.title}
              </Typography>
              {feedback.text && (
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  {feedback.text}
                </Typography>
              )}
              {feedback.answer && (
                <Typography
                  sx={{
                    fontSize: "1.375rem",
                    fontWeight: 700,
                    color: "text.primary",
                    overflowWrap: "anywhere",
                  }}
                >
                  {feedback.answer}
                </Typography>
              )}
            </Box>
          </Box>
          {autoAdvanceMs !== undefined && (
            <Box
              aria-hidden="true"
              sx={(theme) => ({
                height: 3,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: alpha.black06,
                "&::after": {
                  content: '""',
                  display: "block",
                  height: "100%",
                  bgcolor: toneStyle(feedback.tone, theme).line,
                  animation: `drain ${autoAdvanceMs}ms linear forwards`,
                },
                "@keyframes drain": {
                  from: { width: "100%" },
                  to: { width: "0%" },
                },
              })}
            />
          )}
          <Button
            ref={continueRef}
            variant="contained"
            size="large"
            onClick={onContinue}
            endIcon={<ArrowForwardIcon />}
            sx={{ minHeight: 52, fontSize: "1rem", fontWeight: 700 }}
          >
            Continue
          </Button>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            pointerEvents: armed ? undefined : "none",
          }}
        >
          {children}
          {onDontKnow && (
            <>
              <Divider sx={{ mt: 0.5 }} />
              <Button
                variant="text"
                onClick={onDontKnow}
                startIcon={<VisibilityOutlinedIcon />}
                sx={{ minHeight: 44 }}
              >
                {dontKnowLabel}
              </Button>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
