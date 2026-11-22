import { Box, Button, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { HistoryEntry } from "../Testing/types";
import { ProgressChart } from "../../components/ProgressChart";
import { HistoryTestRow } from "./HistoryTestRow";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { TrendBadge } from "./TrendBadge";
import { alpha } from "../../colors";
import { relativeDay, summariseGroup, weakestWords } from "./historyStats";

interface HistoryGroupDetailProps {
  setName: string;
  /** Tests of this word list, newest first. */
  entries: HistoryEntry[];
  /** Shown on phones, where the detail replaces the list. */
  onBack?: () => void;
  onDeleteEntry: (entry: HistoryEntry) => void;
  onDeleteGroup: (setName: string) => void;
}

const cardSx = {
  p: 1.75,
  borderRadius: "16px",
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
} as const;

const StatTile = ({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: ReactNode;
}) => (
  <Box
    sx={{
      ...cardSx,
      p: 1.5,
      display: "flex",
      flexDirection: "column",
      gap: 0.25,
    }}
  >
    <Typography variant="caption" color="text.secondary" fontSize={13}>
      {label}
    </Typography>
    <Typography
      fontSize={26}
      fontWeight={700}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}%
    </Typography>
    <Box sx={{ fontSize: 13, color: "text.secondary" }}>{note}</Box>
  </Box>
);

export const HistoryGroupDetail = ({
  setName,
  entries,
  onBack,
  onDeleteEntry,
  onDeleteGroup,
}: HistoryGroupDetailProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const summary = summariseGroup(entries);
  const hard = weakestWords(entries);
  const count = entries.length;
  const testsLabel = `${count} test${count !== 1 ? "s" : ""}`;
  const firstDay = relativeDay(summary.firstDate);
  const lastDay = relativeDay(entries[0].date);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1.75, minWidth: 0 }}
    >
      {onBack && (
        <Button
          onClick={onBack}
          startIcon={<ChevronLeftIcon />}
          sx={{ alignSelf: "flex-start", minHeight: 44, ml: -1, mb: -1 }}
        >
          History
        </Button>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight={700}
            sx={{ overflowWrap: "anywhere" }}
          >
            {setName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {count > 1
              ? `${testsLabel} · first ${firstDay}, last ${lastDay}`
              : `1 test · ${lastDay}`}
          </Typography>
        </Box>
      </Box>

      <Box
        aria-label="Summary"
        role="group"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        <StatTile
          label="Latest"
          value={summary.latest}
          note={
            summary.change === null ? (
              lastDay
            ) : (
              <TrendBadge change={summary.change} plain />
            )
          }
        />
        <StatTile
          label="Best"
          value={summary.best}
          note={relativeDay(summary.bestDate)}
        />
        <StatTile label="First" value={summary.first} note={firstDay} />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.75 }}>
        {count >= 2 && (
          <Box
            component="section"
            aria-labelledby="hist-progress"
            sx={{ ...cardSx, flex: "2 1 320px", minWidth: 0 }}
          >
            <Typography id="hist-progress" component="h3" fontWeight={700}>
              Progress
            </Typography>
            <ProgressChart entries={entries} />
          </Box>
        )}

        {hard.length > 0 && (
          <Box
            component="section"
            aria-labelledby="hist-hard"
            sx={{ ...cardSx, flex: "1 1 240px", minWidth: 0 }}
          >
            <Typography id="hist-hard" component="h3" fontWeight={700}>
              Words to practise
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Lowest accuracy over{" "}
              {count > 1 ? `all ${count} tests` : "this test"}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
              {hard.map((w) => (
                <Box
                  component="li"
                  key={`${w.lang1Word}-${w.lang2Word}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 72px 40px",
                    gap: 1.25,
                    alignItems: "center",
                    py: 1,
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography component="span" fontWeight={600}>
                      {w.lang1Word}
                    </Typography>{" "}
                    <Typography component="span" color="text.secondary">
                      → {w.lang2Word}
                    </Typography>
                    {w.hint && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        {w.hint}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    aria-hidden
                    sx={(t) => ({
                      height: 8,
                      borderRadius: "4px",
                      bgcolor:
                        t.palette.mode === "dark"
                          ? alpha.slate25
                          : alpha.primary15,
                      overflow: "hidden",
                    })}
                  >
                    <Box
                      sx={{
                        height: 8,
                        width: `${w.accuracy}%`,
                        borderRadius: "4px",
                        bgcolor: "primary.main",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    textAlign="right"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {w.accuracy}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box
        component="section"
        aria-labelledby="hist-tests"
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Typography id="hist-tests" component="h3" fontWeight={700} mt={0.5}>
          Tests
        </Typography>
        {entries.map((entry) => (
          <HistoryTestRow
            key={entry.id}
            entry={entry}
            onDelete={() => onDeleteEntry(entry)}
          />
        ))}
      </Box>

      <Button
        variant="outlined"
        color="error"
        size="large"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => setConfirmOpen(true)}
        sx={{ minHeight: 48, borderRadius: "12px", alignSelf: { sm: "flex-start" } }}
      >
        {count > 1
          ? `Delete all ${count} tests of this list`
          : "Delete this list’s test"}
      </Button>

      <ConfirmDeleteDialog
        open={confirmOpen}
        title={`Delete all tests of “${setName}”?`}
        body={
          <>
            This removes <strong>{testsLabel}</strong>
            {count > 1 ? ` from ${firstDay} to ${lastDay}` : ""} and their
            progress. The word list itself stays. This can’t be undone.
          </>
        }
        confirmLabel={`Delete ${testsLabel}`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDeleteGroup(setName);
        }}
      />
    </Box>
  );
};
