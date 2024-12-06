import { Grid, Typography } from "@mui/material";
import { TestResults } from "./types";

interface ResultsViewProps {
  results: TestResults;
}

export const ResultsView = (props: ResultsViewProps) => {
  const { results } = props;
  return (
    <Grid>
      <Typography>ResultsView</Typography>
    </Grid>
  );
};
