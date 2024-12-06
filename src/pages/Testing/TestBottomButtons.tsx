import { Button, Card, Grid, Typography } from "@mui/material";
import { TestState } from "./types";

interface TestBottomButtonsProps {
  testState: TestState | undefined;
  correctAnswerValue: string | undefined;
  onCheckCorrectAnswer: () => void;
  onNext: () => void;
  onSkip: () => void;
  onEndTesting: () => void;
}

export const TestBottomButtons = (props: TestBottomButtonsProps) => {
  const {
    testState,
    correctAnswerValue,
    onCheckCorrectAnswer,
    onEndTesting,
    onNext,
    onSkip,
  } = props;
  return (
    <Card style={{ padding: 20 }}>
      <Grid
        container
        flexDirection={"row"}
        gap={2}
        justifyContent={"space-evenly"}
      >
        {correctAnswerValue ? (
          <div>
            <Typography>Correct answer is:</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              {correctAnswerValue}
            </Typography>
          </div>
        ) : (
          <Button
            color="error"
            variant="outlined"
            style={{ marginRight: 10 }}
            onClick={onCheckCorrectAnswer}
            disabled={testState !== undefined}
          >
            See right answer
          </Button>
        )}
        {testState === TestState.CheckedAnswer ? (
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            onClick={onNext}
          >
            Continue
          </Button>
        ) : null}

        <Button
          variant="outlined"
          style={{ marginRight: 10 }}
          onClick={onSkip}
          disabled={testState !== undefined}
        >
          New word (skip)
        </Button>
        <Button
          color="success"
          variant="contained"
          style={{ marginRight: 10 }}
          onClick={onEndTesting}
        >
          See results (end testing)
        </Button>
      </Grid>
    </Card>
  );
};
