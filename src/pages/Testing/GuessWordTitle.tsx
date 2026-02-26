import { Box, Chip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { TestOption, TestWord } from "./types";

interface GuessWordTitleProps {
    guessWord: TestWord | undefined;
    testOption: TestOption;
}

export const GuessWordTitle = (props: GuessWordTitleProps) => {
    const { guessWord, testOption } = props;
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
                {guessWord?.lang1Word}
            </Typography>
        </Box>
    );
};
