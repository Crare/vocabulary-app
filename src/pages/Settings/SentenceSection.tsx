import {
  Box,
  ButtonBase,
  Collapse,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { SentenceText } from "./wordRows";
import { surfaceSx } from "./styles";

interface SentenceSectionProps {
  sentences: SentenceText;
  onChange: (sentences: SentenceText) => void;
  lang1Label: string;
  lang2Label: string;
}

/** Optional fill-in-the-blank sentences, collapsed until opened. */
export const SentenceSection = (props: SentenceSectionProps) => {
  const { sentences, onChange, lang1Label, lang2Label } = props;
  const [open, setOpen] = useState(
    () =>
      !!(
        sentences.language1Sentences.trim() ||
        sentences.language2Sentences.trim()
      ),
  );

  const field = (
    key: keyof SentenceText,
    label: string,
    placeholder: string,
  ) => (
    <TextField
      label={`Sentences (${label})`}
      multiline
      minRows={4}
      maxRows={15}
      value={sentences[key]}
      onChange={(e) => onChange({ ...sentences, [key]: e.target.value })}
      placeholder={placeholder}
      sx={{ flex: "1 1 240px" }}
    />
  );

  return (
    <Box component="section" sx={surfaceSx}>
      <ButtonBase
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="sentence-panel"
        sx={{
          width: "100%",
          height: 52,
          px: { xs: "14px", md: "20px" },
          justifyContent: "space-between",
          color: "primary.main",
          fontWeight: 600,
          fontSize: "0.9rem",
          borderRadius: "16px",
        }}
      >
        <span>
          Sentence training{" "}
          <Box
            component="span"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            · optional
          </Box>
        </span>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </ButtonBase>
      <Collapse in={open}>
        <Box
          id="sentence-panel"
          sx={{
            px: { xs: "14px", md: "20px" },
            pb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Add a sentence that uses each word, for fill-in-the-blank practice.
            One sentence per line, in the same order as the words.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {field("language1Sentences", lang1Label, "e.g. I go to school")}
            {field("language2Sentences", lang2Label, "e.g. Minä menen kouluun")}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
