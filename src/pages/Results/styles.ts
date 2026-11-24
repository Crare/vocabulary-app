import { alpha, colors } from "../../colors";

import { ThemedStyle, isDark } from "../../styles/surface";

export { hairline, surfaceSx } from "../../styles/surface";

/** Outlined indigo button: secondary actions. */
export const outlinedActionSx: ThemedStyle = (theme) => ({
  minHeight: 44,
  borderRadius: "12px",
  borderWidth: "1.5px",
  borderColor: isDark(theme) ? alpha.primary30 : colors.indigo200,
  bgcolor: "background.paper",
  fontWeight: 600,
  "&:hover": { borderWidth: "1.5px" },
});

/** Filled indigo button: the one main action. */
export const primaryActionSx = {
  height: 52,
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: 700,
} as const;

/** Small tile behind a supporting number. */
export const statTileSx: ThemedStyle = (theme) => ({
  p: "10px",
  borderRadius: "10px",
  bgcolor: isDark(theme) ? alpha.slate10 : alpha.primary04,
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
});
