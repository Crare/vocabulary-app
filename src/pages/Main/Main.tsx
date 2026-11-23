import "./Main.css";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { BOTTOM_NAV_HEIGHT, NavView, PHONE_NAV_QUERY } from "./navConfig";

import { SettingsView } from "../Settings/SettingsView";
import { lazy, Suspense, useState } from "react";
import {
  TestResults,
  TestSettings,
  TestWord,
  PartitionContext,
} from "../Testing/types";
import { ViewErrorBoundary } from "../../components/ViewErrorBoundary";
import { saveTestResult } from "../../util/historyStorage";
import { createLogger } from "../../util/logger";
import { useSound } from "../../SoundContext";
import { trackEvent, trackPageView } from "../../util/analytics";
import { useEffect } from "react";

const log = createLogger("main");

// Only the landing view (Word lists) is in the first download. The others
// load on first use — charts (recharts) are only needed on Results/History.
const TestConfigView = lazy(() =>
  import("../Settings/TestConfigView").then((m) => ({ default: m.TestConfigView })),
);
const TestingView = lazy(() =>
  import("../Testing/TestingView").then((m) => ({ default: m.TestingView })),
);
const ResultsView = lazy(() =>
  import("../Results/ResultsView").then((m) => ({ default: m.ResultsView })),
);
const HistoryView = lazy(() =>
  import("../History/HistoryView").then((m) => ({ default: m.HistoryView })),
);
const CreditsView = lazy(() =>
  import("../Credits/CreditsView").then((m) => ({ default: m.CreditsView })),
);

const ViewFallback = () => (
  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
    <CircularProgress aria-label="Loading" />
  </Box>
);

const Main = () => {
  const { onStart } = useSound();
  const isPhone = useMediaQuery(PHONE_NAV_QUERY);
  const [view, setView] = useState<
    "wordlists" | "settings" | "testing" | "results" | "history" | "credits"
  >("wordlists");
  const [settings, setSettings] = useState<TestSettings | undefined>(undefined);
  const [results, setResults] = useState<TestResults | undefined>(undefined);
  const [partitionCtx, setPartitionCtx] = useState<PartitionContext | null>(
    null,
  );

  // Track page views
  useEffect(() => {
    trackPageView(view);
    trackEvent("page_view", { page: view });
  }, [view]);

  const startTest = (
    testSettings: TestSettings,
    partition?: PartitionContext,
  ) => {
    log.info("test_started", {
      wordCount: testSettings.languageSet.language1Words.length,
      languageSet: testSettings.languageSet.name,
      testType: testSettings.testType,
      correctTimesNeeded: testSettings.wordNeedsToGetCorrectTimes,
      multiSelectChoices: testSettings.multiSelectChoicesAmount,
      onlySecondLang: testSettings.onlySecondLanguageWordsTested,
      alternating: testSettings.everySecondTestIsMultiOrWriting,
    });
    onStart();
    setSettings(testSettings);
    setPartitionCtx(partition ?? null);
    setView("testing");
  };

  const endTesting = (testResults: TestResults) => {
    const totalWords = testResults.wordResults.length;
    const perfect = testResults.wordResults.filter(
      (w) =>
        w.timesFailed === 0 &&
        (w.timesSkipped ?? 0) === 0 &&
        w.timesCheckedAnswer === 0,
    ).length;
    log.info("test_ended", {
      timeTaken: testResults.timeTaken,
      totalWords,
      perfectWords: perfect,
      score: testResults.score,
      languageSet: settings?.languageSet.name,
    });
    if (settings) saveTestResult(testResults, settings);
    setResults(testResults);
    setView("results");
  };

  const backToStart = () => {
    setView("wordlists");
    setResults(undefined);
    setPartitionCtx(null);
  };

  const retryPart = () => {
    if (!settings) return;
    log.info("retry_part", {
      partIndex: partitionCtx?.partIndex ?? 0,
      wordCount: settings.languageSet.language1Words.length,
    });
    setResults(undefined);
    onStart();
    setView("testing");
  };

  const nextPart = () => {
    if (!partitionCtx || !settings) return;
    const { fullLanguageSet, totalParts, partIndex, partSize } = partitionCtx;
    const nextPartIndex = partIndex + 1;
    const start = nextPartIndex * partSize;
    const end = Math.min(
      start + partSize,
      fullLanguageSet.language1Words.length,
    );
    log.info("next_part", { partIndex: nextPartIndex, start, end, totalParts });
    const slicedSettings: TestSettings = {
      ...settings,
      languageSet: {
        ...fullLanguageSet,
        language1Words: fullLanguageSet.language1Words.slice(start, end),
        language2Words: fullLanguageSet.language2Words.slice(start, end),
        language1Sentences: fullLanguageSet.language1Sentences?.slice(
          start,
          end,
        ),
        language2Sentences: fullLanguageSet.language2Sentences?.slice(
          start,
          end,
        ),
        hints: fullLanguageSet.hints?.slice(start, end),
      },
    };
    startTest(slicedSettings, { ...partitionCtx, partIndex: nextPartIndex });
  };

  const retestWords = (words: TestWord[]) => {
    if (!settings) {
      log.warn("retest_no_settings", { wordCount: words.length });
      return;
    }
    log.info("retest_started", {
      wordCount: words.length,
      languageSet: settings.languageSet.name,
    });
    const newSettings: TestSettings = {
      ...settings,
      languageSet: {
        ...settings.languageSet,
        language1Words: words.map((w) => w.lang1Word),
        language2Words: words.map((w) => w.lang2Word),
        hints: words.map((w) => w.hint ?? ""),
      },
    };
    setResults(undefined);
    startTest(newSettings);
  };

  const activeTab: NavView | null =
    view === "wordlists" ||
    view === "settings" ||
    view === "history" ||
    view === "credits"
      ? view
      : null;

  const onNavigate = (target: NavView) => {
    log.debug("view_changed", { from: view, to: target });
    setView(target);
    setResults(undefined);
  };

  const showBottomNav = isPhone && view !== "testing";
  // Pages with their own sticky bottom bar sit on top of the tab bar via this variable.
  const bottomNavHeight = showBottomNav
    ? `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`
    : "0px";

  return (
    <Grid
      container
      className="container"
      justifyContent={"center"}
      style={{ "--bottom-nav-height": bottomNavHeight } as React.CSSProperties}
    >
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Grid size={12}>
        <Header
          activeTab={activeTab}
          onNavigate={onNavigate}
          disabled={view === "testing"}
        />
      </Grid>
      <Grid
        id="main-content"
        component="main"
        role="main"
        p={2}
        flexDirection={"row"}
        size={
          view === "results" || view === "history" || view === "wordlists"
            ? 12
            : { xs: 12, lg: 8 }
        }
        justifyContent={"center"}
        height={"100%"}
      >
        <ViewErrorBoundary key={view}>
        <Suspense fallback={<ViewFallback />}>
        {view === "wordlists" ? (
          <SettingsView
            onStartTest={startTest}
            onOpenTestSettings={() => onNavigate("settings")}
          />
        ) : null}
        {view === "settings" ? <TestConfigView /> : null}
        {view === "testing" && settings ? (
          <TestingView
            settings={settings}
            onEndTesting={endTesting}
            onBackToStart={backToStart}
          />
        ) : null}
        {view === "results" && results ? (
          <ResultsView
            results={results}
            languageSetName={settings?.languageSet.name ?? ""}
            onBackToStart={backToStart}
            onRetestWords={retestWords}
            onRetryPart={partitionCtx ? retryPart : undefined}
            onNextPart={
              partitionCtx &&
              partitionCtx.partIndex + 1 < partitionCtx.totalParts
                ? nextPart
                : undefined
            }
            partitionInfo={
              partitionCtx
                ? {
                    partIndex: partitionCtx.partIndex,
                    totalParts: partitionCtx.totalParts,
                  }
                : undefined
            }
          />
        ) : null}
        {view === "history" ? (
          <HistoryView onGoToWordLists={() => onNavigate("wordlists")} />
        ) : null}
        {view === "credits" ? <CreditsView /> : null}
        </Suspense>
        </ViewErrorBoundary>
      </Grid>
      {showBottomNav && (
        <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
      )}
    </Grid>
  );
};

export default Main;
