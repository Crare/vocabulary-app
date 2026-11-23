import { Typography } from "@mui/material";
import { TestOption, TestWord } from "./types";
import { GuessDirection, getDisplayWord } from "./testLogic";
import { ModeLabel } from "./ModeLabel";
import { Hint } from "./Hint";

interface GuessWordTitleProps {
  guessWord: TestWord | undefined;
  testOption: TestOption;
  guessDirection?: GuessDirection;
  targetLanguageName?: string;
}

/** The instruction line for writing / multiple choice questions. */
export const modeText = (pick: boolean, targetLanguageName?: string) =>
  targetLanguageName
    ? pick
      ? `Pick the ${targetLanguageName} word`
      : `Type it in ${targetLanguageName}`
    : pick
      ? "Pick the right answer"
      : "Type the answer";

/** What to do, the word to translate, and its hint under it. */
export const GuessWordTitle = ({
  guessWord,
  testOption,
  guessDirection = "lang1to2",
  targetLanguageName,
}: GuessWordTitleProps) => (
  <>
    <ModeLabel>
      {modeText(testOption === TestOption.SelectFromMultiple, targetLanguageName)}
    </ModeLabel>
    <Typography
      variant="h4"
      component="p"
      sx={{
        m: 0,
        fontSize: { xs: "2.125rem", md: "2.75rem" },
        lineHeight: 1.15,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "text.primary",
        overflowWrap: "anywhere",
      }}
    >
      {guessWord ? getDisplayWord(guessWord, guessDirection) : ""}
    </Typography>
    <Hint hint={guessWord?.hint} />
  </>
);
