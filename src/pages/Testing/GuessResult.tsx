import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TestState, TestWord } from "./types";
import { GuessDirection, getExpectedAnswer } from "./testLogic";

interface GuessResultProps {
    testState: TestState | undefined;
    guessWord: TestWord | undefined;
    guessDirection?: GuessDirection;
}

export const GuessResult = (props: GuessResultProps) => {
    const { testState, guessWord, guessDirection = "lang1to2" } = props;

    if (testState !== TestState.Success && testState !== TestState.Failed) {
        return null;
    }

    const isSuccess = testState === TestState.Success;
    const answer = guessWord
        ? getExpectedAnswer(guessWord, guessDirection)
        : "";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                py: 2,
                px: 3,
                borderRadius: 3,
                bgcolor: isSuccess
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                border: `1.5px solid ${isSuccess ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                animation: "fadeIn 0.3s ease",
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-8px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {isSuccess ? (
                <CheckCircleOutlineIcon
                    sx={{ color: "success.main", fontSize: 28 }}
                />
            ) : (
                <HighlightOffIcon sx={{ color: "error.main", fontSize: 28 }} />
            )}
            <Typography
                variant="h6"
                sx={{
                    color: isSuccess ? "success.dark" : "error.dark",
                    fontWeight: 600,
                    fontSize: "1rem",
                }}
            >
                {isSuccess ? "Correct!" : "Incorrect!"} Answer:{" "}
                <strong>"{answer}"</strong>
            </Typography>
        </Box>
    );
};
