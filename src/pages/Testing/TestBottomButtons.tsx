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
  const showContinue =
    testState === TestState.CheckedAnswer ||
    (manualAdvance &&
      (testState === TestState.Success ||
        testState === TestState.Failed ||
        testState === TestState.TypoMatch));

  return (
    <>
      {/* Answer + Continue in separate card above */}
      {(correctAnswerValue || showContinue) && (
        <Card
          sx={(theme) => ({
            p: 2,
            border: 2,
            borderColor: "warning.main",
            bgcolor:
              theme.palette.mode === "light"
                ? "rgba(255, 152, 0, 0.08)"
                : "rgba(255, 152, 0, 0.12)",
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {correctAnswerValue && (
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight={600}
              >
                Answer:{" "}
                <Typography
                  component="span"
                  fontWeight={800}
                  color="warning.dark"
                  fontSize="1.1rem"
                >
                  {correctAnswerValue}
                </Typography>
              </Typography>
            )}
            {showContinue && (
              <Button
                variant="contained"
                onClick={onNext}
                startIcon={<NavigateNextIcon />}
              >
                Continue
              </Button>
            )}
          </Box>
        </Card>
      )}

      {/* Bottom buttons card */}
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Reveal answer / back to start */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
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
            {!correctAnswerValue && (
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
          </Box>

          {/* Center: Skip */}
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

          {/* Right: End test */}
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
    </>
  );
};
