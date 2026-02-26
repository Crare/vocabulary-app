import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    Chip,
    Grid,
    Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
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
} from "../Results/resultUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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

export const HistoryView = () => {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

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

    return (
        <Grid container className="content" gap={2} flexDirection="column">
            <Card sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
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

                {entries.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        textAlign="center"
                        py={4}
                    >
                        No test history yet. Complete a test to see it here.
                    </Typography>
                ) : (
                    entries.map((entry) => (
                        <Accordion
                            key={entry.id}
                            disableGutters
                            elevation={0}
                            sx={{
                                border: "1px solid rgba(79,70,229,0.15)",
                                borderRadius: "12px !important",
                                mb: 1.5,
                                "&:before": { display: "none" },
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                    <Box sx={{ flex: 1, minWidth: 120 }}>
                                        <Typography fontWeight={600}>
                                            {entry.languageSetName}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {formatDate(entry.date)}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Chip
                                            icon={<FormatListNumberedIcon />}
                                            label={`${entry.wordCount} words`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<AccessTimeIcon />}
                                            label={entry.timeTaken}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<AvTimerIcon />}
                                            label={`Avg ${formatSeconds(calculateOverallAvgTime(entry.wordResults))}/answer`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<EmojiEventsIcon />}
                                            label={`Score ${entry.score}`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
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
                                        border: "1px solid rgba(148,163,184,0.15)",
                                        borderRadius: 2,
                                        mb: 1.5,
                                        "& .MuiDataGrid-columnHeaders": {
                                            bgcolor: "rgba(79,70,229,0.04)",
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
                                    onClick={() => handleDelete(entry.id)}
                                >
                                    Delete entry
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    ))
                )}
            </Card>
        </Grid>
    );
};
