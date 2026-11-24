import { Theme } from "@mui/material/styles";
import { SystemStyleObject } from "@mui/system";
import { alpha, colors } from "../colors";

/** A theme-aware style that can sit inside an `sx` array. */
export type ThemedStyle = (theme: Theme) => SystemStyleObject<Theme>;

export const isDark = (theme: Theme) => theme.palette.mode === "dark";

/** 1px hairline border between rows and around cards. */
export const hairline = (theme: Theme) =>
  `1px solid ${isDark(theme) ? alpha.slate15 : colors.slate200}`;

/** Outline of tappable, non-filled controls (tiles, language buttons). */
export const tapBorder = (theme: Theme) =>
  isDark(theme) ? alpha.primary30 : colors.indigo200;

/** White (paper) card with a hairline border. */
export const surfaceSx: ThemedStyle = (theme) => ({
  bgcolor: "background.paper",
  border: hairline(theme),
  borderRadius: "16px",
});
