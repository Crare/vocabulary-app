import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useEffect, useMemo, useState } from "react";
import { flipPasted, parsePastedList } from "./pasteList";
import { RowValues } from "./wordRows";
import { colors } from "../../colors";
import { columnHeadSx, rowDivider, tapBorder } from "./styles";

const PREVIEW_ROWS = 5;

interface PasteListDialogProps {
  open: boolean;
  onClose: () => void;
  /** Full language labels, e.g. "🇫🇮 Finnish". */
  lang1Label: string;
  lang2Label: string;
  hasRows: boolean;
  onAppend: (rows: RowValues[]) => void;
  onReplace: (rows: RowValues[]) => void;
}

const formatLines = (lines: number[]) =>
  lines.length > 5
    ? `${lines.slice(0, 5).join(", ")} and ${lines.length - 5} more`
    : lines.join(", ");

/** Paste many pairs at once, preview them, then add or replace. */
export const PasteListDialog = (props: PasteListDialogProps) => {
  const {
    open,
    onClose,
    lang1Label,
    lang2Label,
    hasRows,
    onAppend,
    onReplace,
  } = props;
  const [text, setText] = useState("");
  const [leftIsLang1, setLeftIsLang1] = useState(true);

  useEffect(() => {
    if (open) {
      setText("");
      setLeftIsLang1(true);
    }
  }, [open]);

  const parsed = useMemo(() => parsePastedList(text), [text]);
  const rows = leftIsLang1 ? parsed.rows : flipPasted(parsed.rows);
  const hintCount = rows.filter((r) => r.hint).length;
  const leftLabel = leftIsLang1 ? lang1Label : lang2Label;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="paste-title"
      slotProps={{
        paper: { sx: { m: 2, width: "calc(100% - 32px)", borderRadius: 4 } },
      }}
    >
      <DialogTitle id="paste-title" sx={{ pr: 7, fontWeight: 700 }}>
        Paste a list
        <IconButton
          onClick={onClose}
          aria-label="Close"
          color="primary"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          One pair per line: <strong>word = translation</strong>. Add a hint
          after a <strong>|</strong>. Rows copied from a spreadsheet
          (tab-separated) work too.
        </Typography>
        <TextField
          label="Your list"
          multiline
          minRows={5}
          maxRows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"pelata = play | game\nsoittaa = call | phone"}
          slotProps={{
            htmlInput: { spellCheck: false, autoCapitalize: "none" },
            input: {
              sx: {
                fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
                fontSize: "0.9rem",
              },
            },
          }}
          autoFocus
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, minWidth: 180 }}>
            Left of <strong>=</strong> goes to <strong>{leftLabel}</strong>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapHorizIcon fontSize="small" />}
            onClick={() => setLeftIsLang1((v) => !v)}
            sx={(theme) => ({ borderColor: tapBorder(theme) })}
          >
            Swap sides
          </Button>
        </Box>

        {(rows.length > 0 || parsed.skippedLines.length > 0) && (
          <Box
            role="status"
            aria-live="polite"
            sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Preview · {rows.length} {rows.length === 1 ? "row" : "rows"}
              {hintCount > 0 && `, ${hintCount} with hints`}
            </Typography>
            {rows.length > 0 && (
              <Box
                sx={(theme) => ({
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  fontSize: "0.85rem",
                  border: `1px solid ${theme.palette.mode === "dark" ? colors.slate500 : colors.slate200}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                  "& > span": { px: 1.25, py: 0.75, overflowWrap: "anywhere" },
                })}
              >
                {[lang1Label, lang2Label, "Hint"].map((h) => (
                  <Box
                    component="span"
                    key={h}
                    sx={[
                      columnHeadSx,
                      { textTransform: "none", fontSize: "0.8rem" },
                    ]}
                  >
                    {h}
                  </Box>
                ))}
                {rows.slice(0, PREVIEW_ROWS).map((r, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "contents",
                      "& > span": { borderTop: (t) => rowDivider(t) },
                    }}
                  >
                    <span>{r.lang1}</span>
                    <span>{r.lang2}</span>
                    <Box
                      component="span"
                      sx={{ fontStyle: "italic", color: "text.secondary" }}
                    >
                      {r.hint}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            {rows.length > PREVIEW_ROWS && (
              <Typography variant="caption" color="text.secondary">
                and {rows.length - PREVIEW_ROWS} more
              </Typography>
            )}
            {parsed.skippedLines.length > 0 && (
              <Typography variant="caption" sx={{ color: "error.dark" }}>
                Skipped {parsed.skippedLines.length === 1 ? "line" : "lines"}{" "}
                {formatLines(parsed.skippedLines)}: use = or a tab between the
                two words.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexWrap: "wrap" }}>
        <Button
          variant={hasRows ? "outlined" : "contained"}
          disabled={rows.length === 0}
          onClick={() => onAppend(rows)}
          sx={(theme) => ({ borderColor: tapBorder(theme), height: 44 })}
        >
          {hasRows
            ? "Add to the end"
            : rows.length
              ? `Add ${rows.length} ${rows.length === 1 ? "word" : "words"}`
              : "Add words"}
        </Button>
        {hasRows && (
          <Button
            variant="outlined"
            color="error"
            disabled={rows.length === 0}
            onClick={() => onReplace(rows)}
            sx={{ height: 44, color: "error.dark", borderColor: colors.red200 }}
          >
            Replace all rows
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
