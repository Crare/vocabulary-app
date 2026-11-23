import { ReactNode } from "react";
import { Typography } from "@mui/material";

/** Small grey line above the question saying what to do. */
export const ModeLabel = ({ children }: { children: ReactNode }) => (
  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
    {children}
  </Typography>
);
