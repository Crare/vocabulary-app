import { Box, Button, Card, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TestState } from "./types";

interface TestBottomButtonsProps {
    testState: TestState | undefined;
    correctAnswerValue: string | undefined;
    onCheckCorrectAnswer: () => void;
    onNext: () => void;
    onSkip: () => void;
    onEndTesting: () => void;
    onBackToStart: () => void;
    hasInteracted: boolean;
}

export const TestBottomButtons = (props: TestBottomButtonsProps) => {
    const {
        testState,
        correctAnswerValue,
        onCheckCorrectAnswer,
        onEndTesting,
        onNext,
        onSkip,
        onBackToStart,
        hasInteracted,
    } = props;
    return (
        <Card sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {!hasInteracted && (
                    <Button
                        variant="outlined"
                        onClick={onBackToStart}
                        startIcon={<ArrowBackIcon />}
                        size="small"
                    >
                        Back to start
                    </Button>
                )}
                {correctAnswerValue ? (
                    <Box
                        sx={{
                            px: 2.5,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: "rgba(79, 70, 229, 0.08)",
                            border: "1px solid rgba(79, 70, 229, 0.2)",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                        >
                            Answer:{" "}
                        </Typography>
                        <Typography fontWeight={700} component="span">
                            {correctAnswerValue}
                        </Typography>
                    </Box>
                ) : (
                    <Button
                        color="error"
                        variant="outlined"
                        onClick={onCheckCorrectAnswer}
                        disabled={testState !== undefined}
                        startIcon={<VisibilityIcon />}
                        size="small"
                    >
                        Reveal answer
                    </Button>
                )}
                {testState === TestState.CheckedAnswer && (
                    <Button
                        variant="contained"
                        onClick={onNext}
                        startIcon={<NavigateNextIcon />}
                    >
                        Continue
                    </Button>
                )}

                <Button
                    variant="outlined"
                    onClick={onSkip}
                    disabled={testState !== undefined}
                    startIcon={<SkipNextIcon />}
                    size="small"
                >
                    Skip
                </Button>
                <Button
                    color="success"
                    variant="contained"
                    onClick={onEndTesting}
                    startIcon={<DoneAllIcon />}
                    size="small"
                >
                    End test
                </Button>
            </Box>
        </Card>
    );
};
