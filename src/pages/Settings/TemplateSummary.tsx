import { Box, Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import { colors } from "../../colors";
import { plural } from "./listSummary";
import { surfaceSx, tapBorder } from "./styles";

interface TemplateSummaryProps {
  name: string;
  lang1Name: string;
  lang2Name: string;
  wordCount: number;
  hintCount: number;
  onShowWords: () => void;
  onChangeList: () => void;
}

/**
 * Compact card for an unedited template: what is loaded, with the word list
 * kept out of the way so the user can start right away.
 */
export const TemplateSummary = (props: TemplateSummaryProps) => {
  const { name, lang1Name, lang2Name, wordCount, hintCount } = props;
  const languages =
    lang1Name || lang2Name
      ? `${lang1Name || "Language 1"} → ${lang2Name || "Language 2"} · `
      : "";
  const outlined = {
    height: 44,
    minWidth: 0,
    px: 1,
    fontSize: "0.85rem",
    whiteSpace: "nowrap",
    "& .MuiButton-startIcon": { mr: 0.75 },
  } as const;

  return (
    <Box
      component="section"
      aria-labelledby="template-name"
      sx={[
        surfaceSx,
        {
          borderRadius: "18px",
          p: "22px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
        },
      ]}
    >
      <Box
        component="span"
        sx={(theme) => ({
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          height: 26,
          px: 1.25,
          borderRadius: "13px",
          fontSize: "0.75rem",
          fontWeight: 600,
          bgcolor:
            theme.palette.mode === "dark"
              ? "background.default"
              : colors.indigo100,
          color:
            theme.palette.mode === "dark" ? colors.indigo300 : colors.indigo800,
        })}
      >
        <CheckIcon sx={{ fontSize: 14 }} />
        Template selected
      </Box>
      <Typography
        id="template-name"
        component="h1"
        sx={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.25 }}
      >
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {languages}
        {plural(wordCount, "word")}
        {hintCount > 0 && ` · ${plural(hintCount, "hint")}`}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon fontSize="small" />}
          onClick={props.onShowWords}
          sx={(theme) => ({ ...outlined, borderColor: tapBorder(theme) })}
        >
          Show &amp; edit words
        </Button>
        <Button
          variant="outlined"
          startIcon={<GridViewIcon fontSize="small" />}
          onClick={props.onChangeList}
          sx={(theme) => ({ ...outlined, borderColor: tapBorder(theme) })}
        >
          Change list
        </Button>
      </Box>
    </Box>
  );
};
