import "./Main.css";
import { Grid } from "@mui/material";
import { Header, NavView } from "./Header";

import { SettingsView } from "../Settings/SettingsView";
import { TestConfigView } from "../Settings/TestConfigView";
import { useState } from "react";
import { TestingView } from "../Testing/TestingView";
import { ResultsView } from "../Results/ResultsView";
import { HistoryView } from "../History/HistoryView";
import { CreditsView } from "../Credits/CreditsView";
import {
  TestResults,
  TestSettings,
  TestWord,
  PartitionContext,
} from "../Testing/types";
import { saveTestResult } from "../../util/historyStorage";
import { createLogger } from "../../util/logger";
import { useSound } from "../../SoundContext";
import { trackEvent, trackPageView } from "../../util/analytics";
import { useEffect } from "react";

const log = createLogger("main");

const Main = () => {
  const { onStart } = useSound();
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
        w.timesSkipped === 0 &&
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

  return (
    <Grid container className="container" justifyContent={"center"}>
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
        size={view === "results" || view === "history" ? 12 : { xs: 12, lg: 8 }}
        justifyContent={"center"}
        height={"100%"}
      >
        {view === "wordlists" ? <SettingsView onStartTest={startTest} /> : null}
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
        {view === "history" ? <HistoryView /> : null}
        {view === "credits" ? <CreditsView /> : null}
      </Grid>
    </Grid>
  );
};

export default Main;
