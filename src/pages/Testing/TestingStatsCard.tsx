import { Box, Card, Chip, LinearProgress, Typography } from "@mui/material";
import { TestSettings, TestWord } from "./types";
import { TimeTaken } from "../../components/TimeTaken";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { alpha, gradients } from "../../colors";

interface TestingStatsCardProps {
  settings: TestSettings;
  testWords: TestWord[];
  wordsLeft: number;
}

export const TestingStatsCard = (props: TestingStatsCardProps) => {
  const { settings, testWords, wordsLeft } = props;
  const correctTimesNeeded = settings.wordNeedsToGetCorrectTimes;
  const totalNeeded = testWords.length * correctTimesNeeded;
  const totalCorrect = testWords.reduce((sum, w) => {
    const progress = settings.progressOnMistakes
      ? w.timesCorrect + w.timesFailed
      : w.timesCorrect;
    return sum + Math.min(progress, correctTimesNeeded);
  }, 0);
  const progress = totalNeeded > 0 ? (totalCorrect / totalNeeded) * 100 : 0;

  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="h3">Testing</Typography>
        <Chip
          icon={<AccessTimeIcon />}
          label={<TimeTaken />}
          variant="outlined"
          size="small"
        />
      </Box>
      <Box sx={{ mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Correct: {totalCorrect} / {totalNeeded}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {wordsLeft} words remaining
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label={`Test progress: ${Math.round(progress)}%`}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          sx={{
            height: 20,
            borderRadius: 4,
            bgcolor: "rgba(79, 70, 229, 0.1)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            },
          }}
        />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            position: "relative",
            top: -17,
            textAlign: "center",
            display: "block",
            lineHeight: 1,
            color: progress > 45 ? "#fff" : "text.primary",
            pointerEvents: "none",
          }}
        >
          {wordsLeft} words left
        </Typography>
      </Box>
    </Card>
  );
};
