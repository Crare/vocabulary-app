import { Box, Button, Card, Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { TestResults, TestWord } from "../Testing/types";
import {
    calculateScore,
    calculatePercentage,
    calculateAvgAnswerTime,
    formatSeconds,
    calculateOverallAvgTime,
} from "./resultUtils";
import MoodIcon from "@mui/icons-material/Mood";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState, useMemo } from "react";
import { loadHistory } from "../../util/historyStorage";
import { ProgressChart } from "../../components/ProgressChart";
import { WordScoreChart } from "../../components/WordScoreChart";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ReplayIcon from "@mui/icons-material/Replay";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { alpha } from "../../colors";

const columns: GridColDef[] = [
    { field: "lang1Word", headerName: "Language 1", flex: 1 },
    { field: "lang2Word", headerName: "Language 2", flex: 1 },
    { field: "timesCorrect", headerName: "Correct", flex: 0.7 },
    { field: "timesFailed", headerName: "Wrong", flex: 0.7 },
    {
        field: "timesCheckedAnswer",
        headerName: "Checked",
        flex: 0.7,
    },
    {
        field: "timesSkipped",
        headerName: "Skipped",
        flex: 0.7,
    },
    {
        field: "avgTime",
        headerName: "Avg Time",
        flex: 0.7,
        valueGetter: (_value, row) => calculateAvgAnswerTime(row),
        valueFormatter: (value: number) =>
            value > 0 ? formatSeconds(value) : "-",
    },
    {
        field: "score",
        headerName: "Score",
        flex: 0.6,
        valueGetter: (_value, row) => calculateScore(row),
    },
    {
        field: "percentage",
        headerName: "Accuracy",
        flex: 1,
        valueGetter: (_value, row) => calculatePercentage(row),
        renderCell(params) {
            const value = params.value as number;
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        height: "100%",
                    }}
                >
                    <Typography variant="body2" fontWeight={600}>
                        {value}%
                    </Typography>
                    {value > 85 ? (
                        <MoodIcon
                            sx={{ color: "success.main", fontSize: 20 }}
                        />
                    ) : value > 60 ? (
                        <SentimentSatisfiedIcon
                            sx={{ color: "secondary.main", fontSize: 20 }}
                        />
                    ) : (
                        <SentimentVeryDissatisfiedIcon
                            sx={{ color: "error.main", fontSize: 20 }}
                        />
                    )}
                </Box>
            );
        },
    },
];

interface ResultsViewProps {
    results: TestResults;
    languageSetName: string;
    onBackToStart: () => void;
    onRetestWords: (words: TestWord[]) => void;
}

export const ResultsView = (props: ResultsViewProps) => {
    const { results, languageSetName, onBackToStart, onRetestWords } = props;

    const historyEntries = useMemo(
        () =>
            loadHistory().filter((e) => e.languageSetName === languageSetName),
        [languageSetName],
    );

    const paginationModel = { page: 0, pageSize: 20 };
    const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>({
        type: "include",
        ids: new Set(),
    });

    const selectedWords = results.wordResults.filter((w) =>
        rowSelection.type === "include"
            ? rowSelection.ids.has(w.id)
            : !rowSelection.ids.has(w.id),
    );

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h3" mb={3} textAlign={"center"}>
                    Results
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        mb: 3,
                        flexWrap: "wrap",
                    }}
                >
                    <Chip
                        icon={<FormatListNumberedIcon />}
                        label={`${results.wordResults.length} words`}
                        variant="outlined"
                    />
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={results.timeTaken}
                        variant="outlined"
                    />
                    <Chip
                        icon={<AvTimerIcon />}
                        label={`Avg ${formatSeconds(calculateOverallAvgTime(results.wordResults))}/answer`}
                        variant="outlined"
                    />
                </Box>

                <DataGrid
                    rows={results.wordResults}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    rowSelectionModel={rowSelection}
                    onRowSelectionModelChange={setRowSelection}
                    sx={{
                        border: `1px solid ${alpha.slate15}`,
                        borderRadius: 3,
                        "& .MuiDataGrid-columnHeaders": {
                            bgcolor: alpha.primary04,
                        },
                        "& .MuiDataGrid-cell": {
                            borderColor: alpha.slate10,
                        },
                    }}
                />
            </Card>

            <Card sx={{ p: 3 }}>
                <WordScoreChart wordResults={results.wordResults} />
            </Card>

            {historyEntries.length >= 2 && (
                <Card sx={{ p: 3 }}>
                    <Typography variant="h5" mb={1}>
                        Progress for &ldquo;{languageSetName}&rdquo;
                    </Typography>
                    <ProgressChart entries={historyEntries} />
                </Card>
            )}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                {/* {selectedWords.length > 0 && ( */}
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={selectedWords.length <= 1}
                    onClick={() => onRetestWords(selectedWords)}
                    startIcon={<RefreshIcon />}
                    size="large"
                    sx={{ px: 5, py: 1.5 }}
                >
                    Test selected ({selectedWords.length})
                </Button>
                {/* )} */}
                <Button
                    variant="contained"
                    onClick={onBackToStart}
                    startIcon={<ReplayIcon />}
                    size="large"
                    sx={{ px: 5, py: 1.5 }}
                >
                    Back to start
                </Button>
            </Box>
        </Grid>
    );
};
