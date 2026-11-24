import { Box, IconButton, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useId } from "react";

import { tapBorder } from "../../styles/surface";
import { SettingText } from "./SettingText";

interface StepperRowProps {
  label: string;
  help: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Names the buttons, e.g. "right answers" → "Fewer right answers". */
  unit: string;
}

/** A small whole number with − and + buttons. */
export const StepperRow = (props: StepperRowProps) => {
  const { label, help, value, min, max, onChange, unit } = props;
  const labelId = useId();
  const stepSx = (theme: Theme) => ({
    width: 44,
    height: 44,
    border: `1.5px solid ${tapBorder(theme)}`,
    color: "primary.main",
  });
  return (
    <Box
      role="group"
      aria-labelledby={labelId}
      sx={{ px: 1.75, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}
    >
      <SettingText label={label} help={help} labelId={labelId} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: "none" }}>
        <IconButton
          aria-label={`Fewer ${unit}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          sx={stepSx}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography
          component="output"
          aria-live="polite"
          sx={{ width: 28, textAlign: "center", fontSize: "1.1rem", fontWeight: 700 }}
        >
          {value}
        </Typography>
        <IconButton
          aria-label={`More ${unit}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          sx={stepSx}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
