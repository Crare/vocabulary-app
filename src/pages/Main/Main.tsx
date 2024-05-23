import { useState } from "react";
import "./Main.css";
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  Radio,
  RadioGroup,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Header } from "./Header";

const Main = () => {
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

  const [testType, setTestType] = useState<string>("both"); // "both" | "multi-select" | "writing"

  return (
    <Grid className="container" justifyContent={"center"}>
      <Grid
        container
        p={2}
        flexDirection={"row"}
        xs={12}
        md={8}
        justifyContent={"center"}
      >
        <Header />

        <Grid
          container
          className="content"
          xs={12}
          gap={2}
          flexDirection={"column"}
        >
          <Card style={{ padding: 20 }}>
            <Typography variant="h3" m={2} textAlign={"center"}>
              Values
            </Typography>

            <Grid
              container
              flexDirection={"row"}
              gap={2}
              justifyContent={"space-evenly"}
            >
              <Grid item xs={12} sm={5}>
                <Typography variant="h5">Add words in your language</Typography>
                <TextareaAutosize
                  style={{ width: "100%" }}
                  minRows={10}
                  value={language1Words}
                  onChange={(e) => setLanguage1Words(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography variant="h5">
                  Add words in another language
                </Typography>
                <TextareaAutosize
                  style={{ width: "100%" }}
                  minRows={10}
                  value={language2Words}
                  onChange={(e) => setLanguage2Words(e.target.value)}
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
                  Amount of times needed word needs to be get correct.
                </Typography>
                <Input
                  type="number"
                  style={{ width: "100%" }}
                  value={wordNeedsToGetCorrectTimes}
                  onChange={(e) =>
                    setWordNeedsToGetCorrectTimes(parseInt(e.target.value))
                  }
                />
                <Typography variant="h5">
                  Amount of choices shown in multi-select test
                </Typography>
                <Input
                  type="number"
                  style={{ width: "100%" }}
                  value={multiSelectChoicesAmount}
                  onChange={(e) =>
                    setMultiSelectChoicesAmount(parseInt(e.target.value))
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
                  onChange={(e) => setTestType(e.target.value)}
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
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;

