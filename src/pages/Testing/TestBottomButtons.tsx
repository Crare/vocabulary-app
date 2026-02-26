import { Box, Button, Card, Tooltip, Typography } from "@mui/material";
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
    /** When true, show a Continue button after success/failure instead of auto-advancing */
    manualAdvance?: boolean;
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
        manualAdvance,
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
                    <Tooltip
                        title="Return to word list setup without finishing the test"
                        arrow
                    >
                        <Button
                            variant="outlined"
                            onClick={onBackToStart}
                            startIcon={<ArrowBackIcon />}
                            size="small"
                        >
                            Back to start
                        </Button>
                    </Tooltip>
                )}
                {correctAnswerValue ? (
                    <Typography variant="body2" color="text.secondary">
                        Answer:{" "}
                        <Typography
                            component="span"
                            fontWeight={700}
                            color="text.primary"
                        >
                            {correctAnswerValue}
                        </Typography>
                    </Typography>
                ) : (
                    <Tooltip
                        title="Show the correct answer (counts as a mistake)"
                        arrow
                    >
                        <span>
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
                        </span>
                    </Tooltip>
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
                {manualAdvance &&
                    (testState === TestState.Success ||
                        testState === TestState.Failed ||
                        testState === TestState.TypoMatch) && (
                        <Button
                            variant="contained"
                            onClick={onNext}
                            startIcon={<NavigateNextIcon />}
                        >
                            Continue
                        </Button>
                    )}

                <Tooltip title="Skip this word (it will come back later)" arrow>
                    <span>
                        <Button
                            variant="outlined"
                            onClick={onSkip}
                            disabled={testState !== undefined}
                            startIcon={<SkipNextIcon />}
                            size="small"
                        >
                            Skip
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title="Finish the test now and see your results" arrow>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={onEndTesting}
                        startIcon={<DoneAllIcon />}
                        size="small"
                    >
                        End test
                    </Button>
                </Tooltip>
            </Box>
        </Card>
    );
};
