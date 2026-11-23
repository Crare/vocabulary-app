import { Theme } from "@mui/material/styles";
import { alpha, colors } from "../../colors";

import { ThemedStyle, isDark } from "../../styles/surface";

export { surfaceSx, tapBorder } from "../../styles/surface";

/** Track of a segmented control (split choice, sheet tabs). */
export const segmentTrackSx: ThemedStyle = (theme) => ({
  display: "grid",
  gridAutoColumns: "minmax(0, 1fr)",
  gridAutoFlow: "column",
  gap: "4px",
  p: "4px",
  borderRadius: "12px",
  bgcolor: isDark(theme) ? alpha.slate15 : colors.slate100,
});

/** One text cell of the word table. */
export const cellSx: ThemedStyle = (theme) => ({
  minWidth: 0,
  height: 40,
  px: "10px",
  borderRadius: "8px",
  border: `1.5px solid ${isDark(theme) ? alpha.slate30 : colors.slate200}`,
  fontWeight: 500,
  fontSize: "0.95rem",
  bgcolor: "background.paper",
  "&.Mui-focused": { borderColor: "primary.main" },
});

/** Hint cell: dashed, tinted and italic so it never reads as an answer. */
export const hintCellSx = (theme: Theme, filled: boolean) => ({
  height: 32,
  fontSize: "0.85rem",
  fontStyle: "italic",
  borderStyle: "dashed",
  borderColor: filled
    ? isDark(theme)
      ? alpha.primary30
      : colors.indigo300
    : isDark(theme)
      ? alpha.slate30
      : colors.slate300,
  bgcolor: filled
    ? isDark(theme)
      ? alpha.primary10
      : colors.indigo50
    : "transparent",
  color: isDark(theme) ? colors.indigo300 : colors.indigo800,
});

/** Small uppercase column header. */
export const columnHeadSx: ThemedStyle = (theme) => ({
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: isDark(theme) ? colors.slate400 : colors.slate600,
  bgcolor: isDark(theme) ? alpha.slate10 : colors.slate50,
  borderBottom: `1px solid ${isDark(theme) ? alpha.slate15 : colors.slate200}`,
});

export const rowDivider = (theme: Theme) =>
  `1px solid ${isDark(theme) ? alpha.slate10 : colors.slate100}`;

export { srOnly } from "../../styles/srOnly";
