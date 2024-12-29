import { Button, Card, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TestResults, TestWord } from "../Testing/types";

const calculateScore = (word: TestWord): string => {
  var score = word.timesCorrect - word.timesFailed - word.timesCheckedAnswer;
  return score.toString();
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
    field: "score",
    headerName: "score",
    flex: 1,
    valueGetter: (_value, row) => calculateScore(row),
    renderCell(params) {
      return <Typography>{params.value}</Typography>;
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
          <Grid item xs={12} ml={6}>
            <Typography>
              Started: {results.date.toLocaleDateString()}
            </Typography>
            <Typography>words: {results.wordResults.length}</Typography>
            <Typography>Time taken: {results.timeTaken}</Typography>
          </Grid>
          <Grid item xs={12} ml={6}>
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
