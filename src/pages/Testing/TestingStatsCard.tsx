import { Box, LinearProgress, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TestSettings, TestWord } from "./types";
import { TimeTaken } from "../../components/TimeTaken";
import { alpha } from "../../colors";

interface TestingStatsCardProps {
  settings: TestSettings;
  testWords: TestWord[];
}

/** Progress counted the way the test decides a word is done. */
const wordProgress = (w: TestWord, settings: TestSettings) =>
  settings.progressOnMistakes ? w.timesCorrect + w.timesFailed : w.timesCorrect;

/** How many words are fully learned in this test. */
export const countLearned = (testWords: TestWord[], settings: TestSettings) =>
  testWords.filter(
    (w) => wordProgress(w, settings) >= settings.wordNeedsToGetCorrectTimes,
  ).length;

/** Slim progress line: words learned, words left, elapsed time. */
export const TestingStatsCard = ({
  settings,
  testWords,
}: TestingStatsCardProps) => {
  const needed = settings.wordNeedsToGetCorrectTimes;
  const totalNeeded = testWords.length * needed;
  const totalDone = testWords.reduce(
    (sum, w) => sum + Math.min(wordProgress(w, settings), needed),
    0,
  );
  const progress = totalNeeded > 0 ? (totalDone / totalNeeded) * 100 : 0;
  const learned = countLearned(testWords, settings);
  const left = testWords.length - learned;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <Box component="strong" sx={{ color: "text.primary" }}>
            {learned}
          </Box>{" "}
          of {testWords.length} learned
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          {left} left ·
          <AccessTimeIcon sx={{ fontSize: 16 }} aria-hidden="true" />
          <TimeTaken />
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        aria-label="Test progress"
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: alpha.primary10,
          "& .MuiLinearProgress-bar": { borderRadius: 4 },
        }}
      />
    </Box>
  );
};
