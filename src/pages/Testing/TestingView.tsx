import { Grid } from "@mui/material";
import {
    TestOption,
    TestResults,
    TestSettings,
    TestState,
    TestWord,
} from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import { calcTimeTakenText } from "../../hooks/useDate";
import { GuessResult } from "./GuessResult";
import { WriteTestCard } from "./WriteTestCard";
import { SelectAnswerCard } from "./SelectAnswerCard";
import { DragDropTestCard, DRAG_DROP_BATCH_SIZE } from "./DragDropTestCard";
import { TestingStatsCard } from "./TestingStatsCard";
import { TestBottomButtons } from "./TestBottomButtons";
import { randomIntFromInterval, shuffle } from "../../util/helpers";
import {
    GuessDirection,
    chooseTestOption,
    chooseGuessDirection,
    getExpectedAnswer,
    isAnswerCorrect,
} from "./testLogic";
import { createLogger } from "../../util/logger";
import { useSound } from "../../SoundContext";

const log = createLogger("testing");

interface TestingViewProps {
    settings: TestSettings;
    onEndTesting: (results: TestResults) => void;
    onBackToStart: () => void;
}

export const TestingView = (props: TestingViewProps) => {
    const { settings, onEndTesting, onBackToStart } = props;
    const { onCorrect, onWrong, onFinish } = useSound();

    // Keep latest prop values in refs so callbacks never go stale
    const settingsRef = useRef(settings);
    const onEndTestingRef = useRef(onEndTesting);
    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);
    useEffect(() => {
        onEndTestingRef.current = onEndTesting;
    }, [onEndTesting]);

    // Mutable data in refs — never stale, mutations visible immediately
    const startTime = useRef(new Date());
    const testWordsRef = useRef<TestWord[]>([]);
    const questionIndexRef = useRef(0);
    const isAnsweringRef = useRef(false); // hard guard against double submission
    const wordStartTimeRef = useRef<number>(Date.now());

    // UI state (trigger re-renders)
    const [guessWord, setGuessWord] = useState<TestWord | undefined>(undefined);
    const [testState, setTestState] = useState<TestState | undefined>(
        undefined,
    );
    const [wordsLeft, setWordsLeft] = useState<number>(0);
    const [testOption, setTestOption] = useState<TestOption>(
        TestOption.WriteCorrectAnswer,
    );
    const [guessDirection, setGuessDirection] =
        useState<GuessDirection>("lang1to2");
    const [correctAnswerValue, setCorrectAnswerValue] = useState<
        string | undefined
    >(undefined);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [dragDropBatch, setDragDropBatch] = useState<TestWord[]>([]);

    const finishTest = useCallback(() => {
        const words = testWordsRef.current;
        log.info("test_finished", {
            totalWords: words.length,
            questionCount: questionIndexRef.current,
            wordSummary: words.map((w) => ({
                word: w.lang1Word,
                correct: w.timesCorrect,
                failed: w.timesFailed,
                skipped: w.timesSkipped,
                checked: w.timesCheckedAnswer,
            })),
        });
        onFinish();
        onEndTestingRef.current({
            date: new Date(),
            timeTaken: calcTimeTakenText(startTime.current, new Date()),
            score: 0,
            wordResults: words,
        });
    }, [onFinish]); // no deps — reads everything from refs

    const advanceToNext = useCallback(() => {
        const s = settingsRef.current;
        const remaining = testWordsRef.current.filter(
            (w) => w.timesCorrect < s.wordNeedsToGetCorrectTimes,
        );
        if (remaining.length === 0) {
            finishTest();
            return;
        }
        questionIndexRef.current += 1;
        let option = chooseTestOption(s, questionIndexRef.current);
        const direction = chooseGuessDirection(s);

        // Fall back if drag-and-drop chosen but < 2 remaining words
        if (option === TestOption.DragAndDrop && remaining.length < 2) {
            option = s.testType.writing
                ? TestOption.WriteCorrectAnswer
                : TestOption.SelectFromMultiple;
        }

        if (option === TestOption.DragAndDrop) {
            const shuffled = [...remaining];
            shuffle(shuffled);
            const batch = shuffled.slice(0, DRAG_DROP_BATCH_SIZE);
            setDragDropBatch(batch);
            setGuessWord(undefined);
        } else {
            const next =
                remaining[randomIntFromInterval(0, remaining.length - 1)];
            setGuessWord(next);
            setDragDropBatch([]);
        }

        log.debug("next_question", {
            questionIndex: questionIndexRef.current,
            wordsRemaining: remaining.length,
            testOption:
                option === TestOption.WriteCorrectAnswer
                    ? "write"
                    : option === TestOption.SelectFromMultiple
                      ? "multi-select"
                      : "drag-drop",
            direction,
        });
        setWordsLeft(remaining.length);
        setTestOption(option);
        setGuessDirection(direction);
        setTestState(undefined);
        setCorrectAnswerValue(undefined);
        isAnsweringRef.current = false;
        wordStartTimeRef.current = Date.now();
    }, [finishTest]); // finishTest is stable (no deps), so advanceToNext is also stable

    // Initialise once on mount
    useEffect(() => {
        const s = settingsRef.current;
        const words: TestWord[] = s.languageSet.language1Words.map(
            (lang1Word, index) => ({
                id: index,
                lang1Word,
                lang2Word: s.languageSet.language2Words[index],
                timesCorrect: 0,
                timesFailed: 0,
                timesSkipped: 0,
                timesCheckedAnswer: 0,
                totalAnswerTimeMs: 0,
                answerAttempts: 0,
            }),
        );
        testWordsRef.current = words;
        questionIndexRef.current = 0;
        isAnsweringRef.current = false;

        log.info("test_initialized", {
            wordCount: words.length,
            correctTimesNeeded: s.wordNeedsToGetCorrectTimes,
            testType: s.testType,
        });

        const remaining = words.filter(
            (w) => w.timesCorrect < s.wordNeedsToGetCorrectTimes,
        );
        if (remaining.length === 0) {
            finishTest();
            return;
        }

        let firstOption = chooseTestOption(s, 0);
        const firstDirection = chooseGuessDirection(s);

        // Fall back if drag-and-drop chosen but < 2 remaining words
        if (firstOption === TestOption.DragAndDrop && remaining.length < 2) {
            firstOption = s.testType.writing
                ? TestOption.WriteCorrectAnswer
                : TestOption.SelectFromMultiple;
        }

        if (firstOption === TestOption.DragAndDrop) {
            const shuffled = [...remaining];
            shuffle(shuffled);
            setDragDropBatch(shuffled.slice(0, DRAG_DROP_BATCH_SIZE));
        } else {
            const firstWord =
                remaining[randomIntFromInterval(0, remaining.length - 1)];
            setGuessWord(firstWord);
        }

        setWordsLeft(remaining.length);
        setTestOption(firstOption);
        setGuessDirection(firstDirection);
        wordStartTimeRef.current = Date.now();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-advance after answer feedback delay
    useEffect(() => {
        if (testState === TestState.Success || testState === TestState.Failed) {
            const timer = setTimeout(advanceToNext, 1500);
            return () => clearTimeout(timer);
        }
    }, [testState, advanceToNext]);

    const answer = (guess: string) => {
        if (isAnsweringRef.current || !guessWord || testState !== undefined) {
            log.debug("answer_rejected", {
                isAnswering: isAnsweringRef.current,
                hasGuessWord: !!guessWord,
                testState,
            });
            return;
        }
        isAnsweringRef.current = true;
        setHasInteracted(true);

        const correct = isAnswerCorrect(guess, guessWord, guessDirection);
        log.debug("answer_submitted", {
            word: guessWord.lang1Word,
            guess,
            expected: getExpectedAnswer(guessWord, guessDirection),
            correct,
            direction: guessDirection,
        });

        const elapsed = Date.now() - wordStartTimeRef.current;
        guessWord.totalAnswerTimeMs += elapsed;
        guessWord.answerAttempts += 1;

        if (correct) {
            guessWord.timesCorrect += 1;
            setTestState(TestState.Success);
            onCorrect();
        } else {
            guessWord.timesFailed += 1;
            setTestState(TestState.Failed);
            onWrong();
        }
    };

    const next = () => advanceToNext();

    const skip = () => {
        setHasInteracted(true);
        if (guessWord) {
            const elapsed = Date.now() - wordStartTimeRef.current;
            guessWord.totalAnswerTimeMs += elapsed;
            guessWord.answerAttempts += 1;
            guessWord.timesSkipped += 1;
            log.debug("word_skipped", {
                word: guessWord.lang1Word,
                timesSkipped: guessWord.timesSkipped,
            });
        }
        advanceToNext();
    };

    const checkCorrectAnswer = () => {
        if (!guessWord) return;
        setHasInteracted(true);
        const elapsed = Date.now() - wordStartTimeRef.current;
        guessWord.totalAnswerTimeMs += elapsed;
        guessWord.answerAttempts += 1;
        guessWord.timesCheckedAnswer += 1;
        const answer = getExpectedAnswer(guessWord, guessDirection);
        log.debug("answer_checked", {
            word: guessWord.lang1Word,
            correctAnswer: answer,
        });
        setTestState(TestState.CheckedAnswer);
        setCorrectAnswerValue(answer);
    };

    const handleDragDropComplete = useCallback(
        (results: { word: TestWord; correct: boolean }[]) => {
            const elapsed = Date.now() - wordStartTimeRef.current;
            const perWordTime = Math.floor(elapsed / results.length);

            let anyWrong = false;
            for (const r of results) {
                r.word.totalAnswerTimeMs += perWordTime;
                r.word.answerAttempts += 1;
                if (r.correct) {
                    r.word.timesCorrect += 1;
                } else {
                    r.word.timesFailed += 1;
                    anyWrong = true;
                }
            }

            setHasInteracted(true);
            if (anyWrong) onWrong();
            else onCorrect();

            advanceToNext();
        },
        [advanceToNext, onCorrect, onWrong],
    );

    const targetLangName =
        guessDirection === "lang1to2"
            ? settings.languageSet.language2Name
            : settings.languageSet.language1Name;

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <TestingStatsCard
                settings={settings}
                testWords={testWordsRef.current}
                wordsLeft={wordsLeft}
            />

            {testOption === TestOption.DragAndDrop &&
            dragDropBatch.length > 0 ? (
                <DragDropTestCard
                    key={dragDropBatch.map((w) => w.id).join(",")}
                    words={dragDropBatch}
                    guessDirection={guessDirection}
                    targetLanguageName={targetLangName}
                    onComplete={handleDragDropComplete}
                />
            ) : (
                <>
                    <GuessResult
                        testState={testState}
                        guessWord={guessWord}
                        guessDirection={guessDirection}
                    />

                    {testOption === TestOption.WriteCorrectAnswer &&
                    guessWord ? (
                        <WriteTestCard
                            testState={testState}
                            guessWord={guessWord}
                            onSendAnswer={answer}
                            testOption={TestOption.WriteCorrectAnswer}
                            guessDirection={guessDirection}
                            targetLanguageName={targetLangName}
                        />
                    ) : null}

                    {testOption === TestOption.SelectFromMultiple &&
                    guessWord ? (
                        <SelectAnswerCard
                            testState={testState}
                            guessWord={guessWord}
                            onChooseOption={answer}
                            testOption={TestOption.SelectFromMultiple}
                            settings={settings}
                            testWords={testWordsRef.current}
                            wordsLeft={wordsLeft}
                            guessDirection={guessDirection}
                            targetLanguageName={targetLangName}
                        />
                    ) : null}

                    <TestBottomButtons
                        testState={testState}
                        correctAnswerValue={correctAnswerValue}
                        onCheckCorrectAnswer={checkCorrectAnswer}
                        onEndTesting={finishTest}
                        onNext={next}
                        onSkip={skip}
                        onBackToStart={onBackToStart}
                        hasInteracted={hasInteracted}
                    />
                </>
            )}
        </Grid>
    );
};
