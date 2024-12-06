import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { TestSettings } from "./types";
import { useState } from "react";

import fi_set1 from "../../wordsets/set1/fi.json";
import sv_set1 from "../../wordsets/set1/sv.json";

const placeholderYourLang = fi_set1.join("\n");
const placeholderOtherLang = sv_set1.join("\n");

interface SettingsViewProps {
  onStartTest: (settings: TestSettings) => void;
}

export const SettingsView = (props: SettingsViewProps) => {
  const { onStartTest } = props;

  const [wordNeedsToGetCorrectTimes, setWordNeedsToGetCorrectTimes] =
    useState<number>(3);
  const [multiSelectChoicesAmount, setMultiSelectChoicesAmount] =
    useState<number>(3);

  const [onlySecondLanguageWordsTested, setOnlySecondLanguageWordsTested] =
    useState<boolean>(false);
  const [everySecondTestIsMultiOrWriting, setEverySecondTestIsMultiOrWriting] =
    useState<boolean>(false);

  const [language1Words, setLanguage1Words] = useState<string>("");
  const [language2Words, setLanguage2Words] = useState<string>("");

  const [testType, setTestType] = useState<"both" | "multi-select" | "writing">(
    "both"
  );

  const useExample = () => {
    setLanguage1Words(placeholderYourLang);
    setLanguage2Words(placeholderOtherLang);
  };

  const clear = () => {
    setLanguage1Words("");
    setLanguage2Words("");
  };

  const startTest = () => {
    const settings: TestSettings = {
      language1Words: language1Words.split("\n"),
      language2Words: language2Words.split("\n"),
      wordNeedsToGetCorrectTimes: wordNeedsToGetCorrectTimes,
      multiSelectChoicesAmount: multiSelectChoicesAmount,
      onlySecondLanguageWordsTested: onlySecondLanguageWordsTested,
      everySecondTestIsMultiOrWriting: everySecondTestIsMultiOrWriting,
      testType: testType,
    };
    onStartTest(settings);
  };

  return (
    <Grid
      container
      className="content"
      xs={12}
      gap={2}
      flexDirection={"column"}
    >
      <Card style={{ padding: 20 }}>
        <Typography variant="h3" m={2} textAlign={"center"}>
          Settings
        </Typography>

        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          <Grid
            item
            xs={12}
            ml={6}
            mr={6}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <div>
              <Button type="button" variant="contained" onClick={useExample}>
                Use example
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                type="button"
                variant="contained"
                onClick={clear}
              >
                clear
              </Button>
            </div>

            <div>
              {language1Words.length === 0 || language2Words.length === 0 ? (
                <Typography variant="caption" color={"red"} marginRight={2}>
                  Please add words in both fiels first.
                </Typography>
              ) : null}
              <Button
                type="button"
                variant="contained"
                style={{ justifySelf: "flex-end" }}
                onClick={startTest}
                disabled={
                  language1Words.length === 0 || language2Words.length === 0
                }
              >
                Start!
              </Button>
            </div>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Typography variant="h5">Add words in your language</Typography>
            <TextareaAutosize
              style={{ width: "100%" }}
              minRows={10}
              value={language1Words}
              onChange={(e) => setLanguage1Words(e.target.value)}
              placeholder={placeholderYourLang}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography variant="h5">Add words in another language</Typography>
            <TextareaAutosize
              style={{ width: "100%" }}
              minRows={10}
              value={language2Words}
              onChange={(e) => setLanguage2Words(e.target.value)}
              placeholder={placeholderOtherLang}
            />
          </Grid>
        </Grid>
      </Card>

      <Card style={{ padding: 25 }}>
        <Typography variant="h3" m={2} textAlign={"center"}>
          Settings
        </Typography>

        <Grid
          container
          flexDirection={"row"}
          gap={2}
          justifyContent={"space-evenly"}
        >
          <Grid item xs={12} md={5}>
            <Typography variant="h5">
              Amount of times needed word needs to be get correct:{" "}
              {wordNeedsToGetCorrectTimes}
            </Typography>
            <Slider
              min={1}
              max={10}
              value={wordNeedsToGetCorrectTimes}
              onChange={(e: Event, newValue: number | number[]) =>
                setWordNeedsToGetCorrectTimes(newValue as number)
              }
            />
            <Typography variant="h5">
              Amount of choices shown in multi-select test:{" "}
              {multiSelectChoicesAmount}
            </Typography>
            <Slider
              min={1}
              max={10}
              value={multiSelectChoicesAmount}
              onChange={(e: Event, newValue: number | number[]) =>
                setMultiSelectChoicesAmount(newValue as number)
              }
            />
          </Grid>
          <Grid item xs={12} md={5} gap={2}>
            <Grid mb={2}>
              <FormGroup>
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
              </FormGroup>
            </Grid>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="both"
              name="radio-buttons-group"
              value={testType}
              onChange={(e) =>
                setTestType(
                  e.target.value as "both" | "multi-select" | "writing"
                )
              }
            >
              <FormControlLabel
                value="both"
                control={<Radio />}
                label="Use both: writing test and multi-select test"
              />
              <FormControlLabel
                value="writing"
                control={<Radio />}
                label="Use only writing test"
              />
              <FormControlLabel
                value="multi-select"
                control={<Radio />}
                label="Use only multi-select test"
              />
            </RadioGroup>
          </Grid>
        </Grid>
      </Card>

      <Card style={{ padding: 25 }}>
        <Typography variant="h3" m={2} textAlign={"center"}>
          Ready?
        </Typography>
        <Grid container justifyContent={"flex-end"} alignItems={"center"}>
          {language1Words.length === 0 || language2Words.length === 0 ? (
            <Typography variant="caption" color={"red"} marginRight={2}>
              Please add words in both fiels first.
            </Typography>
          ) : null}
          <Button
            type="button"
            variant="contained"
            onClick={startTest}
            disabled={
              language1Words.length === 0 || language2Words.length === 0
            }
          >
            Start!
          </Button>
        </Grid>
      </Card>
    </Grid>
  );
};
