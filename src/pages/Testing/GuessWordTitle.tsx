import { ReactNode } from "react";
import { Card, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { TestOption, TestWord } from "./types";
import { GuessDirection, getDisplayWord } from "./testLogic";
import { colors } from "../../colors";

/** Indigo used for hints, readable in light and dark mode. */
export const hintColor = (theme: Theme) =>
  theme.palette.mode === "dark" ? colors.indigo300 : colors.indigo800;

/** White card that holds the question; grows to fill the space above the panel. */
export const QuestionCard = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <Card
    component="section"
    aria-label={label}
    sx={{
      flex: 1,
      p: { xs: 3, md: 5 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.25,
      textAlign: "center",
      "&:hover": { boxShadow: undefined },
    }}
  >
    {children}
  </Card>
);

/** Small grey line above the question saying what to do. */
export const ModeLabel = ({ children }: { children: ReactNode }) => (
  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
    {children}
  </Typography>
);

/** The word's hint in italics, in brackets; never part of the answer. */
export const Hint = ({ hint, small }: { hint?: string; small?: boolean }) =>
  hint ? (
    <Typography
      component="span"
      sx={(theme) => ({
        display: "block",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: small ? "0.8125rem" : "1rem",
        color: hintColor(theme),
      })}
    >
      ({hint})
    </Typography>
  ) : null;

interface GuessWordTitleProps {
  guessWord: TestWord | undefined;
  testOption: TestOption;
  guessDirection?: GuessDirection;
  targetLanguageName?: string;
}

/** What to do, the word to translate, and its hint under it. */
export const GuessWordTitle = ({
  guessWord,
  testOption,
  guessDirection = "lang1to2",
  targetLanguageName,
}: GuessWordTitleProps) => {
  const pick = testOption === TestOption.SelectFromMultiple;
  const mode = targetLanguageName
    ? pick
      ? `Pick the ${targetLanguageName} word`
      : `Type it in ${targetLanguageName}`
    : pick
      ? "Pick the right answer"
      : "Type the answer";
  return (
    <>
      <ModeLabel>{mode}</ModeLabel>
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
};
