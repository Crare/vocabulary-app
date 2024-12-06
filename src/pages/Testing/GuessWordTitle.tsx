import { Grid, Typography } from "@mui/material";
import { TestOption, TestWord } from "./types";

interface GuessWordTitleProps {
  guessWord: TestWord | undefined;
  testOption: TestOption;
}

export const GuessWordTitle = (props: GuessWordTitleProps) => {
  const { guessWord, testOption } = props;
  return (
    <Grid
      container
      flexDirection={"row"}
      gap={2}
      justifyContent={"center"}
      mb={2}
    >
      <div style={{ textAlign: "center" }}>
        {testOption === TestOption.SelectFromMultiple ? (
          <Typography variant="body1">Select right answer:</Typography>
        ) : null}
        {testOption === TestOption.WriteCorrectAnswer ? (
          <Typography variant="body1">Write right answer:</Typography>
        ) : null}
        <Typography variant="h5" style={{ marginTop: 20, fontWeight: "bold" }}>
          {guessWord?.lang1Word}
        </Typography>
      </div>
    </Grid>
  );
};
