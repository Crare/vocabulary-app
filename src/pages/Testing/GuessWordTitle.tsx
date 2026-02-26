import { Box, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { TestOption, TestWord } from "./types";
import { GuessDirection, getDisplayWord } from "./testLogic";

interface GuessWordTitleProps {
    guessWord: TestWord | undefined;
    testOption: TestOption;
    guessDirection?: GuessDirection;
}

export const GuessWordTitle = (props: GuessWordTitleProps) => {
    const { guessWord, testOption, guessDirection = "lang1to2" } = props;
    const displayWord = guessWord
        ? getDisplayWord(guessWord, guessDirection)
        : "";
    return (
        <Box sx={{ textAlign: "center", mb: 3 }}>
            <Chip
                icon={
                    testOption === TestOption.WriteCorrectAnswer ? (
                        <EditIcon />
                    ) : (
                        <TouchAppIcon />
                    )
                }
                label={
                    testOption === TestOption.SelectFromMultiple
                        ? "Select the correct answer"
                        : "Write the correct answer"
                }
                variant="outlined"
                size="small"
                sx={{ mb: 2, color: "text.secondary" }}
            />
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    color: "text.primary",
                    letterSpacing: "-0.01em",
                }}
            >
                {displayWord}
            </Typography>
        </Box>
    );
};
