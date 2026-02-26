import { Button, Card, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TestResults, TestWord } from "../Testing/types";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const calculateScore = (word: TestWord): string => {
    var score =
        word.timesCorrect -
        word.timesFailed -
        word.timesSkipped -
        word.timesCheckedAnswer;
    return score.toString();
};

const calculatePercentage = (word: TestWord): number => {
    var wrongTimes =
        word.timesCheckedAnswer + word.timesFailed + word.timesSkipped;
    var rightTimes = word.timesCorrect;
    var total = wrongTimes + rightTimes;
    return (rightTimes / total) * 100;
};

const columns: GridColDef[] = [
    { field: "lang1Word", headerName: "language 1", flex: 1 },
    { field: "lang2Word", headerName: "language 2", flex: 1 },
    { field: "timesCorrect", headerName: "correct", flex: 1 },
    { field: "timesFailed", headerName: "wrong", flex: 1 },
    {
        field: "timesCheckedAnswer",
        headerName: "checked answer",
        flex: 1,
    },
    {
        field: "timesSkipped",
        headerName: "times skipped",
        flex: 1,
    },
    {
        field: "score",
        headerName: "score",
        flex: 1,
        valueGetter: (_value, row) => calculateScore(row),
        renderCell(params) {
            return <Typography>{params.value}</Typography>;
        },
    },
    {
        field: "percentage",
        headerName: "percentage",
        flex: 1,
        valueGetter: (_value, row) => calculatePercentage(row),
        renderCell(params) {
            return (
                <Grid
                    container
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Typography>{params.value}%</Typography>
                    {params.value > 85 ? (
                        <MoodIcon htmlColor="green" />
                    ) : params.value > 60 ? (
                        <SentimentSatisfiedIcon htmlColor="orange" />
                    ) : (
                        <SentimentVeryDissatisfiedIcon htmlColor="red" />
                    )}
                </Grid>
            );
        },
    },
];

interface ResultsViewProps {
    results: TestResults;
    onBackToStart: () => void;
}

export const ResultsView = (props: ResultsViewProps) => {
    const { results, onBackToStart } = props;

    const paginationModel = { page: 0, pageSize: 20 };

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <Card style={{ padding: 20 }}>
                <Typography variant="h3" m={2} textAlign={"center"}>
                    Results
                </Typography>

                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                >
                    <Grid size={12} ml={6}>
                        <Typography>
                            Started: {results.date.toLocaleDateString()}
                        </Typography>
                        <Typography>
                            words: {results.wordResults.length}
                        </Typography>
                        <Typography>Time taken: {results.timeTaken}</Typography>
                    </Grid>
                    <Grid size={12} ml={6}>
                        <DataGrid
                            rows={results.wordResults}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Grid>
                </Grid>
            </Card>

            <Card style={{ padding: 20 }}>
                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                >
                    <Button
                        color="success"
                        variant="contained"
                        style={{ marginRight: 10 }}
                        onClick={onBackToStart}
                    >
                        Back to start
                    </Button>
                </Grid>
            </Card>
        </Grid>
    );
};
