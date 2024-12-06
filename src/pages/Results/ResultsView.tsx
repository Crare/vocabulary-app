import { Card, Grid, Typography } from "@mui/material";
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
  // { field: 'lastName', headerName: 'score' },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 90,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

interface ResultsViewProps {
  results: TestResults;
}

export const ResultsView = (props: ResultsViewProps) => {
  const { results } = props;

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <Grid
      container
      className="content"
      xs={12}
      gap={2}
      flexDirection={"column"}
    >
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

            {/* <Table>
              <TableHead>
                <TableRow>
                  <TableCell>word in lang 1</TableCell>
                  <TableCell>word in lang 2</TableCell>
                  <TableCell>correct</TableCell>
                  <TableCell>wrong</TableCell>
                  <TableCell>checked answer</TableCell>
                  <TableCell>score</TableCell>
                </TableRow>
              </TableHead>
              {results.wordResults.map((word, index) => {
                return (
                  <TableBody key={index}>
                    <TableRow>
                      <TableCell>{word.lang1Word}</TableCell>
                      <TableCell>{word.lang2Word}</TableCell>
                      <TableCell>{word.timesCorrect}</TableCell>
                      <TableCell>{word.timesFailed}</TableCell>
                      <TableCell>{word.timesCheckedAnswer}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table> */}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
