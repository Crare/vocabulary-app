import { Box, ButtonBase } from "@mui/material";
import { alpha } from "../../colors";
import { segmentTrackSx } from "./styles";

export interface SegmentOption<T> {
  value: T;
  label: string;
  /** Element id, needed when a tab points to its panel. */
  id?: string;
  controls?: string;
}

interface SegmentedControlProps<T> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  /** "radio" for a choice, "tab" when each option shows a different panel. */
  kind?: "radio" | "tab";
}

/** A pill row of mutually exclusive options (iOS-style segmented control). */
export const SegmentedControl = <T extends string | number>(
  props: SegmentedControlProps<T>,
) => {
  const { options, value, onChange, label, kind = "radio" } = props;
  return (
    <Box
      role={kind === "tab" ? "tablist" : "radiogroup"}
      aria-label={label}
      sx={segmentTrackSx}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <ButtonBase
            key={String(o.value)}
            id={o.id}
            role={kind}
            aria-checked={kind === "radio" ? on : undefined}
            aria-selected={kind === "tab" ? on : undefined}
            aria-controls={o.controls}
            onClick={() => onChange(o.value)}
            sx={{
              height: 40,
              borderRadius: "9px",
              color: "primary.main",
              fontWeight: 600,
              fontSize: "0.85rem",
              bgcolor: on ? "background.paper" : "transparent",
              boxShadow: on ? `0 1px 3px ${alpha.black15}` : "none",
              "&.Mui-focusVisible": {
                outline: "2px solid",
                outlineColor: "primary.main",
              },
            }}
          >
            {o.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
};
