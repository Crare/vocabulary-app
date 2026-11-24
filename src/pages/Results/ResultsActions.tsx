import { Box, Button, Typography } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { hairline, outlinedActionSx, primaryActionSx, surfaceSx } from "./styles";

export interface ResultsActionsProps {
  /** Words ticked for a retest. */
  selectedCount: number;
  onRetestSelected: () => void;
  onBackToStart: () => void;
  onRetryPart?: () => void;
  onNextPart?: () => void;
  /** Shown on the next-part button, e.g. "2 of 4". */
  nextPartLabel?: string;
  /** "bar" is the fixed phone footer, "card" the desktop side panel. */
  variant: "bar" | "card";
}

type ActionKey = "retest" | "next" | "retry" | "lists";

/**
 * Picks the main action: retest the ticked words, else go on to the next
 * part, else back to the word lists. The others become secondary buttons.
 */
export const pickActions = (
  selectedCount: number,
  hasNextPart: boolean,
  hasRetryPart: boolean,
): { primary: ActionKey; secondary: ActionKey[] } => {
  const primary: ActionKey =
    selectedCount > 0 ? "retest" : hasNextPart ? "next" : "lists";
  const all: ActionKey[] = ["next", "retry", "lists"];
  const secondary = all.filter(
    (k) =>
      k !== primary &&
      (k !== "next" || hasNextPart) &&
      (k !== "retry" || hasRetryPart),
  );
  return { primary, secondary };
};

/** Every action after a test: retest, next part, retry part, back to the lists. */
export const ResultsActions = (props: ResultsActionsProps) => {
  const {
    selectedCount,
    onRetestSelected,
    onBackToStart,
    onRetryPart,
    onNextPart,
    nextPartLabel,
    variant,
  } = props;
  const { primary, secondary } = pickActions(
    selectedCount,
    !!onNextPart,
    !!onRetryPart,
  );

  const labels: Record<ActionKey, string> = {
    retest: `Retest ${selectedCount} ${selectedCount === 1 ? "word" : "words"}`,
    next: nextPartLabel ? `Next part · ${nextPartLabel}` : "Next part",
    retry: "Retry part",
    lists: "Word lists",
  };
  const handlers: Record<ActionKey, (() => void) | undefined> = {
    retest: onRetestSelected,
    next: onNextPart,
    retry: onRetryPart,
    lists: onBackToStart,
  };

  const primaryButton = (
    <Button
      variant="contained"
      onClick={handlers[primary]}
      startIcon={primary === "retest" ? <ReplayIcon /> : undefined}
      endIcon={primary === "next" ? <ArrowForwardIcon /> : undefined}
      sx={primaryActionSx}
    >
      {labels[primary]}
    </Button>
  );

  const secondaryButtons = secondary.length > 0 && (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${secondary.length}, minmax(0, 1fr))`,
        gap: 1,
      }}
    >
      {secondary.map((k) => (
        <Button
          key={k}
          variant="outlined"
          onClick={handlers[k]}
          sx={[outlinedActionSx, { fontSize: "0.85rem", px: 1, lineHeight: 1.2 }]}
        >
          {labels[k]}
        </Button>
      ))}
    </Box>
  );

  if (variant === "bar") {
    return (
      <Box
        role="region"
        aria-label="What next"
        sx={(theme) => ({
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "var(--bottom-nav-height, 0px)",
          zIndex: theme.zIndex.appBar,
          bgcolor: "background.paper",
          borderTop: hairline(theme),
          boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.08)",
          p: "12px 16px calc(16px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        })}
      >
        {primaryButton}
        {secondaryButtons}
      </Box>
    );
  }

  return (
    <Box
      component="section"
      aria-labelledby="next-title"
      sx={[surfaceSx, { p: "20px", display: "flex", flexDirection: "column", gap: 1.25 }]}
    >
      <Typography id="next-title" component="h2" sx={{ fontSize: "1rem", fontWeight: 700 }}>
        What next
      </Typography>
      {primaryButton}
      {secondaryButtons}
    </Box>
  );
};
