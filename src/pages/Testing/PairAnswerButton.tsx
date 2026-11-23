import { Box, Button, ButtonProps } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { toneStyle } from "./AnswerPanel";
import { colors } from "../../colors";

/** How an answer tile looks. */
export type PairTileState =
  | "answering"
  | "selected"
  | "dragged"
  | "right"
  | "wrong"
  | "revealed";

interface PairAnswerButtonProps
  extends Omit<ButtonProps, "children" | "startIcon" | "sx"> {
  label: string;
  state: PairTileState;
  /** Shown under a wrong answer. */
  correctAnswer?: string;
}

/** One draggable / tappable answer in match-the-pairs. */
export const PairAnswerButton = ({
  label,
  state,
  correctAnswer,
  ...buttonProps
}: PairAnswerButtonProps) => {
  const interactive =
    state === "answering" || state === "selected" || state === "dragged";
  const startIcon = interactive ? (
    <DragIndicatorIcon />
  ) : state === "right" ? (
    <CheckIcon />
  ) : state === "wrong" ? (
    <CloseIcon />
  ) : undefined;

  return (
    <Button
      variant="outlined"
      aria-disabled={!interactive}
      startIcon={startIcon}
      sx={(theme) => {
        const tone =
          state === "right"
            ? toneStyle("correct", theme)
            : state === "wrong"
              ? toneStyle("wrong", theme)
              : state === "revealed"
                ? toneStyle("revealed", theme)
                : undefined;
        const highlighted = state === "selected";
        return {
          minHeight: 64,
          flexDirection: "column",
          gap: 0.25,
          fontSize: "0.95rem",
          fontWeight: 600,
          touchAction: interactive ? "none" : undefined,
          cursor: interactive ? "grab" : "default",
          pointerEvents: interactive ? undefined : "none",
          overflowWrap: "anywhere",
          transition:
            "background-color .15s ease, border-color .15s ease, opacity .15s ease",
          borderWidth: 2,
          borderStyle: state === "dragged" ? "dashed" : "solid",
          borderColor: tone ? tone.line : highlighted ? "primary.main" : colors.indigo200,
          bgcolor: tone ? tone.bg : highlighted ? colors.indigo100 : "background.paper",
          color: tone ? tone.ink : "primary.main",
          opacity: state === "dragged" ? 0.5 : 1,
          "& .MuiButton-startIcon": { m: 0 },
          "&:hover": { borderWidth: 2 },
        };
      }}
      {...buttonProps}
    >
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        {label}
      </Box>
      {state === "wrong" && correctAnswer && (
        <Box
          component="span"
          sx={(theme) => ({
            fontSize: "0.8125rem",
            color: toneStyle("correct", theme).ink,
          })}
        >
          → {correctAnswer}
        </Box>
      )}
    </Button>
  );
};
