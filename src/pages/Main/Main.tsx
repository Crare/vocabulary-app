import "./Main.css";
import { Grid } from "@mui/material";
import { Header, NavView } from "./Header";

import { SettingsView } from "../Settings/SettingsView";
import { useState } from "react";
import { TestingView } from "../Testing/TestingView";
import { ResultsView } from "../Results/ResultsView";
import { HistoryView } from "../History/HistoryView";
import { TestResults, TestSettings, TestWord } from "../Testing/types";
import { saveTestResult } from "../../util/historyStorage";

const Main = () => {
    const [view, setView] = useState<
        "settings" | "testing" | "results" | "history"
    >("settings");
    const [settings, setSettings] = useState<TestSettings | undefined>(
        undefined,
    );
    const [results, setResults] = useState<TestResults | undefined>(undefined);

    const startTest = (testSettings: TestSettings) => {
        setSettings(testSettings);
        setView("testing");
    };

    const endTesting = (testResults: TestResults) => {
        if (settings) saveTestResult(testResults, settings);
        setResults(testResults);
        setView("results");
    };

    const backToStart = () => {
        setView("settings");
        setResults(undefined);
    };

    const retestWords = (words: TestWord[]) => {
        if (!settings) return;
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
        view === "settings" || view === "history" ? view : null;

    const onNavigate = (target: NavView) => {
        setView(target);
        setResults(undefined);
    };

    return (
        <Grid container className="container" justifyContent={"center"}>
            <Grid
                p={2}
                flexDirection={"row"}
                size={{ xs: 12, md: 8 }}
                justifyContent={"center"}
                height={"100%"}
            >
                <Header activeTab={activeTab} onNavigate={onNavigate} />

                {view === "settings" ? (
                    <SettingsView onStartTest={startTest} />
                ) : null}
                {view === "testing" && settings ? (
                    <TestingView
                        settings={settings}
                        onEndTesting={endTesting}
                    />
                ) : null}
                {view === "results" && results ? (
                    <ResultsView
                        results={results}
                        onBackToStart={backToStart}
                        onRetestWords={retestWords}
                    />
                ) : null}
                {view === "history" ? <HistoryView /> : null}
            </Grid>
        </Grid>
    );
};

export default Main;
