import { Button, Card, Input } from "@mui/material";
import { GuessWordTitle } from "./GuessWordTitle";
import { TestOption, TestWord } from "./types";
import { useState } from "react";

interface WriteTestCardProps {
  guessWord: TestWord;
  testOption: TestOption;
  checkedAnswer: boolean;
  success: boolean;
  failed: boolean;
  onSendAnswer: (value: string) => void;
}

export const WriteTestCard = (props: WriteTestCardProps) => {
  const {
    guessWord,
    testOption,
    checkedAnswer,
    success,
    failed,
    onSendAnswer,
  } = props;

  const [guessAnswer, setGuessAnswer] = useState<string>();

  const checkEnterForSendAnswer = (e: any) => {
    if (e.code === "Enter" && guessAnswer) {
      onSendAnswer(guessAnswer);
    }
  };

  const sendAnswer = () => (guessAnswer ? onSendAnswer(guessAnswer) : null);

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
          disabled={checkedAnswer}
          onKeyUp={(e) => checkEnterForSendAnswer(e)}
        />
        <Button
          variant="contained"
          onClick={sendAnswer}
          disabled={success || failed || checkedAnswer}
        >
          Send answer
        </Button>
      </div>
    </Card>
  );
};
