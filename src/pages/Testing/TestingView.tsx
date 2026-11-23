import { Box } from "@mui/material";
import { TestOption, TestResults, TestSettings } from "./types";
import { getReferenceSentence } from "./testLogic";
import { useTestSession } from "./useTestSession";
import { WriteTestCard } from "./WriteTestCard";
import { SelectAnswerCard } from "./SelectAnswerCard";
import { DragDropTestCard } from "./DragDropTestCard";
import { SentenceTestCard } from "./SentenceTestCard";
import { TestingStatsCard, countLearned } from "./TestingStatsCard";
import { TestTopBar } from "./TestTopBar";

interface TestingViewProps {
  settings: TestSettings;
  onEndTesting: (results: TestResults) => void;
  onBackToStart: () => void;
}

/** A running test: progress at the top and the current question below. */
export const TestingView = ({
  settings,
  onEndTesting,
  onBackToStart,
}: TestingViewProps) => {
  const session = useTestSession({ settings, onEndTesting });
  const { round, testState, testWords, autoAdvanceMs } = session;
  if (!round) return null;

  const { question, index } = round;
  const { language1Name, language2Name } = settings.languageSet;
  const forward = question.direction === "lang1to2";
  const targetLanguageName = forward ? language2Name : language1Name;
  const referenceLanguageName = forward ? language1Name : language2Name;
  const panelProps = {
    onDontKnow: session.dontKnow,
    onContinue: session.next,
    autoAdvanceMs,
  };

  const renderQuestion = () => {
    switch (question.option) {
      case TestOption.DragAndDrop:
        return (
          <DragDropTestCard
            key={index}
            words={question.batch}
            guessDirection={question.direction}
            targetLanguageName={targetLanguageName}
            onComplete={session.completePairs}
            autoAdvanceMs={autoAdvanceMs}
          />
        );
      case TestOption.SelectFromMultiple:
        return (
          <SelectAnswerCard
            key={index}
            testState={testState}
            guessWord={question.word}
            onChooseOption={session.submitAnswer}
            testOption={question.option}
            settings={settings}
            testWords={testWords}
            guessDirection={question.direction}
            targetLanguageName={targetLanguageName}
            {...panelProps}
          />
        );
      case TestOption.SentenceFillBlank:
        return (
          <SentenceTestCard
            key={index}
            testState={testState}
            blank={question.blank}
            referenceSentence={getReferenceSentence(question.word, question.direction)}
            hint={question.word.hint}
            targetLanguageName={targetLanguageName}
            referenceLanguageName={referenceLanguageName}
            onSendAnswer={session.submitAnswer}
            {...panelProps}
          />
        );
      default:
        return (
          <WriteTestCard
            key={index}
            testState={testState}
            guessWord={question.word}
            onSendAnswer={session.submitAnswer}
            testOption={question.option}
            guessDirection={question.direction}
            targetLanguageName={targetLanguageName}
            {...panelProps}
          />
        );
    }
  };

  return (
    <Box
      className="content"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        // Fill the screen on phones (minus the 80px app bar and page padding)
        // so the answer panel sits at the bottom.
        minHeight: { xs: "calc(100dvh - 88px)", md: "auto" },
      }}
    >
      <TestTopBar
        title={settings.languageSet.name || "Test"}
        subtitle={`${testWords.length} words`}
        learned={countLearned(testWords, settings)}
        total={testWords.length}
        onBackToStart={session.hasInteracted ? undefined : onBackToStart}
        onEndTest={session.finish}
      />
      <TestingStatsCard settings={settings} testWords={testWords} />
      {renderQuestion()}
    </Box>
  );
};
