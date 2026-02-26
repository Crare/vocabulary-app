import {
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup,
    Slider,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createLogger } from "../../util/logger";

const log = createLogger("test-config");

const SETTINGS_KEY = "SETTINGS";

interface PersistedSettings {
    wordNeedsToGetCorrectTimes: number;
    multiSelectChoicesAmount: number;
    onlySecondLanguageWordsTested: boolean;
    everySecondTestIsMultiOrWriting: boolean;
    testType: "both" | "multi-select" | "writing";
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
    const [wordNeedsToGetCorrectTimes, setWordNeedsToGetCorrectTimes] =
        useState<number>(
            () => loadPersistedSettings().wordNeedsToGetCorrectTimes ?? 3,
        );
    const [multiSelectChoicesAmount, setMultiSelectChoicesAmount] =
        useState<number>(
            () => loadPersistedSettings().multiSelectChoicesAmount ?? 4,
        );
    const [onlySecondLanguageWordsTested, setOnlySecondLanguageWordsTested] =
        useState<boolean>(
            () =>
                loadPersistedSettings().onlySecondLanguageWordsTested ?? false,
        );
    const [
        everySecondTestIsMultiOrWriting,
        setEverySecondTestIsMultiOrWriting,
    ] = useState<boolean>(
        () => loadPersistedSettings().everySecondTestIsMultiOrWriting ?? false,
    );
    const [testType, setTestType] = useState<
        "both" | "multi-select" | "writing"
    >(() => loadPersistedSettings().testType ?? "both");

    useEffect(() => {
        savePersistedSettings({
            wordNeedsToGetCorrectTimes,
            multiSelectChoicesAmount,
            onlySecondLanguageWordsTested,
            everySecondTestIsMultiOrWriting,
            testType,
        });
    }, [
        wordNeedsToGetCorrectTimes,
        multiSelectChoicesAmount,
        onlySecondLanguageWordsTested,
        everySecondTestIsMultiOrWriting,
        testType,
    ]);

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h3" mb={3} textAlign={"center"}>
                    Settings
                </Typography>

                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                >
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h5">
                            Amount of times needed word needs to be get correct:{" "}
                            {wordNeedsToGetCorrectTimes}
                        </Typography>
                        <Slider
                            min={1}
                            max={10}
                            value={wordNeedsToGetCorrectTimes}
                            onChange={(
                                _e: Event,
                                newValue: number | number[],
                            ) =>
                                setWordNeedsToGetCorrectTimes(
                                    newValue as number,
                                )
                            }
                        />
                        <Typography variant="h5">
                            Amount of choices shown in multi-select test:{" "}
                            {multiSelectChoicesAmount}
                        </Typography>
                        <Slider
                            min={2}
                            max={10}
                            value={multiSelectChoicesAmount}
                            onChange={(
                                _e: Event,
                                newValue: number | number[],
                            ) =>
                                setMultiSelectChoicesAmount(newValue as number)
                            }
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }} gap={2}>
                        <Grid mb={2}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                onlySecondLanguageWordsTested
                                            }
                                            onChange={(e) =>
                                                setOnlySecondLanguageWordsTested(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Only second language words tested."
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                everySecondTestIsMultiOrWriting
                                            }
                                            onChange={(e) =>
                                                setEverySecondTestIsMultiOrWriting(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="Every second test contains writing and then multi-select test."
                                />
                            </FormGroup>
                        </Grid>

                        <RadioGroup
                            defaultValue="both"
                            name="test-type-radio"
                            value={testType}
                            onChange={(e) =>
                                setTestType(
                                    e.target.value as
                                        | "both"
                                        | "multi-select"
                                        | "writing",
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
        </Grid>
    );
};
