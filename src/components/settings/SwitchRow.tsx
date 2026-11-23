import { Box, Switch } from "@mui/material";
import { useId } from "react";
import { alpha, colors } from "../../colors";

import { isDark, tapBorder } from "../../styles/surface";
import { SettingText } from "./SettingText";

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
