import "./Main.css";
import { Grid } from "@mui/material";
import { Header } from "./Header";

import { SettingsView } from "../Testing/SettingsView";
import { useState } from "react";
import { TestingView } from "../Testing/TestingView";
import { ResultsView } from "../Testing/ResultsView";
import { TestResults, TestSettings } from "../Testing/types";

const Main = () => {
  const [view, setView] = useState<"settings" | "testing" | "results">(
    "settings"
  );
  const [settings, setSettings] = useState<TestSettings | undefined>(undefined);
  const [results, setResults] = useState<TestResults | undefined>(undefined);

  const startTest = (testSettings: TestSettings) => {
    setSettings(testSettings);
    setView("testing");
  };

  const endTesting = (testResults: TestResults) => {
    setResults(testResults);
    setView("results");
  };

  return (
    <Grid className="container" justifyContent={"center"}>
      <Grid
        container
        p={2}
        flexDirection={"row"}
        xs={12}
        md={8}
        justifyContent={"center"}
        height={"100%"}
      >
        <Header />

        {view === "settings" ? <SettingsView onStartTest={startTest} /> : null}
        {view === "testing" && settings ? (
          <TestingView settings={settings} onEndTesting={endTesting} />
        ) : null}
        {view === "results" && results ? (
          <ResultsView results={results} />
        ) : null}
      </Grid>
    </Grid>
  );
};

export default Main;
