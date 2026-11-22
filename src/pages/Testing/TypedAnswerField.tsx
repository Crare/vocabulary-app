import { useEffect, useRef } from "react";
import { Box, Button, InputBase, Typography } from "@mui/material";

interface TypedAnswerFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

/** Answer text field with the Check button beside it. */
export const TypedAnswerField = ({
  id,
  label,
  value,
  onChange,
  onSubmit,
}: TypedAnswerFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay so the field is mounted and enabled before focusing.
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  const submit = () => {
    if (value.trim()) onSubmit();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography
        component="label"
        htmlFor={id}
        variant="body2"
        color="text.secondary"
        sx={{ fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <InputBase
          id={id}
          inputRef={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") submit();
          }}
          autoComplete="off"
          inputProps={{ autoCapitalize: "off", spellCheck: false }}
          sx={{
            flex: 1,
            minWidth: 0,
            height: 52,
            px: 1.75,
            borderRadius: 3,
            border: 2,
            borderColor: "primary.main",
            bgcolor: "background.paper",
            fontSize: "1.125rem",
            fontWeight: 500,
          }}
        />
        <Button
          variant="contained"
          onClick={submit}
          aria-disabled={!value.trim()}
          sx={{
            minWidth: 96,
            height: 52,
            fontSize: "1rem",
            fontWeight: 700,
            opacity: value.trim() ? 1 : 0.5,
          }}
        >
          Check
        </Button>
      </Box>
    </Box>
  );
};
