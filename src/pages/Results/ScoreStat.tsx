import { Box, Typography } from "@mui/material";
import { statTileSx } from "./styles";


export const Stat = ({ value, label }: { value: string; label: string }) => (
  <Box sx={statTileSx}>
    <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
  </Box>
);
