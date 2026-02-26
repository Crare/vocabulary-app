import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { HistoryEntry } from "../Testing/types";
import {
    clearHistory,
    deleteHistoryEntry,
    loadHistory,
} from "../../util/historyStorage";
import { calculateTotalScore } from "../Results/resultUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { WordScoreChart } from "../../components/WordScoreChart";
import { ProgressChart } from "../../components/ProgressChart";
import { WordResultsTable } from "../../components/WordResultsTable";
import { TestSummaryChips } from "../../components/TestSummaryChips";
import { SentenceTrainingResults } from "../../components/SentenceTrainingResults";
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

export const HistoryView = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setEntries(loadHistory());
    }, []);

    const handleDelete = (id: string) => {
        deleteHistoryEntry(id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const handleClearAll = () => {
        clearHistory();
        setEntries([]);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredEntries = useMemo(() => {
        if (!search.trim()) return entries;
        const q = search.toLowerCase();
        return entries.filter((e) =>
            e.languageSetName.toLowerCase().includes(q),
        );
    }, [entries, search]);

    const grouped = useMemo(
        () => groupBySet(filteredEntries),
        [filteredEntries],
    );

    return (
        <Grid container className="content" gap={2} flexDirection="column">
            <Card sx={{ p: 3 }}>
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
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        py={4}
                    >
                        No test history yet. Complete a test to see it here.
                    </Typography>
                ) : filteredEntries.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        py={4}
                    >
                        No results matching &ldquo;{search}&rdquo;.
                    </Typography>
                ) : (
                    Array.from(grouped.entries()).map(
                        ([setName, groupEntries]) => (
                            <Accordion
                                key={setName}
                                defaultExpanded={false}
                                disableGutters
                                elevation={0}
                                sx={(theme) => ({
                                    border: 1,
                                    borderColor:
                                        theme.palette.mode === "dark"
                                            ? alpha.slate30
                                            : alpha.primary20,
                                    borderRadius: "12px !important",
                                    mb: 1.5,
                                    "&:before": { display: "none" },
                                })}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            width: "100%",
                                            pr: 1,
                                        }}
                                    >
                                        <Typography
                                            fontWeight={700}
                                            sx={{ flex: 1 }}
                                        >
                                            {setName}
                                        </Typography>
                                        <Chip
                                            label={`${groupEntries.length} test${groupEntries.length !== 1 ? "s" : ""}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0 }}>
                                    <ProgressChart entries={groupEntries} />
                                    {groupEntries.map((entry) => (
                                        <Accordion
                                            key={entry.id}
                                            disableGutters
                                            elevation={0}
                                            sx={(theme) => ({
                                                border: 1,
                                                borderColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? alpha.slate25
                                                        : alpha.primary15,
                                                borderRadius: "8px !important",
                                                mb: 1,
                                                "&:before": {
                                                    display: "none",
                                                },
                                            })}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        flexWrap: "wrap",
                                                        width: "100%",
                                                        pr: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            flex: 1,
                                                            minWidth: 100,
                                                        }}
                                                    >
                                                        {formatDate(entry.date)}
                                                    </Typography>
                                                    <TestSummaryChips
                                                        wordResults={
                                                            entry.wordResults
                                                        }
                                                        timeTaken={
                                                            entry.timeTaken
                                                        }
                                                        score={calculateTotalScore(
                                                            entry.wordResults,
                                                        )}
                                                    />
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <WordScoreChart
                                                    wordResults={
                                                        entry.wordResults
                                                    }
                                                />
                                                <WordResultsTable
                                                    wordResults={
                                                        entry.wordResults
                                                    }
                                                    variant="history"
                                                />
                                                <SentenceTrainingResults
                                                    wordResults={
                                                        entry.wordResults
                                                    }
                                                    compact
                                                />
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() =>
                                                        handleDelete(entry.id)
                                                    }
                                                >
                                                    Delete entry
                                                </Button>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ),
                    )
                )}
            </Card>
        </Grid>
    );
};
