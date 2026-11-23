import { Box, Typography } from "@mui/material";
import { ReactNode, useId } from "react";

import { hairline } from "../../styles/surface";

interface SettingsGroupProps {
  title: string;
  children: ReactNode;
}

/** A titled white card holding a list of setting rows. */
export const SettingsGroup = ({ title, children }: SettingsGroupProps) => {
  const id = useId();
  return (
    <Box
      component="section"
      aria-labelledby={id}
      sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}
    >
      <Typography
        id={id}
        component="h2"
        sx={{
          mx: 0.5,
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={(theme) => ({
          bgcolor: "background.paper",
          border: hairline(theme),
          borderRadius: "16px",
          overflow: "hidden",
          "& > :not(:last-child)": { borderBottom: hairline(theme) },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};
