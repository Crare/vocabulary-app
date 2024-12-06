import { Grid } from "@mui/material";
import {
  TestOption,
  TestResults,
  TestSettings,
  TestState,
  TestWord,
} from "./types";
import { useEffect, useState } from "react";
import { calcTimeTakenText } from "../../hooks/useDate";
import { GuessResult } from "./GuessResult";
import { WriteTestCard } from "./WriteTestCard";
import { SelectAnswerCard } from "./SelectAnswerCard";
import { TestingStatsCard } from "./TestingStatsCard";
import { TestBottomButtons } from "./TestBottomButtons";
import { randomIntFromInterval } from "../../util/helpers";

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
  const [guessWord, setGuessWord] = useState<TestWord | undefined>(undefined);
  // const [success, setSuccess] = useState<boolean>(false);
  // const [failed, setFailed] = useState<boolean>(false);
  // const [checkedAnswer, setCheckedAnswer] = useState<boolean>(false);
  const [testState, setTestState] = useState<TestState | undefined>(undefined);

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
    if (wordsLeft === 0) {
      endTesting();
    }
    // console.log("chooseWordForGuessing()");
    if (!testWords) {
      // console.log("HERE! testWords", testWords);
      return;
    }
    let index = randomIntFromInterval(0, testWords!.length - 1);
    let gWord = testWords![index];
    while (
      gWord.timesCorrect === settings.wordNeedsToGetCorrectTimes &&
      guessWord !== gWord
    ) {
      index = randomIntFromInterval(0, testWords!.length - 1);
      gWord = testWords![index];
    }
    // console.log("gWord", gWord);
    setGuessWord(gWord);
  };
  useEffect(() => {
    chooseWordForGuessing();
  }, [testWords]);

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

  const sendAnswer = (value: string) => {
    answer(value);
  };

  const chooseOption = (option: string) => {
    answer(option);
  };

  const checkHowManyWordsLeft = () => {
    console.log("checkHowManyWordsLeft");
    if (!testWords) {
      console.log("here! checkHowManyWordsLeft, testWords", testWords);
      return;
    }
    console.log("here2! checkHowManyWordsLeft");
    const doneWords = testWords?.filter(
      (w) => w.timesCorrect >= settings.wordNeedsToGetCorrectTimes
    );
    console.log("testWords", testWords);
    console.log("settings", settings);
    console.log("doneWords", doneWords);
    const wordsleftToDo = testWords?.length - doneWords?.length;
    console.log("wordsleftToDo", wordsleftToDo);
    setWordsLeft(wordsleftToDo);
  };
  useEffect(() => {
    if (wordsLeft === 0) {
      endTesting();
    }
  }, [wordsLeft]);

  const answer = (guess: string) => {
    if (!guessWord) {
      return;
    }
    if (guess === guessWord?.lang2Word) {
      // success
      // console.log("correct answer!");
      guessWord.timesCorrect += 1;
      setTestState(TestState.Success);
    } else {
      // failed
      // console.log("wrong answer!");
      guessWord.timesFailed += 1;
      setTestState(TestState.Failed);
    }
  };
  useEffect(() => {
    if (testState === TestState.Success || testState === TestState.Failed) {
      setTimeout(() => {
        next();
      }, 1500);
    }
  }, [testState]);

  const next = () => {
    setTestState(undefined);
    chooseWordForGuessing();
    setCorrectAnswerValue(undefined);
    checkHowManyWordsLeft();
  };

  const skip = () => {
    guessWord!.timesFailed += 1;
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
    setTestState(TestState.CheckedAnswer);
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
      <TestingStatsCard settings={settings} wordsLeft={wordsLeft} />

      <GuessResult testState={testState} guessWord={guessWord} />

      {testOption === TestOption.WriteCorrectAnswer && guessWord ? (
        // {true && guessWord ? (
        <WriteTestCard
          testState={testState}
          guessWord={guessWord}
          onSendAnswer={sendAnswer}
          testOption={TestOption.WriteCorrectAnswer}
        />
      ) : null}

      {testOption === TestOption.SelectFromMultiple && guessWord ? (
        // {true && guessWord ? (
        <SelectAnswerCard
          testState={testState}
          guessWord={guessWord}
          onChooseOption={chooseOption}
          testOption={TestOption.SelectFromMultiple}
          settings={settings}
          testWords={testWords}
          wordsLeft={wordsLeft}
        />
      ) : null}

      <TestBottomButtons
        testState={testState}
        correctAnswerValue={correctAnswerValue}
        onCheckCorrectAnswer={checkCorrectAnswer}
        onEndTesting={endTesting}
        onNext={next}
        onSkip={skip}
      />
    </Grid>
  );
};
