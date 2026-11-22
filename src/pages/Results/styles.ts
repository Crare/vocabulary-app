import { Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system";
import { alpha, colors } from "../../colors";

const isDark = (theme: Theme) => theme.palette.mode === "dark";

type ThemedStyle = (theme: Theme) => SystemStyleObject<Theme>;

/** Hairline used for card borders and dividers. */
export const hairline = (theme: Theme) =>
  isDark(theme) ? alpha.slate15 : colors.slate200;

/** White (paper) card with a hairline border. */
export const surfaceSx: ThemedStyle = (theme) => ({
  bgcolor: "background.paper",
  border: `1px solid ${hairline(theme)}`,
  borderRadius: "16px",
});

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
