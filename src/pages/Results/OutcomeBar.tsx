import { Box } from "@mui/material";


/** Right vs not-right answers as a two-part bar; the numbers sit beside it in text. */
export const OutcomeBar = ({ right, notRight }: { right: number; notRight: number }) => (
  <Box aria-hidden sx={{ display: "flex", gap: "2px", width: 72, height: 6 }}>
    {right > 0 && (
      <Box sx={{ flex: right, borderRadius: "3px", bgcolor: "success.main" }} />
    )}
    {notRight > 0 && (
      <Box sx={{ flex: notRight, borderRadius: "3px", bgcolor: "error.main" }} />
    )}
  </Box>
);
