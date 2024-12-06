import { Button, Card, Grid, Input, Typography } from "@mui/material";
import { TestOption, TestResults, TestSettings, TestWord } from "./types";
import { useEffect, useState } from "react";
import { Timer } from "../../components/Timer";
import { calcTimeTakenText } from "../../hooks/useDate";
import { GuessResult } from "./GuessResult";
import { GuessWordTitle } from "./GuessWordTitle";
import { WriteTestCard } from "./WriteTestCard";
import { SelectAnswerCard } from "./SelectAnswerCard";
import { TestingStatsCard } from "./TestingStatsCard";
import { TestBottomButtons } from "./TestBottomButtons";

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
  console.log("wordsLeft", wordsLeft);

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
    if (wordsLeft === 0) {
      return;
    }
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
    answer(guessAnswer);
  };

  const chooseOption = (option: string) => {
    answer(option);
  };

  const checkHowManyWordsLeft = () => {
    if (!testWords) {
      return;
    }
    const doneWords = testWords?.filter(
      (w) => w.timesCheckedAnswer >= settings.wordNeedsToGetCorrectTimes
    );
    console.log("testWords", testWords);
    console.log("settings", settings);
    console.log("doneWords", doneWords);
    const wordsleftToDo = testWords?.length - doneWords?.length;
    console.log("wordsleftToDo", wordsleftToDo);
    setWordsLeft(wordsleftToDo);
  };

  const [success, setSuccess] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [checkedAnswer, setCheckedAnswer] = useState<boolean>(false);
  const answer = (guess: string) => {
    if (!guessWord) {
      return;
    }
    if (guess === guessWord?.lang2Word) {
      // success
      // console.log("correct answer!");
      guessWord.timesCorrect += 1;
      setSuccess(true);
    } else {
      // failed
      // console.log("wrong answer!");
      guessWord.timesFailed += 1;
      setFailed(true);
    }
  };
  useEffect(() => {
    if (success === true || failed === true) {
      if (success) {
        checkHowManyWordsLeft();
      }
      setTimeout(() => {
        next();
      }, 1500);
    }
  }, [failed, success]);

  const next = () => {
    setSuccess(false);
    setFailed(false);
    setCheckedAnswer(false);
    setGuessAnswer("");
    chooseWordForGuessing();
    setCorrectAnswerValue(undefined);
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
    setCheckedAnswer(true);
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

      <GuessResult success={success} failed={failed} guessWord={guessWord} />

      {/* {testOption === TestOption.WriteCorrectAnswer && guessWord ? ( */}
      {true && guessWord ? (
        <WriteTestCard
          checkedAnswer={checkedAnswer}
          failed={failed}
          success={success}
          guessWord={guessWord}
          onSendAnswer={sendAnswer}
          testOption={TestOption.WriteCorrectAnswer}
        />
      ) : null}

      {/* {testOption === TestOption.SelectFromMultiple ? ( */}
      {true && guessWord ? (
        <SelectAnswerCard
          checkedAnswer={checkedAnswer}
          failed={failed}
          success={success}
          guessWord={guessWord}
          multiSelectGuessOptions={multiSelectGuessOptions}
          onChooseOption={chooseOption}
          testOption={TestOption.SelectFromMultiple}
        />
      ) : null}

      <TestBottomButtons
        checkedAnswer={checkedAnswer}
        failed={failed}
        success={success}
        correctAnswerValue={correctAnswerValue}
        onCheckCorrectAnswer={checkCorrectAnswer}
        onEndTesting={endTesting}
        onNext={next}
        onSkip={skip}
      />
    </Grid>
  );
};
