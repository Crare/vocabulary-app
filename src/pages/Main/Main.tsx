import "./Main.css";
import { Grid } from "@mui/material";
import { Header } from "./Header";

import { SettingsView } from "../Testing/SettingsView";
import { useState } from "react";
import { TestingView } from "../Testing/TestingView";
import { ResultsView } from "../Testing/ResultsView";

const Main = () => {
  const [view, setView] = useState<"settings" | "testing" | "results">(
    "settings"
  );

  const startTest = () => {
    console.log("startTest");
    setView("testing");
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
        {view === "testing" ? <TestingView /> : null}
        {view === "results" ? <ResultsView /> : null}
      </Grid>
    </Grid>
  );
};

export default Main;
