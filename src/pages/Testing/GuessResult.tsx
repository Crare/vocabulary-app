import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TestState, TestWord } from "./types";
import { GuessDirection, getExpectedAnswer } from "./testLogic";
import { alpha } from "../../colors";

interface GuessResultProps {
    testState: TestState | undefined;
    guessWord: TestWord | undefined;
    guessDirection?: GuessDirection;
}

export const GuessResult = (props: GuessResultProps) => {
    const { testState, guessWord, guessDirection = "lang1to2" } = props;

    if (testState !== TestState.Success && testState !== TestState.Failed && testState !== TestState.TypoMatch) {
        return null;
    }

    const isSuccess = testState === TestState.Success;
    const isTypo = testState === TestState.TypoMatch;
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
                py: 1.5,
                px: 3,
                borderRadius: 3,
                bgcolor: isSuccess
                    ? alpha.success10
                    : isTypo
                      ? alpha.warning10
                      : alpha.error10,
                border: `1.5px solid ${isSuccess ? alpha.success30 : isTypo ? alpha.warning30 : alpha.error30}`,
                animation: "fadeIn 0.3s ease",
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-8px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
            }}
        >
            {isSuccess ? (
                <CheckCircleOutlineIcon
                    sx={{ color: "success.main", fontSize: 24 }}
                />
            ) : isTypo ? (
                <CheckCircleOutlineIcon
                    sx={{ color: "warning.main", fontSize: 24 }}
                />
            ) : (
                <HighlightOffIcon sx={{ color: "error.main", fontSize: 24 }} />
            )}
            <Typography
                variant="body1"
                sx={{
                    color: isSuccess
                        ? "success.dark"
                        : isTypo
                          ? "warning.dark"
                          : "error.dark",
                    fontWeight: 600,
                }}
            >
                {isSuccess
                    ? "Correct!"
                    : isTypo
                      ? "Almost correct!"
                      : "Incorrect!"}
                {(isTypo || (!isSuccess && answer)) && (
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{ ml: 1, fontWeight: 400 }}
                    >
                        Correct spelling: <strong>{answer}</strong>
                    </Typography>
                )}
            </Typography>
        </Box>
    );
};
