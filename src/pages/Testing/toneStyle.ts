import { Theme } from "@mui/material/styles";
import { alpha, colors } from "../../colors";
import { FeedbackTone } from "./feedback";


export interface ToneStyle {
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
