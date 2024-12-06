import { Button, Card, Grid, Typography } from "@mui/material";
import { LanguageSet, TestSettings, TestWord } from "./types";
import { useEffect, useState } from "react";
import { useDate } from "../../hooks/useDate";

interface TestingViewProps {
  settings: TestSettings;
}

export const TestingView = (props: TestingViewProps) => {
  const { settings } = props;

  const [testWords, setTestWords] = useState<TestWord[] | undefined>(undefined);
  const [wordsLeft, setWordsLeft] = useState<number>(-1);

  const { date, time, timeTaken } = useDate();

  useEffect(() => {
    var words = settings.languageSet.language1Words.map((lang1Word, index) => {
      return {
        lang1Word: lang1Word,
        lang2Word: settings.languageSet.language2Words[index],
        timesCorrect: 0,
        timesFailed: 0,
        timesCheckedAnswer: 0,
      };
    });
    setTestWords(words);
    setWordsLeft(words.length);
  }, [settings]);

  return (
    <Grid
      container
      className="content"
      xs={12}
      gap={2}
      flexDirection={"column"}
    >
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
            <Typography>Time taken: {timeTaken}</Typography>
          </Grid>
        </Grid>

        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          <Grid item xs={12} ml={6}>
            {/* <Button type="button" variant="contained" onClick={useExample}>
              Use example
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              type="button"
              variant="contained"
              onClick={clear}
            >
              clear
            </Button> */}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
