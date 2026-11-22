import { Box, Button, IconButton, InputBase, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { isBlankRow, RowValues, WordRow } from "./wordRows";
import {
  cellSx,
  columnHeadSx,
  hintCellSx,
  rowDivider,
  surfaceSx,
  tapBorder,
} from "./styles";

type Field = keyof RowValues;

interface WordTableProps {
  rows: WordRow[];
  /** Column names without flags, e.g. "English". */
  lang1Label: string;
  lang2Label: string;
  onUpdate: (id: string, patch: Partial<RowValues>) => void;
  onDelete: (id: string) => void;
  /** Appends an empty row and returns its id. */
  onAdd: () => string;
  onPaste: () => void;
}

const PHONE_COLUMNS = "22px minmax(0, 1fr) minmax(0, 1fr) 32px";
const DESKTOP_COLUMNS =
  "36px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.8fr) 40px";

/**
 * The word list as a table: one row per pair, with its hint on the same row,
 * so editing one row can never move a hint onto another word.
 */
export const WordTable = (props: WordTableProps) => {
  const { rows, lang1Label, lang2Label, onUpdate, onDelete, onAdd, onPaste } =
    props;
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"), {
    noSsr: true,
  });
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  // Rows whose hint field the user opened with "+ hint" (phone layout).
  const [openHints, setOpenHints] = useState<Set<string>>(new Set());

  const key = (id: string, field: Field) => `${id}:${field}`;
  const bindInput =
    (id: string, field: Field) => (el: HTMLInputElement | null) => {
      if (el) inputs.current.set(key(id, field), el);
      else inputs.current.delete(key(id, field));
    };

  // Focus after render, once the target input exists.
  useEffect(() => {
    if (!focusTarget) return;
    const el = inputs.current.get(focusTarget);
    if (el) {
      el.focus();
      setFocusTarget(null);
    }
  }, [focusTarget, rows, openHints]);

  const addRow = () => setFocusTarget(key(onAdd(), "lang1"));

  const openHint = (id: string) => {
    setOpenHints((prev) => new Set(prev).add(id));
    setFocusTarget(key(id, "hint"));
  };
  const closeEmptyHint = (row: WordRow) => {
    if (row.hint.trim()) return;
    setOpenHints((prev) => {
      const next = new Set(prev);
      next.delete(row.id);
      return next;
    });
  };

  // Enter moves on like a form: first word → second word → next row.
  const onEnter = (index: number, field: Field) => (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (field === "lang1") {
      setFocusTarget(key(rows[index].id, "lang2"));
    } else if (index + 1 < rows.length) {
      setFocusTarget(key(rows[index + 1].id, "lang1"));
    } else if (!isBlankRow(rows[index])) {
      addRow();
    }
  };

  const cell = (row: WordRow, index: number, field: "lang1" | "lang2") => (
    <InputBase
      inputRef={bindInput(row.id, field)}
      value={row[field]}
      onChange={(e) => onUpdate(row.id, { [field]: e.target.value })}
      onKeyDown={onEnter(index, field)}
      inputProps={{
        "aria-label": `${field === "lang1" ? lang1Label : lang2Label} word ${index + 1}`,
        enterKeyHint: "next",
        autoCapitalize: "none",
        spellCheck: false,
      }}
      sx={[cellSx, { gridArea: field }]}
    />
  );

  const hintCell = (row: WordRow, index: number) => (
    <InputBase
      inputRef={bindInput(row.id, "hint")}
      value={row.hint}
      placeholder={isDesktop ? "—" : "Hint, e.g. game"}
      onChange={(e) => onUpdate(row.id, { hint: e.target.value })}
      onBlur={() => closeEmptyHint(row)}
      onKeyDown={onEnter(index, "hint")}
      inputProps={{ "aria-label": `Hint for word ${index + 1}` }}
      sx={[
        cellSx,
        (theme) => hintCellSx(theme, !!row.hint.trim()),
        { gridArea: "hint" },
      ]}
    />
  );

  return (
    <Box component="section" aria-labelledby="words-title">
      <Box
        sx={[
          {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
          (theme) =>
            isDesktop
              ? {
                  ...surfaceSx(theme),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottom: "none",
                  px: "20px",
                  py: "14px",
                }
              : { mb: 1 },
        ]}
      >
        <Typography
          id="words-title"
          component="h2"
          sx={{ fontSize: "1rem", fontWeight: 700 }}
        >
          Words
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={isDesktop ? "outlined" : "text"}
            size="small"
            startIcon={<ContentPasteIcon fontSize="small" />}
            onClick={onPaste}
            sx={(theme) => ({ borderColor: tapBorder(theme), px: 1.5 })}
          >
            Paste list
          </Button>
          {isDesktop && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon fontSize="small" />}
              onClick={addRow}
              sx={(theme) => ({ borderColor: tapBorder(theme), px: 1.5 })}
            >
              Add word
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={[
          surfaceSx,
          { overflow: "hidden" },
          isDesktop ? { borderTopLeftRadius: 0, borderTopRightRadius: 0 } : {},
        ]}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: isDesktop ? 560 : 0 }}>
            <Box
              aria-hidden="true"
              sx={[
                columnHeadSx,
                {
                  display: "grid",
                  gridTemplateColumns: isDesktop
                    ? DESKTOP_COLUMNS
                    : PHONE_COLUMNS,
                  gap: isDesktop ? "0 12px" : "8px",
                  p: isDesktop ? "10px 20px" : "8px 10px 8px 12px",
                },
              ]}
            >
              <span>#</span>
              <span>{lang1Label}</span>
              <span>{lang2Label}</span>
              {isDesktop && (
                <span>
                  Hint{" "}
                  <Box
                    component="span"
                    sx={{
                      textTransform: "none",
                      letterSpacing: 0,
                      fontWeight: 500,
                    }}
                  >
                    (optional)
                  </Box>
                </span>
              )}
              <span />
            </Box>

            {rows.length === 0 && (
              <Typography
                variant="body2"
                sx={{ p: 2, color: "text.secondary", textAlign: "center" }}
              >
                No words yet. Add a word, paste a list or pick a template.
              </Typography>
            )}

            {rows.map((row, index) => {
              const showHint = isDesktop || !!row.hint || openHints.has(row.id);
              return (
                <Box
                  key={row.id}
                  sx={(theme) => ({
                    display: "grid",
                    alignItems: "center",
                    borderBottom: rowDivider(theme),
                    ...(isDesktop
                      ? {
                          gridTemplateColumns: DESKTOP_COLUMNS,
                          gridTemplateAreas: "'n lang1 lang2 hint del'",
                          gap: "0 12px",
                          p: "6px 20px",
                        }
                      : {
                          gridTemplateColumns: PHONE_COLUMNS,
                          gridTemplateAreas:
                            "'n lang1 lang2 del' '. hint hint .'",
                          gap: "6px 8px",
                          p: "8px 10px 8px 12px",
                        }),
                  })}
                >
                  <Typography
                    component="span"
                    sx={{
                      gridArea: "n",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  {cell(row, index, "lang1")}
                  {cell(row, index, "lang2")}
                  {showHint ? (
                    hintCell(row, index)
                  ) : (
                    <Button
                      size="small"
                      onClick={() => openHint(row.id)}
                      aria-label={`Add a hint to word ${index + 1}`}
                      sx={{
                        gridArea: "hint",
                        justifySelf: "start",
                        minWidth: 0,
                        height: 28,
                        px: 0.5,
                        py: 0,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      + hint
                    </Button>
                  )}
                  <IconButton
                    onClick={() => onDelete(row.id)}
                    aria-label={`Delete word ${index + 1}`}
                    sx={{
                      gridArea: "del",
                      color: "error.dark",
                      width: isDesktop ? 36 : 32,
                      height: isDesktop ? 36 : 40,
                      borderRadius: "8px",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>

        {!isDesktop && (
          <Button
            fullWidth
            startIcon={<AddIcon fontSize="small" />}
            onClick={addRow}
            sx={{ height: 48, borderRadius: 0 }}
          >
            Add word
          </Button>
        )}
      </Box>
    </Box>
  );
};
