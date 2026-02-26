import { Box, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { TestOption, TestWord } from "./types";
import { GuessDirection, getDisplayWord } from "./testLogic";

interface GuessWordTitleProps {
    guessWord: TestWord | undefined;
    testOption: TestOption;
    guessDirection?: GuessDirection;
    targetLanguageName?: string;
}

export const GuessWordTitle = (props: GuessWordTitleProps) => {
    const {
        guessWord,
        testOption,
        guessDirection = "lang1to2",
        targetLanguageName,
    } = props;
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
                sx={{ mb: 1, color: "text.secondary" }}
            />
            {targetLanguageName && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5, fontSize: "0.8rem" }}
                >
                    Answer in:{" "}
                    <strong style={{ fontWeight: 600 }}>
                        {targetLanguageName}
                    </strong>
                </Typography>
            )}
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
