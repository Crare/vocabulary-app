import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";


export const cardSx = {
  p: 1.75,
  borderRadius: "16px",
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
} as const;

export const StatTile = ({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: ReactNode;
}) => (
  <Box
    sx={{
      ...cardSx,
      p: 1.5,
      display: "flex",
      flexDirection: "column",
      gap: 0.25,
    }}
  >
    <Typography variant="caption" color="text.secondary" fontSize={13}>
      {label}
    </Typography>
    <Typography
      fontSize={26}
      fontWeight={700}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}%
    </Typography>
    <Box sx={{ fontSize: 13, color: "text.secondary" }}>{note}</Box>
  </Box>
);
