import { Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { colors } from "../../colors";

/** Indigo used for hints, readable in light and dark mode. */
export const hintColor = (theme: Theme) =>
  theme.palette.mode === "dark" ? colors.indigo300 : colors.indigo800;

interface HintProps {
  hint?: string;
  small?: boolean;
}

/** The word's hint in italics, in brackets; never part of the answer. */
export const Hint = ({ hint, small }: HintProps) =>
  hint ? (
    <Typography
      component="span"
      sx={(theme) => ({
        display: "block",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: small ? "0.8125rem" : "1rem",
        color: hintColor(theme),
      })}
    >
      ({hint})
    </Typography>
  ) : null;
