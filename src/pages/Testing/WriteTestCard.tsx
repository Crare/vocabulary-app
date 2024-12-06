import { Button, Card, Input } from "@mui/material";
import { GuessWordTitle } from "./GuessWordTitle";
import { TestOption, TestState, TestWord } from "./types";
import { useEffect, useState } from "react";

interface WriteTestCardProps {
  testState: TestState | undefined;
  guessWord: TestWord;
  testOption: TestOption;
  onSendAnswer: (value: string) => void;
}

export const WriteTestCard = (props: WriteTestCardProps) => {
  const { guessWord, testOption, testState, onSendAnswer } = props;

  const [guessAnswer, setGuessAnswer] = useState<string>("");

  const checkEnterForSendAnswer = (e: any) => {
    if (e.code === "Enter" && guessAnswer) {
      onSendAnswer(guessAnswer);
    }
  };

  const sendAnswer = () => (guessAnswer ? onSendAnswer(guessAnswer) : null);

  useEffect(() => {
    if (testState === TestState.Success || testState === TestState.Failed) {
      setGuessAnswer("");
    }
  }, [testState]);

  return (
    <Card style={{ padding: 20 }}>
      <GuessWordTitle guessWord={guessWord} testOption={testOption} />
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
          disabled={testState === TestState.CheckedAnswer}
          onKeyUp={(e) => checkEnterForSendAnswer(e)}
        />
        <Button
          variant="contained"
          onClick={sendAnswer}
          disabled={testState !== undefined}
        >
          Send answer
        </Button>
      </div>
    </Card>
  );
};
