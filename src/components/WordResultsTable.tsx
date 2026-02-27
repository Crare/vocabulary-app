import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import {
  calculateScore,
  calculatePercentage,
  calculateAvgAnswerTime,
  formatSeconds,
} from "../pages/Results/resultUtils";
import { TestWord } from "../pages/Testing/types";
import { alpha } from "../colors";

/** Full columns used in the results view (with Checked & Skipped) */
const resultsColumns: GridColDef[] = [
  { field: "lang1Word", headerName: "Language 1", flex: 1, minWidth: 120 },
  { field: "lang2Word", headerName: "Language 2", flex: 1, minWidth: 120 },
  { field: "timesCorrect", headerName: "Correct", flex: 0.7, minWidth: 120 },
  { field: "timesFailed", headerName: "Wrong", flex: 0.7, minWidth: 120 },
  {
    field: "timesCheckedAnswer",
    headerName: "Checked",
    flex: 0.7,
    minWidth: 120,
  },
  { field: "timesSkipped", headerName: "Skipped", flex: 0.7, minWidth: 120 },
  {
    field: "avgTime",
    headerName: "Avg Time",
    flex: 0.7,
    minWidth: 120,
    valueGetter: (_value, row) => calculateAvgAnswerTime(row),
    valueFormatter: (value: number) => (value > 0 ? formatSeconds(value) : "-"),
  },
  {
    field: "score",
    headerName: "Score",
    flex: 0.6,
    minWidth: 120,
    valueGetter: (_value, row) => calculateScore(row),
  },
  {
    field: "percentage",
    headerName: "Accuracy",
    flex: 1,
    minWidth: 120,
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
            <MoodIcon sx={{ color: "success.main", fontSize: 20 }} />
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

/** Compact columns used in the history view */
const historyColumns: GridColDef[] = [
  { field: "lang1Word", headerName: "Language 1", flex: 1, minWidth: 120 },
  { field: "lang2Word", headerName: "Language 2", flex: 1, minWidth: 120 },
  { field: "timesCorrect", headerName: "Correct", flex: 0.6, minWidth: 120 },
  { field: "timesFailed", headerName: "Wrong", flex: 0.6, minWidth: 120 },
  {
    field: "score",
    headerName: "Score",
    flex: 0.6,
    minWidth: 120,
    valueGetter: (_value, row: TestWord) => calculateScore(row),
  },
  {
    field: "percentage",
    headerName: "Accuracy",
    flex: 0.7,
    minWidth: 120,
    valueGetter: (_value, row: TestWord) => `${calculatePercentage(row)}%`,
  },
  {
    field: "avgTime",
    headerName: "Avg Time",
    flex: 0.7,
    minWidth: 120,
    valueGetter: (_value, row: TestWord) => calculateAvgAnswerTime(row),
    valueFormatter: (value: number) => (value > 0 ? formatSeconds(value) : "-"),
  },
];

interface WordResultsTableProps {
  wordResults: TestWord[];
  /** "results" shows full columns + checkbox selection; "history" shows compact columns */
  variant: "results" | "history";
  /** Controlled selection model (results variant only) */
  rowSelection?: GridRowSelectionModel;
  onRowSelectionChange?: (model: GridRowSelectionModel) => void;
}

export const WordResultsTable = ({
  wordResults,
  variant,
  rowSelection,
  onRowSelectionChange,
}: WordResultsTableProps) => {
  const isResults = variant === "results";
  const columns = isResults ? resultsColumns : historyColumns;

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Box sx={{ minWidth: isResults ? 850 : 600 }}>
        <DataGrid
          rows={wordResults}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: isResults ? 20 : 10,
              },
            },
          }}
          pageSizeOptions={isResults ? [5, 10, 20] : [10, 20]}
          checkboxSelection={isResults}
          rowSelectionModel={isResults ? rowSelection : undefined}
          onRowSelectionModelChange={
            isResults ? onRowSelectionChange : undefined
          }
          density={isResults ? "standard" : "compact"}
          hideFooterSelectedRowCount={!isResults}
          sx={{
            border: `1px solid ${alpha.slate15}`,
            borderRadius: isResults ? 3 : 2,
            ...(isResults ? {} : { mb: 1.5 }),
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha.primary04,
            },
            ...(isResults
              ? {
                  "& .MuiDataGrid-cell": {
                    borderColor: alpha.slate10,
                  },
                }
              : {}),
          }}
        />
      </Box>
    </Box>
  );
};
