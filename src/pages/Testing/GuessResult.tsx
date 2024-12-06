import { Typography } from "@mui/material";
import { TestWord } from "./types";

interface GuessResultProps {
  success: boolean;
  failed: boolean;
  guessWord: TestWord | undefined;
}

export const GuessResult = (props: GuessResultProps) => {
  const { success, failed, guessWord } = props;
  return (
    <>
      {success ? (
        <Typography color="green" variant="h6" style={{ textAlign: "center" }}>
          Correct! Answer was: "{guessWord?.lang2Word}". Continuing to next
          word...
        </Typography>
      ) : null}
      {failed ? (
        <Typography color="red" variant="h6" style={{ textAlign: "center" }}>
          Incorrect! Answer was: "{guessWord?.lang2Word}". Continuing to next
          word...
        </Typography>
      ) : null}
    </>
  );
};
