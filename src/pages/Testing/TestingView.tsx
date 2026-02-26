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
import {
    GuessDirection,
    chooseTestOption,
    chooseGuessDirection,
    getExpectedAnswer,
    isAnswerCorrect,
    countWordsLeft,
} from "./testLogic";

interface TestingViewProps {
    settings: TestSettings;
    onEndTesting: (results: TestResults) => void;
}

export const TestingView = (props: TestingViewProps) => {
    const { settings, onEndTesting } = props;
    const [startTime] = useState<Date>(new Date());
    const [testOption, setTestOption] = useState<TestOption>(
        TestOption.WriteCorrectAnswer,
    );
    const [testWords, setTestWords] = useState<TestWord[] | undefined>(
        undefined,
    );
    const [wordsLeft, setWordsLeft] = useState<number>(-1);
    const [guessWord, setGuessWord] = useState<TestWord | undefined>(undefined);
    const [testState, setTestState] = useState<TestState | undefined>(
        undefined,
    );
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [guessDirection, setGuessDirection] =
        useState<GuessDirection>("lang1to2");

    const setupWords = () => {
        if (!settings) {
            // console.log("here! setupWords()");
            return;
        }
        // console.log("setupWords()");
        // console.log("settings", settings);
        // console.log("testWords", testWords);
        // console.log("wordsLeft", wordsLeft);
        var words = settings.languageSet.language1Words.map(
            (lang1Word, index) => {
                return {
                    id: index,
                    lang1Word: lang1Word,
                    lang2Word: settings.languageSet.language2Words[index],
                    timesCorrect: 0,
                    timesFailed: 0,
                    timesSkipped: 0,
                    timesCheckedAnswer: 0,
                };
            },
        );
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

    useEffect(() => {
        if (guessWord) {
            setTestOption(chooseTestOption(settings, questionIndex));
            setGuessDirection(chooseGuessDirection(settings));
        }
    }, [guessWord]);

    const sendAnswer = (value: string) => {
        answer(value);
    };

    const chooseOption = (option: string) => {
        answer(option);
    };

    const checkHowManyWordsLeft = () => {
        if (!testWords) {
            return;
        }
        setWordsLeft(
            countWordsLeft(testWords, settings.wordNeedsToGetCorrectTimes),
        );
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
        if (isAnswerCorrect(guess, guessWord, guessDirection)) {
            guessWord.timesCorrect += 1;
            setTestState(TestState.Success);
        } else {
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
        setQuestionIndex((prev) => prev + 1);
        chooseWordForGuessing();
        setCorrectAnswerValue(undefined);
        checkHowManyWordsLeft();
    };

    const skip = () => {
        guessWord!.timesSkipped += 1;
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
        setCorrectAnswerValue(getExpectedAnswer(guessWord, guessDirection));
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
        onEndTesting(results);
    };

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <TestingStatsCard settings={settings} wordsLeft={wordsLeft} />

            <GuessResult
                testState={testState}
                guessWord={guessWord}
                guessDirection={guessDirection}
            />

            {testOption === TestOption.WriteCorrectAnswer && guessWord ? (
                <WriteTestCard
                    testState={testState}
                    guessWord={guessWord}
                    onSendAnswer={sendAnswer}
                    testOption={TestOption.WriteCorrectAnswer}
                    guessDirection={guessDirection}
                    targetLanguageName={
                        guessDirection === "lang1to2"
                            ? settings.languageSet.language2Name
                            : settings.languageSet.language1Name
                    }
                />
            ) : null}

            {testOption === TestOption.SelectFromMultiple && guessWord ? (
                <SelectAnswerCard
                    testState={testState}
                    guessWord={guessWord}
                    onChooseOption={chooseOption}
                    testOption={TestOption.SelectFromMultiple}
                    settings={settings}
                    testWords={testWords}
                    wordsLeft={wordsLeft}
                    guessDirection={guessDirection}
                    targetLanguageName={
                        guessDirection === "lang1to2"
                            ? settings.languageSet.language2Name
                            : settings.languageSet.language1Name
                    }
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
