import { Autocomplete, Button, Popover, TextField } from "@mui/material";
import { useState } from "react";
import { LANGUAGE_OPTIONS } from "../../wordsets/languages";
import { tapBorder } from "./styles";

interface LanguagePickerProps {
  /** What this language is, for screen readers: "First language". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Shown on the button while no language is set. */
  placeholder: string;
}

/**
 * A button showing the chosen language; it opens a searchable list that also
 * accepts any typed name.
 */
export const LanguagePicker = (props: LanguagePickerProps) => {
  const { label, value, onChange, placeholder } = props;
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);
  const commit = (next: string | null) => {
    onChange((next ?? "").trim());
    close();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label={`${label}: ${value || "not set"}. Change`}
        aria-haspopup="dialog"
        sx={(theme) => ({
          height: 44,
          minWidth: 0,
          px: 1.5,
          borderColor: tapBorder(theme),
          bgcolor: "background.paper",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "block",
        })}
      >
        {value || placeholder}
      </Button>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 1.5, width: 260, borderRadius: 3 } } }}
      >
        <Autocomplete
          freeSolo
          openOnFocus
          autoHighlight
          options={LANGUAGE_OPTIONS}
          value={value}
          onChange={(_e, next) => commit(next)}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              size="small"
              label={label}
              placeholder="Type or pick a language"
            />
          )}
        />
      </Popover>
    </>
  );
};
