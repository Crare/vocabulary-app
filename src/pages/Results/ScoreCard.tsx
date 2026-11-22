import { Box, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { surfaceSx, statTileSx } from "./styles";
import { scoreHeadline } from "./resultsSummary";

interface ScoreCardProps {
  /** Accuracy of this test, 0–100. */
  accuracy: number;
  correct: number;
  total: number;
  /** Change from the previous test of this list, in points; null for the first test. */
  change: number | null;
  perfectWords: number;
  wordCount: number;
  timeTaken: string;
  /** Average seconds per answer, already formatted (e.g. "2.1s"). */
  perAnswer: string;
  /** "Part 1 of 2 · verbs" style line, or the list name alone. */
  eyebrow: string;
}

const Stat = ({ value, label }: { value: string; label: string }) => (
  <Box sx={statTileSx}>
    <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
  </Box>
);

const ChangeLine = ({ change }: { change: number | null }) => {
  if (change === null) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        First test of these words
      </Typography>
    );
  }
  if (change === 0) {
    return (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Same as last time
      </Typography>
    );
  }
  const up = change > 0;
  const Icon = up ? ArrowUpwardIcon : ArrowDownwardIcon;
  const points = Math.abs(change);
  return (
    <Typography
      variant="body2"
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}
    >
      <Icon
        aria-hidden
        sx={{ fontSize: 16, color: up ? "success.dark" : "error.main" }}
      />
      {points} {points === 1 ? "point" : "points"} {up ? "up" : "down"} from
      last time
    </Typography>
  );
};

/** The score first: accuracy, change from last time and three supporting numbers. */
export const ScoreCard = (props: ScoreCardProps) => {
  const {
    accuracy,
    correct,
    total,
    change,
    perfectWords,
    wordCount,
    timeTaken,
    perAnswer,
    eyebrow,
  } = props;

  return (
    <Box
      component="section"
      aria-labelledby="score-title"
      sx={[
        surfaceSx,
        {
          p: { xs: "18px 16px 16px", md: "22px 24px" },
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
        },
      ]}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "text.secondary",
            overflowWrap: "anywhere",
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          id="score-title"
          component="h1"
          sx={{ fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 700 }}
        >
          {scoreHeadline(accuracy)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
        <Typography
          sx={{
            fontSize: { xs: "3.5rem", md: "4rem" },
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {accuracy}%
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pb: 0.5 }}>
          <ChangeLine change={change} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {correct} of {total} answers right
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        <Stat value={`${perfectWords} / ${wordCount}`} label="words perfect" />
        <Stat value={timeTaken || "–"} label="total time" />
        <Stat value={perAnswer} label="per answer" />
      </Box>
    </Box>
  );
};
