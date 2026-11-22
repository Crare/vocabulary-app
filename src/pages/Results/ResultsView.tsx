import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TestResults, TestWord } from "../Testing/types";
import { loadHistory } from "../../util/historyStorage";
import { createLogger } from "../../util/logger";
import { ProgressChart } from "../../components/ProgressChart";
import { SentenceTrainingResults } from "../../components/SentenceTrainingResults";
import {
  calculateOverallAvgTime,
  calculateTotalScore,
  formatSeconds,
} from "./resultUtils";
import { accuracyChange, splitByMistakes, testAccuracy } from "./resultsSummary";
import { ScoreCard } from "./ScoreCard";
import { ResultWordList } from "./ResultWordList";
import { ResultsActions } from "./ResultsActions";
import { surfaceSx } from "./styles";

const log = createLogger("results");

interface ResultsViewProps {
  results: TestResults;
  languageSetName: string;
  onBackToStart: () => void;
  onRetestWords: (words: TestWord[]) => void;
  onRetryPart?: () => void;
  onNextPart?: () => void;
  partitionInfo?: { partIndex: number; totalParts: number };
}

const sectionTitleSx = { fontSize: "1rem", fontWeight: 700 } as const;

export const ResultsView = (props: ResultsViewProps) => {
  const {
    results,
    languageSetName,
    onBackToStart,
    onRetestWords,
    onRetryPart,
    onNextPart,
    partitionInfo,
  } = props;
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"), {
    noSsr: true,
  });

  const words = results.wordResults;
  const { mistakes, right } = useMemo(() => splitByMistakes(words), [words]);
  const historyEntries = useMemo(
    () => loadHistory().filter((e) => e.languageSetName === languageSetName),
    [languageSetName],
  );

  // Mistakes start ticked so the main action is one tap away.
  const [selected, setSelected] = useState<ReadonlySet<number>>(
    () => new Set(mistakes.map((w) => w.id)),
  );
  const [rightOpen, setRightOpen] = useState(false);

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allMistakesTicked = mistakes.every((w) => selected.has(w.id));
  const toggleAllMistakes = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      for (const w of mistakes) {
        if (allMistakesTicked) next.delete(w.id);
        else next.add(w.id);
      }
      return next;
    });

  const retestSelected = () => {
    const chosen = words.filter((w) => selected.has(w.id));
    log.info("retest_selected", {
      wordCount: chosen.length,
      mistakes: chosen.filter((w) => mistakes.includes(w)).length,
    });
    onRetestWords(chosen);
  };

  const { correct, total } = calculateTotalScore(words);
  const accuracy = testAccuracy(words);
  const partLabel = partitionInfo
    ? `Part ${partitionInfo.partIndex + 1} of ${partitionInfo.totalParts}`
    : null;
  const eyebrow = [partLabel, languageSetName].filter(Boolean).join(" · ");
  const nextPartLabel = partitionInfo
    ? `${partitionInfo.partIndex + 2} of ${partitionInfo.totalParts}`
    : undefined;

  const actions = (variant: "bar" | "card") => (
    <ResultsActions
      variant={variant}
      selectedCount={selected.size}
      onRetestSelected={retestSelected}
      onBackToStart={onBackToStart}
      onRetryPart={onRetryPart}
      onNextPart={onNextPart}
      nextPartLabel={nextPartLabel}
    />
  );

  const progress = historyEntries.length >= 2 && (
    <Box
      component="section"
      aria-labelledby="progress-title"
      sx={[surfaceSx, { p: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 0.5 }]}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
        <Typography id="progress-title" component="h2" sx={sectionTitleSx}>
          Accuracy over time
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          last {Math.min(historyEntries.length, 10)} tests
        </Typography>
      </Box>
      <ProgressChart entries={historyEntries} />
    </Box>
  );

  const sentences = (
    <SentenceTrainingResults
      wordResults={words}
      accordionSx={{ borderRadius: "16px !important", boxShadow: "none" }}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 340px" },
        gap: { xs: "14px", md: 3 },
        alignItems: "start",
        pb: { xs: "calc(150px + var(--bottom-nav-height, 0px))", md: 0 },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "14px", md: 2 }, minWidth: 0 }}>
        <ScoreCard
          accuracy={accuracy}
          correct={correct}
          total={total}
          change={accuracyChange(historyEntries)}
          perfectWords={right.length}
          wordCount={words.length}
          timeTaken={results.timeTaken}
          perAnswer={formatSeconds(calculateOverallAvgTime(words))}
          eyebrow={eyebrow}
        />

        {mistakes.length > 0 && (
          <Box component="section" aria-labelledby="mistakes-title" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography id="mistakes-title" component="h2" sx={sectionTitleSx}>
                To practise{" "}
                <Box component="span" sx={{ fontWeight: 500, color: "text.secondary" }}>
                  · {mistakes.length}
                </Box>
              </Typography>
              <Button onClick={toggleAllMistakes} sx={{ minHeight: 44, fontWeight: 600 }}>
                {allMistakesTicked ? "Clear" : "Select all"}
              </Button>
            </Box>
            <Box sx={[surfaceSx, { overflow: "hidden" }]}>
              <ResultWordList words={mistakes} selected={selected} onToggle={toggle} density="detailed" />
            </Box>
          </Box>
        )}

        {right.length > 0 && (
          <Box component="section" sx={[surfaceSx, { overflow: "hidden" }]}>
            <Button
              fullWidth
              onClick={() => setRightOpen((o) => !o)}
              aria-expanded={rightOpen}
              aria-controls="right-words"
              endIcon={
                <ExpandMoreIcon
                  sx={{ transform: rightOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
                />
              }
              sx={{ height: 52, px: "14px", justifyContent: "space-between", fontWeight: 600, borderRadius: 0 }}
            >
              <span>
                {mistakes.length > 0 ? "Got right" : "All words"}{" "}
                <Box component="span" sx={{ fontWeight: 500, color: "text.secondary" }}>
                  · {right.length} {right.length === 1 ? "word" : "words"}
                </Box>
              </span>
            </Button>
            <Collapse in={rightOpen} id="right-words">
              <Box sx={(theme) => ({ borderTop: `1px solid ${theme.palette.divider}` })}>
                <ResultWordList words={right} selected={selected} onToggle={toggle} density="compact" />
              </Box>
            </Collapse>
          </Box>
        )}

        {!isDesktop && progress}
        {!isDesktop && sentences}
      </Box>

      {isDesktop ? (
        <Box
          component="aside"
          sx={{ display: "flex", flexDirection: "column", gap: 2, position: "sticky", top: 16 }}
        >
          {actions("card")}
          {progress}
          {sentences}
        </Box>
      ) : (
        actions("bar")
      )}
    </Box>
  );
};
