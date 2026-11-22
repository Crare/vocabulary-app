import { Box, Button, Link, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { alpha, colors } from "../../colors";
import { partSizeFor } from "./wordRows";
import { SegmentedControl } from "./SegmentedControl";
import { surfaceSx } from "./styles";

export type PartSplit = 1 | 2 | 4;

interface PractisePanelProps {
  /** Words that can be tested (rows with both words). */
  total: number;
  split: PartSplit;
  onSplitChange: (split: PartSplit) => void;
  onStart: () => void;
  /** Why the test cannot start, or null when it can. */
  blockedReason: string | null;
  /**
   * "bar" is the sticky phone footer, "card" the desktop side panel and
   * "plain" the open section of the compact template view.
   */
  variant: "bar" | "card" | "plain";
  onOpenTestSettings?: () => void;
}

/** Split choice and the Start test button. */
export const PractisePanel = (props: PractisePanelProps) => {
  const {
    total,
    split,
    onSplitChange,
    onStart,
    blockedReason,
    variant,
    onOpenTestSettings,
  } = props;
  const count = partSizeFor(total, split);
  const n = (parts: PartSplit) => (total > 0 ? partSizeFor(total, parts) : "");

  const content = (
    <>
      <SegmentedControl<PartSplit>
        label="How many words to practise"
        value={split}
        onChange={onSplitChange}
        options={[
          { value: 1, label: `All ${n(1)}`.trim() },
          { value: 2, label: total > 0 ? `Half · ${n(2)}` : "Half" },
          { value: 4, label: total > 0 ? `Quarter · ${n(4)}` : "Quarter" },
        ]}
      />
      {blockedReason && (
        <Typography
          role="status"
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          {blockedReason}
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={onStart}
        disabled={!!blockedReason}
        startIcon={<PlayArrowIcon />}
        sx={{
          height: variant === "plain" ? 60 : 52,
          borderRadius: variant === "plain" ? "16px" : "14px",
          fontSize: variant === "plain" ? "1.1rem" : "1rem",
          fontWeight: 700,
          "&.Mui-disabled": { bgcolor: alpha.primary30, color: colors.white },
        }}
      >
        Start test · {count} {count === 1 ? "word" : "words"}
      </Button>
      {split > 1 && !blockedReason && (
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", textAlign: "center", mt: -0.5 }}
        >
          Part 1 of {split}. You can go on to the next part from the results.
        </Typography>
      )}
    </>
  );

  if (variant === "bar") {
    return (
      <Box
        sx={(theme) => ({
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "var(--bottom-nav-height, 0px)",
          zIndex: theme.zIndex.appBar,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.mode === "dark" ? alpha.slate15 : colors.slate200}`,
          boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.08)",
          p: "12px 16px calc(16px + env(safe-area-inset-bottom))",
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
        })}
      >
        {content}
      </Box>
    );
  }

  const plain = variant === "plain";
  return (
    <Box
      component="section"
      aria-labelledby="practise-title"
      sx={[
        plain ? {} : surfaceSx,
        {
          p: plain ? 0 : "20px",
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
        },
      ]}
    >
      <Typography
        id="practise-title"
        component="h2"
        sx={{ fontSize: "1rem", fontWeight: 700 }}
      >
        {plain ? "How many words?" : "Practise"}
      </Typography>
      {content}
      {onOpenTestSettings && (
        <Link
          component="button"
          type="button"
          onClick={onOpenTestSettings}
          sx={{ fontSize: "0.85rem", alignSelf: "center" }}
        >
          Test settings
        </Link>
      )}
    </Box>
  );
};
