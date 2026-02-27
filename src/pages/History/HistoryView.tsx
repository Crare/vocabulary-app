import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { HistoryEntry } from "../Testing/types";
import {
  clearHistory,
  deleteHistoryEntry,
  deleteHistoryGroup,
  loadHistory,
} from "../../util/historyStorage";
import { calculateTotalScore } from "../Results/resultUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HistoryGroupDetail } from "./HistoryGroupDetail";
import { alpha } from "../../colors";

/** Group entries by languageSetName, preserving insertion order. */
const groupBySet = (entries: HistoryEntry[]): Map<string, HistoryEntry[]> => {
  const map = new Map<string, HistoryEntry[]>();
  for (const entry of entries) {
    const key = entry.languageSetName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return map;
};

const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export const HistoryView = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      // If the group is now empty, go back to list
      if (
        selectedGroup &&
        !next.some((e) => e.languageSetName === selectedGroup)
      ) {
        setSelectedGroup(null);
      }
      return next;
    });
  };

  const handleDeleteGroup = (languageSetName: string) => {
    deleteHistoryGroup(languageSetName);
    setEntries((prev) =>
      prev.filter((e) => e.languageSetName !== languageSetName),
    );
    setSelectedGroup(null);
  };

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
    setSelectedGroup(null);
  };

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((e) => e.languageSetName.toLowerCase().includes(q));
  }, [entries, search]);

  const grouped = useMemo(() => groupBySet(filteredEntries), [filteredEntries]);

  // Detail view for a selected group
  if (selectedGroup) {
    const groupEntries = entries.filter(
      (e) => e.languageSetName === selectedGroup,
    );
    if (groupEntries.length === 0) {
      // group was deleted, go back
      return null;
    }
    return (
      <Grid
        container
        className="content"
        gap={2}
        flexDirection="column"
        sx={{ maxWidth: "100%", overflow: "hidden" }}
      >
        <Card sx={{ p: 3, maxWidth: "100%", overflow: "hidden" }}>
          <HistoryGroupDetail
            setName={selectedGroup}
            entries={groupEntries}
            onBack={() => setSelectedGroup(null)}
            onDeleteEntry={handleDelete}
            onDeleteGroup={handleDeleteGroup}
          />
        </Card>
      </Grid>
    );
  }

  // List view — shows word set groups
  return (
    <Grid
      container
      className="content"
      gap={2}
      flexDirection="column"
      sx={{ maxWidth: "100%", overflow: "hidden" }}
    >
      <Card sx={{ p: 3, maxWidth: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h3">Test History</Typography>
          {entries.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
            >
              Clear all
            </Button>
          )}
        </Box>

        {entries.length > 0 && (
          <TextField
            size="small"
            placeholder="Search sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            aria-label="Search test history by set name"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {entries.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No test history yet. Complete a test to see it here.
          </Typography>
        ) : filteredEntries.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No results matching &ldquo;{search}&rdquo;.
          </Typography>
        ) : (
          <List disablePadding>
            {Array.from(grouped.entries()).map(([setName, groupEntries]) => {
              const latestEntry = groupEntries[groupEntries.length - 1];
              const latestScore = calculateTotalScore(latestEntry.wordResults);
              return (
                <ListItemButton
                  key={setName}
                  onClick={() => setSelectedGroup(setName)}
                  sx={(theme) => ({
                    border: 1,
                    borderColor:
                      theme.palette.mode === "dark"
                        ? alpha.slate30
                        : alpha.primary20,
                    borderRadius: 2,
                    mb: 1,
                    px: 2,
                    py: 1.5,
                  })}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={700}>{setName}</Typography>
                    }
                    secondary={`Last: ${formatShortDate(latestEntry.date)} · Score: ${latestScore}%`}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      ml: 1,
                    }}
                  >
                    <Chip
                      label={`${groupEntries.length} test${groupEntries.length !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                    />
                    <ChevronRightIcon color="action" />
                  </Box>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Card>
    </Grid>
  );
};
