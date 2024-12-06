import { Button, Card, Grid, Input, Typography } from "@mui/material";
import { TestOption, TestResults, TestSettings, TestWord } from "./types";
import { useEffect, useState } from "react";
import { Timer } from "../../components/Timer";
import { calcTimeTakenText } from "../../hooks/useDate";

function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

interface TestingViewProps {
  settings: TestSettings;
  onEndTesting: (results: TestResults) => void;
}

export const TestingView = (props: TestingViewProps) => {
  const { settings, onEndTesting } = props;

  const [startTime] = useState<Date>(new Date());

  const [testOption, setTestOption] = useState<TestOption>(
    TestOption.WriteCorrectAnswer
  );

  const [testWords, setTestWords] = useState<TestWord[] | undefined>(undefined);
  const [wordsLeft, setWordsLeft] = useState<number>(-1);

  // console.log("settings", settings);
  // console.log("testWords", testWords);
  // console.log("wordsLeft", wordsLeft);

  const [guessWord, setGuessWord] = useState<TestWord | undefined>(undefined);
  const [multiSelectGuessOptions, setMultiSelectGuessOptions] = useState<
    string[]
  >([]);
  const [guessAnswer, setGuessAnswer] = useState<string>("");

  const setupWords = () => {
    if (!settings) {
      // console.log("here! setupWords()");
      return;
    }
    // console.log("setupWords()");
    // console.log("settings", settings);
    // console.log("testWords", testWords);
    // console.log("wordsLeft", wordsLeft);
    var words = settings.languageSet.language1Words.map((lang1Word, index) => {
      return {
        id: index,
        lang1Word: lang1Word,
        lang2Word: settings.languageSet.language2Words[index],
        timesCorrect: 0,
        timesFailed: 0,
        timesCheckedAnswer: 0,
      };
    });
    // console.log("words", words);
    setTestWords(words);
    setWordsLeft(words.length);
  };
  useEffect(() => {
    setupWords();
  }, [settings]);
  useEffect(() => {
    setupWords();
  }, []);

  const chooseWordForGuessing = () => {
    // console.log("chooseWordForGuessing()");
    if (!testWords) {
      // console.log("HERE! testWords", testWords);
      return;
    }
    let index = randomIntFromInterval(0, testWords!.length - 1);
    let gWord = testWords![index];
    while (gWord.timesCorrect === settings.wordNeedsToGetCorrectTimes) {
      index = randomIntFromInterval(0, testWords!.length - 1);
      gWord = testWords![index];
    }
    // console.log("gWord", gWord);
    setGuessWord(gWord);
  };
  useEffect(() => {
    chooseWordForGuessing();
  }, [testWords]);

  const chooseMultiselectGuessOptions = () => {
    // console.log("chooseMultiselectGuessOptions()");
    var guessOptions: string[] = [];
    guessOptions.push(guessWord?.lang2Word!);

    for (var i = 0; i < settings.multiSelectChoicesAmount - 1; i++) {
      let index = randomIntFromInterval(0, testWords!.length - 1);
      let gWord = testWords![index];
      while (gWord === guessWord) {
        index = randomIntFromInterval(0, testWords!.length - 1);
        gWord = testWords![index];
      }
      guessOptions.push(gWord.lang2Word);
    }

    shuffle(guessOptions);
    setMultiSelectGuessOptions(guessOptions);
  };
  useEffect(() => {
    if (testWords && testWords?.length > 0 && guessWord) {
      chooseMultiselectGuessOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testWords, guessWord]);

  // console.log("guessWord", guessWord);
  // console.log("multiSelectGuessOptions", multiSelectGuessOptions);

  const chooseTestOption = () => {
    let index = randomIntFromInterval(0, 1);
    switch (index) {
      case 0:
        setTestOption(TestOption.WriteCorrectAnswer);
        break;
      case 1:
        setTestOption(TestOption.SelectFromMultiple);
        break;
      default:
        setTestOption(TestOption.WriteCorrectAnswer);
        break;
    }
  };
  useEffect(() => {
    chooseTestOption();
  }, [testWords]);

  const sendAnswer = () => {
    checkAnswer(guessAnswer);
  };

  const chooseOption = (option: string) => {
    checkAnswer(option);
  };

  const [success, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const checkAnswer = (guess: string) => {
    if (!guessWord) {
      return;
    }
    if (guess === guessWord?.lang2Word) {
      // success
      console.log("correct answer!");
      guessWord.timesCorrect += 1;
      setSuccess(true);
    } else {
      // failed
      console.log("wrong answer!");
      guessWord.timesFailed += 1;
      setFailed(true);
    }
    setGuessAnswer("");
  };

  const next = () => {
    chooseWordForGuessing();
    setCorrectAnswerValue(undefined);
  };

  const skip = () => {
    next();
  };

  const [correctAnswerValue, setCorrectAnswerValue] = useState<
    string | undefined
  >(undefined);
  const checkCorrectAnswer = () => {
    if (!guessWord) {
      return;
    }
    guessWord!.timesCheckedAnswer += 1;
    setCorrectAnswerValue(guessWord?.lang2Word!);
  };

  const endTesting = () => {
    if (!testWords) {
      return;
    }
    const results: TestResults = {
      date: new Date(),
      timeTaken: calcTimeTakenText(startTime, new Date()),
      score: 0,
      wordResults: testWords,
    };
    console.log("results", results);
    onEndTesting(results);
  };

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
            <Typography>
              Time taken: <Timer />
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {testOption === TestOption.WriteCorrectAnswer ? (
        // {true ? (
        <Card style={{ padding: 20 }}>
          <Grid
            container
            flexDirection={"row"}
            gap={2}
            justifyContent={"center"}
            mb={2}
          >
            <div style={{ textAlign: "center" }}>
              <Typography variant="body1">Write right answer:</Typography>
              <Typography
                variant="h5"
                style={{ marginTop: 20, fontWeight: "bold" }}
              >
                {guessWord?.lang1Word}
              </Typography>
            </div>
          </Grid>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              gap: 10,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Input
              value={guessAnswer}
              onChange={(e) => setGuessAnswer(e.target.value)}
              placeholder="write your answer..."
            />
            <Button variant="contained" onClick={sendAnswer}>
              Send answer
            </Button>
          </div>
        </Card>
      ) : null}

      {testOption === TestOption.SelectFromMultiple ? (
        // {true ? (
        <Card style={{ padding: 20 }}>
          <Grid
            container
            flexDirection={"row"}
            gap={2}
            justifyContent={"space-evenly"}
            mb={2}
          >
            <div style={{ textAlign: "center" }}>
              <Typography variant="body1">Select right answer:</Typography>
              <Typography
                variant="h5"
                style={{ marginTop: 20, fontWeight: "bold" }}
              >
                {guessWord?.lang1Word}
              </Typography>
            </div>
          </Grid>
          <Grid
            container
            flexDirection={"row"}
            gap={2}
            justifyContent={"space-evenly"}
          >
            {multiSelectGuessOptions.map((option, index) => {
              return (
                <div key={index} style={{ margin: 8 }}>
                  <Button
                    variant="contained"
                    onClick={() => chooseOption(option)}
                    style={{ fontSize: 20 }}
                  >
                    {option}
                  </Button>
                </div>
              );
            })}
          </Grid>
        </Card>
      ) : null}

      <Card style={{ padding: 20 }}>
        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          {correctAnswerValue ? (
            <Typography>Correct answer is: {correctAnswerValue}</Typography>
          ) : null}
          <Button
            color="error"
            variant="outlined"
            style={{ marginRight: 10 }}
            onClick={checkCorrectAnswer}
          >
            See right answer
          </Button>
          <Button variant="outlined" style={{ marginRight: 10 }} onClick={skip}>
            New word (skip)
          </Button>
          <Button
            color="success"
            variant="contained"
            style={{ marginRight: 10 }}
            onClick={endTesting}
          >
            See results (end testing)
          </Button>
        </Grid>
      </Card>
    </Grid>
  );
};
