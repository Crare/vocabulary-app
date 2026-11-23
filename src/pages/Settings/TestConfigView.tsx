import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useState } from "react";
import { colors } from "../../colors";
import { createLogger } from "../../util/logger";
import { SettingsGroup } from "../../components/settings/SettingsGroup";
import { SwitchRow } from "../../components/settings/SwitchRow";
import { StepperRow } from "../../components/settings/StepperRow";
import { ChoiceRow } from "../../components/settings/ChoiceRow";
import {
  ANSWER_DELAY_OPTIONS,
  CHOICES_RANGE,
  CORRECT_TIMES_RANGE,
  DEFAULT_TEST_CONFIG,
  TestConfig,
  TestTypes,
  answerDelayHelp,
  directionHelp,
  hasAnyTestType,
  loadTestConfig,
  saveTestConfig,
} from "./testConfig";

const log = createLogger("test-config");

const destructive = { color: colors.red600 } as const;

const QUESTION_TYPES: { key: keyof TestTypes; label: string; help: string }[] = [
  {
    key: "writing",
    label: "Writing",
    help: "Type the translation yourself. Hardest, and it sticks best.",
  },
  {
    key: "multiSelect",
    label: "Multiple choice",
    help: "Pick the right translation from a few options.",
  },
  {
    key: "dragDrop",
    label: "Matching",
    help: "Pair words with their translations by dragging or tapping.",
  },
  {
    key: "sentenceFillBlank",
    label: "Fill in the blank",
    help: "Type the missing word in a sentence. Only for lists that have sentences.",
  },
];

/** The Settings tab: how tests are run. Saves every change at once. */
export const TestConfigView = () => {
  const [config, setConfig] = useState<TestConfig>(loadTestConfig);
  const [confirmReset, setConfirmReset] = useState(false);

  const update = (changes: Partial<TestConfig>) => {
    const next = { ...config, ...changes };
    setConfig(next);
    saveTestConfig(next);
    log.info("test_config_changed", changes);
  };

  const setType = (key: keyof TestTypes, on: boolean) =>
    update({ testType: { ...config.testType, [key]: on } });

  const reset = () => {
    setConfirmReset(false);
    setConfig(DEFAULT_TEST_CONFIG);
    saveTestConfig(DEFAULT_TEST_CONFIG);
    log.info("test_config_reset");
  };

  const resetButton = (
    <Button
      onClick={() => setConfirmReset(true)}
      startIcon={<RestartAltIcon />}
      sx={{ ...destructive, minHeight: 44, px: 2, alignSelf: "center" }}
    >
      Reset all to defaults
    </Button>
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1040,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700 }}
          >
            Test settings
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
            Changes save on their own and apply to your next test.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>{resetButton}</Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-start" }}>
        <Box sx={{ flex: "1 1 360px", minWidth: 0 }}>
          <SettingsGroup title="Question types">
            {QUESTION_TYPES.map((t) =>
              t.key === "sentenceFillBlank" ? (
                <Box key={t.key}>
                  <SwitchRow
                    label={t.label}
                    help={t.help}
                    checked={config.testType[t.key]}
                    onChange={(on) => setType(t.key, on)}
                  />
                  {config.testType.sentenceFillBlank && (
                    <SwitchRow
                      nested
                      label="Ask every word in a sentence"
                      help="Each word of a sentence gets a turn as the blank."
                      checked={config.sentenceTestAllWords}
                      onChange={(on) => update({ sentenceTestAllWords: on })}
                    />
                  )}
                </Box>
              ) : (
                <SwitchRow
                  key={t.key}
                  label={t.label}
                  help={t.help}
                  checked={config.testType[t.key]}
                  onChange={(on) => setType(t.key, on)}
                />
              ),
            )}
            {!hasAnyTestType(config.testType) && (
              <Typography
                role="status"
                sx={{
                  px: 1.75,
                  py: 1.5,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  ...destructive,
                }}
              >
                Turn on at least one question type to start a test.
              </Typography>
            )}
          </SettingsGroup>
        </Box>

        <Box
          sx={{
            flex: "1 1 360px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <SettingsGroup title="How the test runs">
            <ChoiceRow
              variant="segmented"
              label="Direction"
              help={directionHelp(config.onlySecondLanguageWordsTested)}
              value={config.onlySecondLanguageWordsTested}
              options={[
                { value: false, label: "Both ways" },
                { value: true, label: "Into the new language" },
              ]}
              onChange={(v) => update({ onlySecondLanguageWordsTested: v })}
            />
            <StepperRow
              label="Right answers per word"
              help="A word is done after you get it right this many times. More means a longer test."
              unit="right answers"
              value={config.wordNeedsToGetCorrectTimes}
              {...CORRECT_TIMES_RANGE}
              onChange={(v) => update({ wordNeedsToGetCorrectTimes: v })}
            />
            <ChoiceRow
              variant="chips"
              label="Show the right answer for"
              help={answerDelayHelp(config.answerDelayMs)}
              value={config.answerDelayMs}
              options={ANSWER_DELAY_OPTIONS}
              onChange={(v) => update({ answerDelayMs: v })}
            />
          </SettingsGroup>

          <SettingsGroup title="Fine-tuning">
            <SwitchRow
              label="Forgive small typos"
              help="A near miss still counts as right, and you see the correct spelling."
              checked={config.allowTypos}
              onChange={(on) => update({ allowTypos: on })}
            />
            <SwitchRow
              label="Wrong answers count too"
              help="Every answer moves a word toward done, so the test ends sooner even with mistakes."
              checked={config.progressOnMistakes}
              onChange={(on) => update({ progressOnMistakes: on })}
            />
            <SwitchRow
              label="Take question types in turn"
              help="Question types come in a fixed order instead of at random."
              checked={config.everySecondTestIsMultiOrWriting}
              onChange={(on) => update({ everySecondTestIsMultiOrWriting: on })}
            />
            <StepperRow
              label="Options in multiple choice"
              help="How many answers you pick from. More options make it harder."
              unit="options"
              value={config.multiSelectChoicesAmount}
              {...CHOICES_RANGE}
              onChange={(v) => update({ multiSelectChoicesAmount: v })}
            />
          </SettingsGroup>
        </Box>
      </Box>

      <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}>
        {resetButton}
      </Box>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        aria-labelledby="reset-title"
      >
        <DialogTitle id="reset-title">Reset test settings?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Every test setting goes back to its default. Your word lists stay
            as they are.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmReset(false)} sx={{ minHeight: 44 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={reset}
            sx={{
              minHeight: 44,
              bgcolor: colors.red600,
              "&:hover": { bgcolor: colors.red600, filter: "brightness(0.92)" },
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
