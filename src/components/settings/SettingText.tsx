import { Box, Typography } from "@mui/material";


export interface SettingTextProps {
  label: string;
  help: string;
  labelId?: string;
  helpId?: string;
}

export const SettingText = ({ label, help, labelId, helpId }: SettingTextProps) => (
  <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
    <Typography id={labelId} component="span" sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
      {label}
    </Typography>
    <Typography
      id={helpId}
      component="span"
      sx={{ fontSize: "0.82rem", lineHeight: 1.4, color: "text.secondary" }}
    >
      {help}
    </Typography>
  </Box>
);
