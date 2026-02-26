import {
    Box,
    Button,
    Card,
    Grid,
    Tooltip,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { TestResults, TestWord } from "../Testing/types";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState, useMemo } from "react";
import { loadHistory } from "../../util/historyStorage";
import { ProgressChart } from "../../components/ProgressChart";
import { WordScoreChart } from "../../components/WordScoreChart";
import { WordResultsTable } from "../../components/WordResultsTable";
import { TestSummaryChips } from "../../components/TestSummaryChips";
import { SentenceTrainingResults } from "../../components/SentenceTrainingResults";
import ReplayIcon from "@mui/icons-material/Replay";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
                        mb: 3,
                    }}
                >
                    <TestSummaryChips
                        wordResults={results.wordResults}
                        timeTaken={results.timeTaken}
                    />
                </Box>

                <WordResultsTable
                    wordResults={results.wordResults}
                    variant="results"
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </Card>

            <Accordion
                defaultExpanded={false}
                sx={{ borderRadius: 3, "&:before": { display: "none" } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BarChartIcon color="primary" />
                        <Typography variant="h5">Charts</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <WordScoreChart wordResults={results.wordResults} />

                    {historyEntries.length >= 2 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h5" mb={1}>
                                Progress for &ldquo;{languageSetName}&rdquo;
                            </Typography>
                            <ProgressChart entries={historyEntries} />
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            <SentenceTrainingResults wordResults={results.wordResults} />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Tooltip
                    title="Re-test only the words you selected in the table above"
                    arrow
                >
                    <span>
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
                    </span>
                </Tooltip>
                <Tooltip title="Return to the word list setup screen" arrow>
                    <Button
                        variant="contained"
                        onClick={onBackToStart}
                        startIcon={<ReplayIcon />}
                        size="large"
                        sx={{ px: 5, py: 1.5 }}
                    >
                        Back to start
                    </Button>
                </Tooltip>
            </Box>
        </Grid>
    );
};
