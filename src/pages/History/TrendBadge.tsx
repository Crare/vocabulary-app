import { Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { alpha, colors } from "../../colors";

interface TrendBadgeProps {
  /** Points gained (or lost) since the previous test. */
  change: number;
  /** Text only, without the tinted background. */
  plain?: boolean;
}

/** "+7 pts" with an arrow; never colour alone, so it reads without colour too. */
export const TrendBadge = ({ change, plain }: TrendBadgeProps) => {
  const up = change >= 0;
  const Icon = up ? ArrowUpwardIcon : ArrowDownwardIcon;
  const label = `${up ? "+" : "−"}${Math.abs(change)} pts`;

  return (
    <Box
      component="span"
      aria-label={`${up ? "Up" : "Down"} ${Math.abs(change)} points since the previous test`}
      sx={(t) => {
        const dark = t.palette.mode === "dark";
        return {
          display: "inline-flex",
          alignItems: "center",
          gap: 0.25,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.4,
          whiteSpace: "nowrap",
          color: up
            ? dark
              ? colors.emerald400
              : colors.emerald800
            : dark
              ? colors.red400
              : colors.red800,
          ...(!plain && {
            px: 0.75,
            py: 0.25,
            borderRadius: "6px",
            bgcolor: up ? alpha.success10 : alpha.error10,
          }),
        };
      }}
    >
      <Icon aria-hidden sx={{ fontSize: 13 }} />
      {label}
    </Box>
  );
};
