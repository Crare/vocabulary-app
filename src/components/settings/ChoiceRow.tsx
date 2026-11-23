import { Box, ButtonBase } from "@mui/material";
import { KeyboardEvent, useId } from "react";
import { alpha, colors } from "../../colors";

import { isDark, tapBorder } from "../../styles/surface";
import { SettingText } from "./SettingText";

export interface ChoiceOption<T> {
  value: T;
  label: string;
}

interface ChoiceRowProps<T> {
  label: string;
  help: string;
  value: T;
  options: ChoiceOption<T>[];
  onChange: (value: T) => void;
  /** "segmented" for two or three words, "chips" for a grid of short values. */
  variant: "segmented" | "chips";
}

/** One choice out of a few, shown as a radio group of buttons. */
export const ChoiceRow = <T extends string | number | boolean>(
  props: ChoiceRowProps<T>,
) => {
  const { label, help, value, options, onChange, variant } = props;
  const labelId = useId();
  const helpId = useId();

  // Arrow keys move the choice, as in a native radio group.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const current = options.findIndex((o) => o.value === value);
    const next = (current + step + options.length) % options.length;
    onChange(options[next].value);
    e.currentTarget.querySelectorAll<HTMLElement>("[role=radio]")[next]?.focus();
  };

  const segmented = variant === "segmented";
  return (
    <Box sx={{ px: 1.75, py: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
      <SettingText label={label} help={help} labelId={labelId} helpId={helpId} />
      <Box
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={helpId}
        onKeyDown={onKeyDown}
        sx={(theme) =>
          segmented
            ? {
                display: "grid",
                gridAutoColumns: "minmax(0, 1fr)",
                gridAutoFlow: "column",
                gap: "4px",
                p: "4px",
                borderRadius: "12px",
                bgcolor: isDark(theme) ? alpha.slate15 : colors.indigo50,
              }
            : {
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "6px",
              }
        }
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <ButtonBase
              key={String(o.value)}
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value)}
              sx={(theme) => ({
                minHeight: segmented ? 40 : 44,
                px: 1,
                borderRadius: segmented ? "9px" : "10px",
                fontWeight: 600,
                fontSize: "0.82rem",
                textAlign: "center",
                "&.Mui-focusVisible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 1,
                },
                ...(segmented
                  ? {
                      color: "primary.main",
                      bgcolor: on ? "background.paper" : "transparent",
                      boxShadow: on ? `0 1px 3px ${alpha.black15}` : "none",
                    }
                  : {
                      border: "1.5px solid",
                      borderColor: on ? "primary.main" : tapBorder(theme),
                      bgcolor: on ? "primary.main" : "background.paper",
                      color: on ? theme.palette.primary.contrastText : "primary.main",
                    }),
              })}
            >
              {o.label}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
};
