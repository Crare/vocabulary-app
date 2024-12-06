import { Timer } from "@mui/icons-material";
import { Card, Grid, Typography } from "@mui/material";
import { TestSettings } from "./types";

interface TestingStatsCardProps {
  settings: TestSettings;
  wordsLeft: number;
}

export const TestingStatsCard = (props: TestingStatsCardProps) => {
  const { settings, wordsLeft } = props;
  return (
    <Card style={{ padding: 20 }}>
      <Typography variant="h3" m={2} textAlign={"center"}>
        Testing
      </Typography>

      <Grid
        container
        flexDirection={"row"}
        gap={2}
        justifyContent={"space-evenly"}
      >
        <Grid item xs={12} ml={6}>
          <Typography>
            words: {settings.languageSet.language1Words.length}
          </Typography>
          <Typography>words left to get correct: {wordsLeft}</Typography>
          <Typography>
            Time taken: <Timer />
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
