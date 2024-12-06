import { Button, Card, Grid } from "@mui/material";
import { GuessWordTitle } from "./GuessWordTitle";
import { TestOption, TestSettings, TestState, TestWord } from "./types";
import { randomIntFromInterval, shuffle } from "../../util/helpers";
import { useEffect, useState } from "react";

interface SelectAnswerCardProps {
  testState: TestState | undefined;
  guessWord: TestWord;
  testOption: TestOption;
  wordsLeft: number;
  settings: TestSettings;
  testWords: TestWord[] | undefined;
  onChooseOption: (value: string) => void;
}

export const SelectAnswerCard = (props: SelectAnswerCardProps) => {
  const {
    guessWord,
    testOption,
    testState,
    wordsLeft,
    settings,
    testWords,
    onChooseOption,
  } = props;

  const [multiSelectGuessOptions, setMultiSelectGuessOptions] = useState<
    string[]
  >([]);

  const chooseMultiselectGuessOptions = () => {
    if (wordsLeft === 0) {
      return;
    }
    // console.log("chooseMultiselectGuessOptions()");
    var guessOptions: string[] = [];
    guessOptions.push(guessWord?.lang2Word!);

    for (var i = 0; i < settings.multiSelectChoicesAmount - 1; i++) {
      let index = randomIntFromInterval(0, testWords!.length - 1);
      let gWord = testWords![index];
      while (gWord === guessWord) {
        index = randomIntFromInterval(0, testWords!.length - 1);
        gWord = testWords![index];
      }
      guessOptions.push(gWord.lang2Word);
    }

    shuffle(guessOptions);
    setMultiSelectGuessOptions(guessOptions);
  };
  useEffect(() => {
    if (testWords && testWords?.length > 0 && guessWord) {
      chooseMultiselectGuessOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testWords, guessWord]);

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
                disabled={testState !== undefined}
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
