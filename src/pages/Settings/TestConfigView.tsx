import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Slider,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createLogger } from "../../util/logger";

const log = createLogger("test-config");

const SETTINGS_KEY = "SETTINGS";

const DEFAULT_SETTINGS = {
  wordNeedsToGetCorrectTimes: 3,
  multiSelectChoicesAmount: 4,
  onlySecondLanguageWordsTested: false,
  everySecondTestIsMultiOrWriting: false,
  sentenceTestAllWords: true,
  answerDelayMs: 1500,
  allowTypos: true,
  progressOnMistakes: false,
  testType: {
    writing: true,
    multiSelect: true,
    dragDrop: true,
    sentenceFillBlank: true,
  },
} as const;

interface PersistedSettings {
  wordNeedsToGetCorrectTimes: number;
  multiSelectChoicesAmount: number;
  onlySecondLanguageWordsTested: boolean;
  everySecondTestIsMultiOrWriting: boolean;
  sentenceTestAllWords: boolean;
  answerDelayMs: number;
  allowTypos: boolean;
  progressOnMistakes: boolean;
  testType: {
    writing: boolean;
    multiSelect: boolean;
    dragDrop: boolean;
    sentenceFillBlank: boolean;
  };
  [key: string]: unknown;
}

const loadPersistedSettings = (): Partial<PersistedSettings> => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Partial<PersistedSettings>) : {};
  } catch (err) {
    log.error("settings_load_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return {};
  }
};

const savePersistedSettings = (updates: Partial<PersistedSettings>) => {
  try {
    const existing = loadPersistedSettings();
    const merged = { ...existing, ...updates };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch (err) {
    log.error("settings_save_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const TestConfigView = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [wordNeedsToGetCorrectTimes, setWordNeedsToGetCorrectTimes] =
    useState<number>(
      () =>
        loadPersistedSettings().wordNeedsToGetCorrectTimes ??
        DEFAULT_SETTINGS.wordNeedsToGetCorrectTimes,
    );
  const [multiSelectChoicesAmount, setMultiSelectChoicesAmount] =
    useState<number>(
      () =>
        loadPersistedSettings().multiSelectChoicesAmount ??
        DEFAULT_SETTINGS.multiSelectChoicesAmount,
    );
  const [onlySecondLanguageWordsTested, setOnlySecondLanguageWordsTested] =
    useState<boolean>(
      () =>
        loadPersistedSettings().onlySecondLanguageWordsTested ??
        DEFAULT_SETTINGS.onlySecondLanguageWordsTested,
    );
  const [everySecondTestIsMultiOrWriting, setEverySecondTestIsMultiOrWriting] =
    useState<boolean>(
      () =>
        loadPersistedSettings().everySecondTestIsMultiOrWriting ??
        DEFAULT_SETTINGS.everySecondTestIsMultiOrWriting,
    );
  const loadedTestType = loadPersistedSettings().testType;
  const [writingEnabled, setWritingEnabled] = useState<boolean>(() =>
    loadedTestType && typeof loadedTestType === "object"
      ? loadedTestType.writing
      : DEFAULT_SETTINGS.testType.writing,
  );
  const [multiSelectEnabled, setMultiSelectEnabled] = useState<boolean>(() =>
    loadedTestType && typeof loadedTestType === "object"
      ? loadedTestType.multiSelect
      : DEFAULT_SETTINGS.testType.multiSelect,
  );
  const [dragDropEnabled, setDragDropEnabled] = useState<boolean>(() =>
    loadedTestType && typeof loadedTestType === "object"
      ? (loadedTestType.dragDrop ?? DEFAULT_SETTINGS.testType.dragDrop)
      : DEFAULT_SETTINGS.testType.dragDrop,
  );
  const [sentenceFillBlankEnabled, setSentenceFillBlankEnabled] =
    useState<boolean>(() =>
      loadedTestType && typeof loadedTestType === "object"
        ? (loadedTestType.sentenceFillBlank ??
          DEFAULT_SETTINGS.testType.sentenceFillBlank)
        : DEFAULT_SETTINGS.testType.sentenceFillBlank,
    );
  const [sentenceTestAllWords, setSentenceTestAllWords] = useState<boolean>(
    () =>
      loadPersistedSettings().sentenceTestAllWords ??
      DEFAULT_SETTINGS.sentenceTestAllWords,
  );
  const [answerDelayMs, setAnswerDelayMs] = useState<number>(
    () =>
      loadPersistedSettings().answerDelayMs ?? DEFAULT_SETTINGS.answerDelayMs,
  );
  const [allowTypos, setAllowTypos] = useState<boolean>(
    () => loadPersistedSettings().allowTypos ?? DEFAULT_SETTINGS.allowTypos,
  );
  const [progressOnMistakes, setProgressOnMistakes] = useState<boolean>(
    () =>
      loadPersistedSettings().progressOnMistakes ??
      DEFAULT_SETTINGS.progressOnMistakes,
  );

  const answerDelayMarks = isMobile
    ? [
        { value: -1, label: "Manual" },
        { value: 0, label: "" },
        { value: 500, label: "" },
        { value: 1000, label: "" },
        { value: 1500, label: "1.5s" },
        { value: 2000, label: "2s" },
        { value: 3000, label: "3s" },
        { value: 5000, label: "5s" },
      ]
    : [
        { value: -1, label: "Manual" },
        { value: 0, label: "" },
        { value: 500, label: "0.5s" },
        { value: 1000, label: "1s" },
        { value: 1500, label: "1.5s" },
        { value: 2000, label: "2s" },
        { value: 3000, label: "3s" },
        { value: 5000, label: "5s" },
      ];

  const resetToDefaults = () => {
    setWordNeedsToGetCorrectTimes(DEFAULT_SETTINGS.wordNeedsToGetCorrectTimes);
    setMultiSelectChoicesAmount(DEFAULT_SETTINGS.multiSelectChoicesAmount);
    setOnlySecondLanguageWordsTested(
      DEFAULT_SETTINGS.onlySecondLanguageWordsTested,
    );
    setEverySecondTestIsMultiOrWriting(
      DEFAULT_SETTINGS.everySecondTestIsMultiOrWriting,
    );
    setSentenceTestAllWords(DEFAULT_SETTINGS.sentenceTestAllWords);
    setAnswerDelayMs(DEFAULT_SETTINGS.answerDelayMs);
    setAllowTypos(DEFAULT_SETTINGS.allowTypos);
    setProgressOnMistakes(DEFAULT_SETTINGS.progressOnMistakes);
    setWritingEnabled(DEFAULT_SETTINGS.testType.writing);
    setMultiSelectEnabled(DEFAULT_SETTINGS.testType.multiSelect);
    setDragDropEnabled(DEFAULT_SETTINGS.testType.dragDrop);
    setSentenceFillBlankEnabled(DEFAULT_SETTINGS.testType.sentenceFillBlank);

    savePersistedSettings(DEFAULT_SETTINGS as Partial<PersistedSettings>);
  };

  useEffect(() => {
    savePersistedSettings({
      wordNeedsToGetCorrectTimes,
      multiSelectChoicesAmount,
      onlySecondLanguageWordsTested,
      everySecondTestIsMultiOrWriting,
      sentenceTestAllWords,
      answerDelayMs,
      allowTypos,
      progressOnMistakes,
      testType: {
        writing: writingEnabled,
        multiSelect: multiSelectEnabled,
        dragDrop: dragDropEnabled,
        sentenceFillBlank: sentenceFillBlankEnabled,
      },
    });
  }, [
    wordNeedsToGetCorrectTimes,
    multiSelectChoicesAmount,
    onlySecondLanguageWordsTested,
    everySecondTestIsMultiOrWriting,
    sentenceTestAllWords,
    answerDelayMs,
    allowTypos,
    progressOnMistakes,
    writingEnabled,
    multiSelectEnabled,
    dragDropEnabled,
    sentenceFillBlankEnabled,
  ]);

  return (
    <Grid container className="content" gap={2} flexDirection={"column"}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h3" mb={3} textAlign={"center"}>
          Settings
        </Typography>
        <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button variant="outlined" color="inherit" onClick={resetToDefaults}>
            Reset to defaults
          </Button>
        </Grid>

        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Tooltip
              title="Each word must be answered correctly this many times before it is removed from the pool"
              arrow
              placement="top"
            >
              <Typography variant="h5">
                Amount of times needed word needs to be get correct:{" "}
                {wordNeedsToGetCorrectTimes}
              </Typography>
            </Tooltip>
            <Slider
              min={1}
              max={10}
              value={wordNeedsToGetCorrectTimes}
              aria-label="Times word needs to be answered correctly"
              onChange={(_e: Event, newValue: number | number[]) =>
                setWordNeedsToGetCorrectTimes(newValue as number)
              }
            />
            <Tooltip
              title="Number of answer options shown during multi-select tests"
              arrow
              placement="top"
            >
              <Typography variant="h5">
                Amount of choices shown in multi-select test:{" "}
                {multiSelectChoicesAmount}
              </Typography>
            </Tooltip>
            <Slider
              min={2}
              max={10}
              value={multiSelectChoicesAmount}
              aria-label="Number of multi-select choices"
              onChange={(_e: Event, newValue: number | number[]) =>
                setMultiSelectChoicesAmount(newValue as number)
              }
            />

            <Tooltip
              title="How long the correct/incorrect result is displayed before the next word appears. 'Manual' requires pressing Continue."
              arrow
              placement="top"
            >
              <Typography variant="h5">
                Time to see the answer:{" "}
                {answerDelayMs === -1
                  ? "Press button"
                  : `${(answerDelayMs / 1000).toFixed(1)}s`}
              </Typography>
            </Tooltip>
            <Slider
              min={-1}
              max={5000}
              step={null}
              aria-label="Time to see the answer"
              marks={answerDelayMarks}
              value={answerDelayMs}
              onChange={(_e: Event, newValue: number | number[]) =>
                setAnswerDelayMs(newValue as number)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} gap={2}>
            <Grid mb={2}>
              <FormGroup>
                <Tooltip
                  title="When enabled, you will only be asked to translate from language 1 to language 2 (never the reverse)"
                  arrow
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={onlySecondLanguageWordsTested}
                        onChange={(e) =>
                          setOnlySecondLanguageWordsTested(e.target.checked)
                        }
                      />
                    }
                    label="Only second language words tested."
                  />
                </Tooltip>
                <Tooltip
                  title="Alternate strictly between writing and multi-select questions"
                  arrow
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={everySecondTestIsMultiOrWriting}
                        onChange={(e) =>
                          setEverySecondTestIsMultiOrWriting(e.target.checked)
                        }
                      />
                    }
                    label="Every second test contains writing and then multi-select test."
                  />
                </Tooltip>
                <Tooltip
                  title="When enabled, answers that are close but not exact (e.g. small typos, swapped or missing characters) still count as correct — but the correct spelling is shown"
                  arrow
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allowTypos}
                        onChange={(e) => setAllowTypos(e.target.checked)}
                      />
                    }
                    label="Allow small typos in writing test"
                  />
                </Tooltip>
                <Tooltip
                  title="When enabled, wrong answers still count toward completing a word — the test finishes in bounded time even if you make lots of mistakes"
                  arrow
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={progressOnMistakes}
                        onChange={(e) =>
                          setProgressOnMistakes(e.target.checked)
                        }
                      />
                    }
                    label="Progress on mistakes (faster test)"
                  />
                </Tooltip>
              </FormGroup>
            </Grid>

            <FormGroup>
              <Typography variant="subtitle2" mb={0.5}>
                Testing types
              </Typography>
              {!writingEnabled &&
                !multiSelectEnabled &&
                !dragDropEnabled &&
                !sentenceFillBlankEnabled && (
                  <Typography variant="body2" color="error.main" mb={0.5}>
                    Please select at least one testing type.
                  </Typography>
                )}
              <Tooltip
                title="Type the translation yourself — the hardest but most effective practice"
                arrow
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={writingEnabled}
                      onChange={(e) => setWritingEnabled(e.target.checked)}
                    />
                  }
                  label="Writing test"
                />
              </Tooltip>
              <Tooltip
                title="Choose the correct translation from several options"
                arrow
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={multiSelectEnabled}
                      onChange={(e) => setMultiSelectEnabled(e.target.checked)}
                    />
                  }
                  label="Multi-select test"
                />
              </Tooltip>
              <Tooltip
                title="Drag words to match them with their translations"
                arrow
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dragDropEnabled}
                      onChange={(e) => setDragDropEnabled(e.target.checked)}
                    />
                  }
                  label="Drag and drop matching test"
                />
              </Tooltip>
              <Tooltip
                title="Fill in the missing word in a sentence (requires sentences in the word set)"
                arrow
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sentenceFillBlankEnabled}
                      onChange={(e) =>
                        setSentenceFillBlankEnabled(e.target.checked)
                      }
                    />
                  }
                  label="Sentence fill-in-the-blank test"
                />
              </Tooltip>
              {sentenceFillBlankEnabled && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sentenceTestAllWords}
                      onChange={(e) =>
                        setSentenceTestAllWords(e.target.checked)
                      }
                    />
                  }
                  label="Test every word in the sentence at least once"
                  sx={{ ml: 2 }}
                />
              )}
            </FormGroup>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
