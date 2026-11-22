import { Box, ButtonBase, IconButton, Switch, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { KeyboardEvent, ReactNode, useId } from "react";
import { alpha, colors } from "../colors";

const isDark = (theme: Theme) => theme.palette.mode === "dark";

/** Hairline between rows and around cards. */
export const hairline = (theme: Theme) =>
  `1px solid ${isDark(theme) ? alpha.slate15 : colors.slate200}`;

/** Outline of tappable, non-filled controls. */
const tapBorder = (theme: Theme) =>
  isDark(theme) ? alpha.primary30 : colors.indigo200;

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

interface SettingTextProps {
  label: string;
  help: string;
  labelId?: string;
  helpId?: string;
}

const SettingText = ({ label, help, labelId, helpId }: SettingTextProps) => (
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

interface SwitchRowProps {
  label: string;
  help: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** A nested option, drawn on a tinted panel under its parent. */
  nested?: boolean;
}

/** A setting that is on or off. The whole row toggles it. */
export const SwitchRow = (props: SwitchRowProps) => {
  const { label, help, checked, onChange, nested } = props;
  const helpId = useId();
  return (
    <Box
      component="label"
      sx={(theme) => ({
        minHeight: 64,
        px: 1.75,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        cursor: "pointer",
        ...(nested && {
          mx: 1.75,
          mb: 1.25,
          mt: -0.5,
          px: 1.5,
          py: 1.25,
          minHeight: 56,
          borderRadius: "12px",
          bgcolor: isDark(theme) ? alpha.primary10 : colors.indigo50,
          borderBottom: "none !important",
        }),
      })}
    >
      <SettingText label={label} help={help} helpId={helpId} />
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        slotProps={{
          input: { role: "switch", "aria-describedby": helpId },
        }}
        sx={(theme) => ({
          width: 52,
          height: 32,
          p: 0,
          flex: "none",
          "& .MuiSwitch-switchBase": {
            p: "3px",
            "&.Mui-checked": {
              transform: "translateX(20px)",
              color: colors.white,
              "& + .MuiSwitch-track": { bgcolor: "primary.main", opacity: 1 },
            },
            "&.Mui-focusVisible + .MuiSwitch-track": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          },
          "& .MuiSwitch-thumb": {
            width: 26,
            height: 26,
            boxShadow: `0 1px 3px ${alpha.black15}`,
          },
          "& .MuiSwitch-track": {
            borderRadius: 16,
            opacity: 1,
            bgcolor: tapBorder(theme),
          },
        })}
      />
    </Box>
  );
};

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
