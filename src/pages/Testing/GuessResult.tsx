import { Typography } from "@mui/material";
import { TestState, TestWord } from "./types";

interface GuessResultProps {
  testState: TestState | undefined;
  guessWord: TestWord | undefined;
}

export const GuessResult = (props: GuessResultProps) => {
  const { testState, guessWord } = props;
  return (
    <>
      {testState === TestState.Success ? (
        <Typography color="green" variant="h6" style={{ textAlign: "center" }}>
          Correct! Answer was: "{guessWord?.lang2Word}". Continuing to next
          word...
        </Typography>
      ) : null}
      {testState === TestState.Failed ? (
        <Typography color="red" variant="h6" style={{ textAlign: "center" }}>
          Incorrect! Answer was: "{guessWord?.lang2Word}". Continuing to next
          word...
        </Typography>
      ) : null}
    </>
  );
};
