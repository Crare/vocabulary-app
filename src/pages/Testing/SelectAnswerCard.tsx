import { Button, Card, Grid } from "@mui/material";
import { GuessWordTitle } from "./GuessWordTitle";
import { TestOption, TestWord } from "./types";

interface SelectAnswerCardProps {
  guessWord: TestWord;
  testOption: TestOption;
  multiSelectGuessOptions: string[];
  checkedAnswer: boolean;
  success: boolean;
  failed: boolean;
  onChooseOption: (value: string) => void;
}

export const SelectAnswerCard = (props: SelectAnswerCardProps) => {
  const {
    guessWord,
    testOption,
    multiSelectGuessOptions,
    checkedAnswer,
    success,
    failed,
    onChooseOption,
  } = props;

  return (
    <Card style={{ padding: 20 }}>
      <GuessWordTitle guessWord={guessWord} testOption={testOption} />
      <Grid
        container
        flexDirection={"row"}
        gap={2}
        justifyContent={"space-evenly"}
      >
        {multiSelectGuessOptions.map((option, index) => {
          return (
            <div key={index} style={{ margin: 8 }}>
              <Button
                variant="contained"
                onClick={() => onChooseOption(option)}
                style={{ fontSize: 20 }}
                disabled={success || failed || checkedAnswer}
              >
                {option}
              </Button>
            </div>
          );
        })}
      </Grid>
    </Card>
  );
};
