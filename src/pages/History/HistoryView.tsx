import {
  Box,
  Button,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { HistoryEntry } from "../Testing/types";
import {
  clearHistory,
  deleteHistoryEntry,
  deleteHistoryGroup,
  loadHistory,
  restoreHistoryEntry,
} from "../../util/historyStorage";
import { createLogger } from "../../util/logger";
import { HistoryGroupDetail } from "./HistoryGroupDetail";
import { HistoryListItem } from "./HistoryListItem";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { groupBySet } from "./historyStats";

const log = createLogger("history-view");

interface HistoryViewProps {
  /** Opens the word lists page (from the empty state). */
  onGoToWordLists?: () => void;
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export const HistoryView = ({ onGoToWordLists }: HistoryViewProps) => {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [undoEntry, setUndoEntry] = useState<HistoryEntry | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const groups = useMemo(() => groupBySet(entries), [entries]);
  const shownGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? groups.filter((g) => g.setName.toLowerCase().includes(q))
      : groups;
  }, [groups, search]);

  // Desktop always shows a detail: the picked list if it still has tests,
  // else the most recent list shown. Phones show the list until one is picked.
  const pickedGroup = groups.find((g) => g.setName === selected);
  const activeGroup = isWide ? (pickedGroup ?? shownGroups[0]) : pickedGroup;
  const activeName = activeGroup?.setName ?? null;

  const openGroup = (setName: string) => {
    log.info("group_opened", { setName });
    setSelected(setName);
  };

  // Only the latest deletion can be undone; a newer one replaces the offer.
  const handleDeleteEntry = (entry: HistoryEntry) => {
    deleteHistoryEntry(entry.id);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    setUndoEntry(entry);
  };

  const handleUndo = () => {
    if (!undoEntry) return;
    restoreHistoryEntry(undoEntry);
    setEntries(loadHistory());
    setSelected(undoEntry.languageSetName);
    setUndoEntry(null);
  };

  const handleDeleteGroup = (setName: string) => {
    deleteHistoryGroup(setName);
    setEntries((prev) => prev.filter((e) => e.languageSetName !== setName));
    setSelected(null);
    setUndoEntry(null);
  };

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
    setSelected(null);
    setUndoEntry(null);
    setConfirmClear(false);
  };

  const undoSnackbar = (
    <Snackbar
      open={undoEntry !== null}
      onClose={(_e, reason) => {
        if (reason !== "clickaway") setUndoEntry(null);
      }}
      autoHideDuration={6000}
      message={
        undoEntry ? `Test from ${shortDate(undoEntry.date)} deleted` : ""
      }
      action={
        <Button
          onClick={handleUndo}
          sx={(t) => ({
            color: t.palette.mode === "dark" ? "primary.dark" : "primary.light",
            fontWeight: 700,
            minHeight: 44,
          })}
        >
          Undo
        </Button>
      }
    />
  );

  const pageSx = {
    width: "100%",
    maxWidth: 1200,
    mx: "auto",
    minWidth: 0,
  } as const;

  if (entries.length === 0) {
    return (
      <Box sx={pageSx}>
        <Typography variant="h5" component="h1" fontWeight={700}>
          History
        </Typography>
        <Box
          sx={{
            mt: 3,
            mx: "auto",
            maxWidth: 480,
            p: { xs: "32px 24px", sm: 5 },
            borderRadius: "20px",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
          }}
        >
          <Box
            aria-hidden
            sx={(t) => ({
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: t.palette.action.hover,
              color: "primary.main",
            })}
          >
            <ShowChartIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" component="h2" fontWeight={700}>
            No tests yet
          </Typography>
          <Typography color="text.secondary">
            Finish a test and your score shows up here, grouped by word list, so
            you can see yourself improve.
          </Typography>
          {onGoToWordLists && (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={onGoToWordLists}
              sx={{ mt: 1, minHeight: 48 }}
            >
              Go to word lists
            </Button>
          )}
        </Box>
        {undoSnackbar}
      </Box>
    );
  }

  const testCount = entries.length;
  const listPane = (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}
    >
      <Box>
        <Typography variant="h5" component="h1" fontWeight={700}>
          History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {testCount} test{testCount !== 1 ? "s" : ""} across {groups.length}{" "}
          word list
          {groups.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {groups.length > 1 && (
        <TextField
          type="search"
          placeholder="Search word lists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          slotProps={{
            htmlInput: { "aria-label": "Search word lists" },
            input: {
              sx: {
                minHeight: 44,
                bgcolor: "background.paper",
                borderRadius: "12px",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      )}

      {shownGroups.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No word lists match “{search}”.
        </Typography>
      ) : (
        <Box
          component="ul"
          aria-label="Word lists"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
          }}
        >
          {shownGroups.map((g) => (
            <li key={g.setName}>
              <HistoryListItem
                group={g}
                onOpen={() => openGroup(g.setName)}
                selected={isWide && g.setName === activeName}
                compact={isWide}
              />
            </li>
          ))}
        </Box>
      )}

      <Button
        color="error"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => setConfirmClear(true)}
        sx={{
          alignSelf: isWide ? "flex-start" : "center",
          minHeight: 44,
          mt: 0.5,
        }}
      >
        Clear all history
      </Button>
    </Box>
  );

  const detail = activeGroup ? (
    <HistoryGroupDetail
      key={activeGroup.setName}
      setName={activeGroup.setName}
      entries={activeGroup.entries}
      onBack={isWide ? undefined : () => setSelected(null)}
      onDeleteEntry={handleDeleteEntry}
      onDeleteGroup={handleDeleteGroup}
    />
  ) : null;

  return (
    <Box sx={pageSx}>
      {isWide ? (
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ flex: "0 1 360px", minWidth: 280 }}>{listPane}</Box>
          <Box sx={{ flex: "1 1 0", minWidth: 0 }}>{detail}</Box>
        </Box>
      ) : (
        (detail ?? listPane)
      )}

      <ConfirmDeleteDialog
        open={confirmClear}
        title="Clear all history?"
        body={
          <>
            This removes <strong>all {testCount} tests</strong> of{" "}
            {groups.length} word list
            {groups.length !== 1 ? "s" : ""}. Your word lists stay. This can’t
            be undone.
          </>
        }
        confirmLabel={`Delete ${testCount} test${testCount !== 1 ? "s" : ""}`}
        onCancel={() => setConfirmClear(false)}
        onConfirm={handleClearAll}
      />
      {undoSnackbar}
    </Box>
  );
};
