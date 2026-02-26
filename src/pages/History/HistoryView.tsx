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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { HistoryEntry, TestWord } from "../Testing/types";
import {
    clearHistory,
    deleteHistoryEntry,
    loadHistory,
} from "../../util/historyStorage";
import {
    calculateScore,
    calculatePercentage,
    calculateAvgAnswerTime,
    formatSeconds,
    calculateOverallAvgTime,
    calculateTotalScore,
} from "../Results/resultUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { WordScoreChart } from "../../components/WordScoreChart";
import { ProgressChart } from "../../components/ProgressChart";
import { alpha } from "../../colors";

const wordColumns: GridColDef[] = [
    { field: "lang1Word", headerName: "Language 1", flex: 1 },
    { field: "lang2Word", headerName: "Language 2", flex: 1 },
    { field: "timesCorrect", headerName: "Correct", flex: 0.6 },
    { field: "timesFailed", headerName: "Wrong", flex: 0.6 },
    {
        field: "score",
        headerName: "Score",
        flex: 0.6,
        valueGetter: (_value, row: TestWord) => calculateScore(row),
    },
    {
        field: "percentage",
        headerName: "Accuracy",
        flex: 0.7,
        valueGetter: (_value, row: TestWord) => `${calculatePercentage(row)}%`,
    },
    {
        field: "avgTime",
        headerName: "Avg Time",
        flex: 0.7,
        valueGetter: (_value, row: TestWord) => calculateAvgAnswerTime(row),
        valueFormatter: (value: number) =>
            value > 0 ? formatSeconds(value) : "-",
    },
];

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
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <Chip
                                                            icon={
                                                                <FormatListNumberedIcon />
                                                            }
                                                            label={`${entry.wordCount} words`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            icon={
                                                                <AccessTimeIcon />
                                                            }
                                                            label={
                                                                entry.timeTaken
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            icon={
                                                                <AvTimerIcon />
                                                            }
                                                            label={`Avg ${formatSeconds(calculateOverallAvgTime(entry.wordResults))}/answer`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            icon={
                                                                <EmojiEventsIcon />
                                                            }
                                                            label={`${calculateTotalScore(entry.wordResults).correct}/${calculateTotalScore(entry.wordResults).total}`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <WordScoreChart
                                                    wordResults={
                                                        entry.wordResults
                                                    }
                                                />
                                                <DataGrid
                                                    rows={entry.wordResults}
                                                    columns={wordColumns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: {
                                                                page: 0,
                                                                pageSize: 10,
                                                            },
                                                        },
                                                    }}
                                                    pageSizeOptions={[10, 20]}
                                                    sx={{
                                                        border: `1px solid ${alpha.slate15}`,
                                                        borderRadius: 2,
                                                        mb: 1.5,
                                                        "& .MuiDataGrid-columnHeaders":
                                                            {
                                                                bgcolor:
                                                                    alpha.primary04,
                                                            },
                                                    }}
                                                    density="compact"
                                                    hideFooterSelectedRowCount
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
