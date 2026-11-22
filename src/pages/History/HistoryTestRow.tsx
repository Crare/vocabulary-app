import { Box, Button, ButtonBase, Collapse, Typography } from "@mui/material";
import { useId, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { HistoryEntry } from "../Testing/types";
import { calculateOverallAvgTime, formatSeconds } from "../Results/resultUtils";
import {
  entryAccuracy,
  entryAnswerCounts,
  timesDidntKnow,
} from "./historyStats";

interface HistoryTestRowProps {
  entry: HistoryEntry;
  onDelete: () => void;
}

const formatTestDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const sameDay = d.toDateString() === today.toDateString();
  const day = sameDay
    ? "Today"
    : d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        ...(d.getFullYear() !== today.getFullYear() && { year: "numeric" }),
      });
  return `${day}, ${time}`;
};

const COLS = "minmax(0, 1fr) 44px 44px 52px";

/** One past test: a summary line that opens to show each word's answers. */
export const HistoryTestRow = ({ entry, onDelete }: HistoryTestRowProps) => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { right, total } = entryAnswerCounts(entry);
  const words = entry.wordResults.length;

  return (
    <Box
      sx={{
        borderRadius: "14px",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <ButtonBase
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        sx={{
          width: "100%",
          minHeight: 60,
          px: 1.75,
          py: 1.25,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto 20px",
          gap: 1.5,
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          <Typography fontWeight={600}>{formatTestDate(entry.date)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {words} word{words !== 1 ? "s" : ""} · {entry.timeTaken}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <Typography
            fontWeight={700}
            fontSize={17}
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {entryAccuracy(entry)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {right} of {total} right
          </Typography>
        </Box>
        <ExpandMoreIcon
          color="primary"
          aria-hidden
          sx={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms",
          }}
        />
      </ButtonBase>

      <Collapse in={open} unmountOnExit>
        <Box
          id={panelId}
          sx={{ px: 1.75, pb: 1.25, borderTop: 1, borderColor: "divider" }}
        >
          <Box role="table" aria-label="Answers per word">
            <Box
              role="row"
              sx={{
                display: "grid",
                gridTemplateColumns: COLS,
                gap: 1,
                pt: 1.25,
                pb: 0.75,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              <span role="columnheader">Word</span>
              <Box
                component="span"
                role="columnheader"
                sx={{ textAlign: "right" }}
              >
                Right
              </Box>
              <Box
                component="span"
                role="columnheader"
                sx={{ textAlign: "right" }}
              >
                Wrong
              </Box>
              <Box
                component="span"
                role="columnheader"
                sx={{ textAlign: "right" }}
              >
                Didn’t know
              </Box>
            </Box>
            <Box role="rowgroup">
              {entry.wordResults.map((w) => (
                <Box
                  key={`${w.id}-${w.lang1Word}`}
                  role="row"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: COLS,
                    gap: 1,
                    alignItems: "center",
                    py: 0.75,
                    borderTop: 1,
                    borderColor: "divider",
                    fontSize: 14,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Box
                    role="cell"
                    sx={{ minWidth: 0, overflowWrap: "anywhere" }}
                  >
                    {w.lang1Word}{" "}
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      → {w.lang2Word}
                    </Box>
                    {w.hint && (
                      <Box
                        component="span"
                        sx={{
                          display: "block",
                          fontSize: 12,
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        {w.hint}
                      </Box>
                    )}
                  </Box>
                  <Box role="cell" sx={{ textAlign: "right" }}>
                    {w.timesCorrect}
                  </Box>
                  <Box
                    role="cell"
                    sx={{
                      textAlign: "right",
                      fontWeight: w.timesFailed ? 700 : 400,
                    }}
                  >
                    {w.timesFailed}
                  </Box>
                  <Box
                    role="cell"
                    sx={{
                      textAlign: "right",
                      fontWeight: timesDidntKnow(w) ? 700 : 400,
                    }}
                  >
                    {timesDidntKnow(w)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            component="p"
            sx={{ pt: 1 }}
          >
            Took {entry.timeTaken} ·{" "}
            {formatSeconds(calculateOverallAvgTime(entry.wordResults))} per
            answer
          </Typography>
          <Button
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={onDelete}
            sx={{ mt: 0.5, ml: -1, minHeight: 44 }}
          >
            Delete this test
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};
