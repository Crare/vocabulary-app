import { Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";


export const ChangeLine = ({ change }: { change: number | null }) => {
  if (change === null) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        First test of these words
      </Typography>
    );
  }
  if (change === 0) {
    return (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Same as last time
      </Typography>
    );
  }
  const up = change > 0;
  const Icon = up ? ArrowUpwardIcon : ArrowDownwardIcon;
  const points = Math.abs(change);
  return (
    <Typography
      variant="body2"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}
    >
      <Icon
        aria-hidden
        sx={{ fontSize: 16, color: up ? "success.dark" : "error.main" }}
      />
      {points} {points === 1 ? "point" : "points"} {up ? "up" : "down"} from
      last time
    </Typography>
  );
};
