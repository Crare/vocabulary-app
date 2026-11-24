import { useCallback, useEffect, useRef, useState } from "react";
import {
  TestOption,
  TestResults,
  TestSettings,
  TestState,
  TestWord,
} from "./types";
import {
  AnswerResult,
  AttemptOutcome,
  createTestWords,
  expectedAnswerFor,
  getRemainingWords,
  matchAnswer,
  pickQuestion,
  Question,
  recordAttempt,
  testOptionLabel,
} from "./testLogic";
import { feedbackDelayMs } from "./feedback";
import { calcTimeTakenText } from "../../hooks/useDate";
import { useLatest } from "../../hooks/useLatest";
import { useSound } from "../../SoundContext";
import { createLogger } from "../../util/logger";

const log = createLogger("testing");

/** The question on screen. */
export interface Round {
  /** Increases with every question; use it as a key to reset the cards. */
  index: number;
  question: Question;
}

export interface PairResult {
  word: TestWord;
  outcome: AttemptOutcome;
}

const STATE_FOR_RESULT: Record<AnswerResult, TestState> = {
  correct: TestState.Success,
  typo: TestState.TypoMatch,
  wrong: TestState.Failed,
};

interface UseTestSessionOptions {
  settings: TestSettings;
  onEndTesting: (results: TestResults) => void;
}

/**
 * The test loop: picks questions, records answers and decides when the test
 * is over. Word counters live in one mutable array (never stale inside
 * timers); React state only drives what is shown.
 */
export const useTestSession = ({
  settings,
  onEndTesting,
}: UseTestSessionOptions) => {
  const { onCorrect, onWrong, onFinish, onReveal } = useSound();
  const settingsRef = useLatest(settings);
  const onEndTestingRef = useLatest(onEndTesting);

  const [testWords] = useState(() => createTestWords(settings.languageSet));
  const startTimeRef = useRef(new Date());
  const questionStartRef = useRef(Date.now());
  const answeredRef = useRef(false); // hard guard against double submission
  const finishedRef = useRef(false);

  const [round, setRound] = useState<Round | null>(() => {
    const remaining = getRemainingWords(testWords, settings);
    log.info("test_initialized", {
      wordCount: testWords.length,
      correctTimesNeeded: settings.wordNeedsToGetCorrectTimes,
      testType: settings.testType,
    });
    return remaining.length === 0
      ? null
      : { index: 0, question: pickQuestion(settings, remaining, 0) };
  });
  const [testState, setTestState] = useState<TestState | undefined>();
  const [hasInteracted, setHasInteracted] = useState(false);
  const roundRef = useLatest(round);

  const elapsed = () => Date.now() - questionStartRef.current;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    log.info("test_finished", {
      totalWords: testWords.length,
      questionCount: roundRef.current?.index ?? 0,
      wordSummary: testWords.map((w) => ({
        word: w.lang1Word,
        correct: w.timesCorrect,
        failed: w.timesFailed,
        dontKnow: w.timesCheckedAnswer,
      })),
    });
    onFinish();
    onEndTestingRef.current({
      date: new Date(),
      timeTaken: calcTimeTakenText(startTimeRef.current, new Date()),
      score: 0,
      wordResults: testWords,
    });
  }, [testWords, onFinish, onEndTestingRef, roundRef]);

  const next = useCallback(() => {
    if (finishedRef.current) return;
    const s = settingsRef.current;
    const remaining = getRemainingWords(testWords, s);
    if (remaining.length === 0) {
      finish();
      return;
    }
    const index = (roundRef.current?.index ?? 0) + 1;
    const question = pickQuestion(s, remaining, index);
    log.debug("next_question", {
      questionIndex: index,
      wordsRemaining: remaining.length,
      testOption: testOptionLabel(question.option),
      direction: question.direction,
    });
    setRound({ index, question });
    setTestState(undefined);
    answeredRef.current = false;
    questionStartRef.current = Date.now();
  }, [testWords, finish, settingsRef, roundRef]);

  // Nothing to practise (an empty set): end straight away.
  useEffect(() => {
    if (round === null) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance after the feedback; manual mode waits for Continue.
  const autoAdvanceMs =
    testState === TestState.CheckedAnswer
      ? undefined // "I don't know" always waits for Continue
      : feedbackDelayMs(
          settings.answerDelayMs,
          testState !== undefined && testState !== TestState.Success,
        );
  useEffect(() => {
    if (testState === undefined || autoAdvanceMs === undefined) return;
    const timer = setTimeout(next, autoAdvanceMs);
    return () => clearTimeout(timer);
  }, [testState, autoAdvanceMs, next]);

  /** The current single-word question, if it can still be answered. */
  const openQuestion = () => {
    const q = round?.question;
    if (!q || q.option === TestOption.DragAndDrop) return undefined;
    if (answeredRef.current || finishedRef.current || testState !== undefined) {
      return undefined;
    }
    return q;
  };

  /** Submit a typed answer or a picked option. */
  const submitAnswer = (guess: string) => {
    const q = openQuestion();
    if (!q) {
      log.debug("answer_rejected", { testState });
      return;
    }
    answeredRef.current = true;
    setHasInteracted(true);

    const expected = expectedAnswerFor(q);
    // Options are real words, so a near-miss pick is a wrong answer, not a typo.
    const allowTypos =
      settings.allowTypos && q.option !== TestOption.SelectFromMultiple;
    const result = matchAnswer(guess, expected, allowTypos);
    if (q.option === TestOption.SentenceFillBlank) {
      (q.word.sentenceResults ??= []).push({
        testedWord: q.blank.missingWord,
        correct: result !== "wrong",
        sentence: q.blank.sentence,
      });
    }
    recordAttempt(q.word, result === "wrong" ? "wrong" : "correct", elapsed());
    log.debug("answer_submitted", {
      word: q.word.lang1Word,
      guess,
      expected,
      result,
      direction: q.direction,
    });

    setTestState(STATE_FOR_RESULT[result]);
    if (result === "wrong") onWrong();
    else onCorrect();
  };

  /** "I don't know": show the answer; counts as a miss and the word comes back. */
  const dontKnow = () => {
    const q = openQuestion();
    if (!q) return;
    answeredRef.current = true;
    onReveal();
    setHasInteracted(true);
    recordAttempt(q.word, "dontKnow", elapsed());
    log.info("dont_know", {
      word: q.word.lang1Word,
      correctAnswer: expectedAnswerFor(q),
    });
    setTestState(TestState.CheckedAnswer);
  };

  const completePairs = useCallback(
    (results: PairResult[]) => {
      if (finishedRef.current || results.length === 0) return;
      const perWordTime = Math.floor(elapsed() / results.length);
      for (const r of results) recordAttempt(r.word, r.outcome, perWordTime);
      log.info("pairs_done", {
        right: results.filter((r) => r.outcome === "correct").length,
        dontKnow: results.some((r) => r.outcome === "dontKnow"),
      });
      setHasInteracted(true);
      next();
    },
    [next],
  );

  return {
    round,
    testWords,
    testState,
    hasInteracted,
    autoAdvanceMs,
    submitAnswer,
    dontKnow,
    next,
    finish,
    completePairs,
  };
};
