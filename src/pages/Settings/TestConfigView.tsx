import {
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
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
    sentenceTestAllWords: boolean;
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
    const defaultTestType = { writing: true, multiSelect: true };
    const loadedTestType = loadPersistedSettings().testType;
    const [writingEnabled, setWritingEnabled] = useState<boolean>(() =>
        loadedTestType && typeof loadedTestType === "object"
            ? loadedTestType.writing
            : true,
    );
    const [multiSelectEnabled, setMultiSelectEnabled] = useState<boolean>(() =>
        loadedTestType && typeof loadedTestType === "object"
            ? loadedTestType.multiSelect
            : true,
    );
    const [dragDropEnabled, setDragDropEnabled] = useState<boolean>(() =>
        loadedTestType && typeof loadedTestType === "object"
            ? (loadedTestType.dragDrop ?? true)
            : true,
    );
    const [sentenceFillBlankEnabled, setSentenceFillBlankEnabled] =
        useState<boolean>(() =>
            loadedTestType && typeof loadedTestType === "object"
                ? (loadedTestType.sentenceFillBlank ?? true)
                : true,
        );
    const [sentenceTestAllWords, setSentenceTestAllWords] = useState<boolean>(
        () => loadPersistedSettings().sentenceTestAllWords ?? true,
    );

    useEffect(() => {
        savePersistedSettings({
            wordNeedsToGetCorrectTimes,
            multiSelectChoicesAmount,
            onlySecondLanguageWordsTested,
            everySecondTestIsMultiOrWriting,
            sentenceTestAllWords,
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

                        <FormGroup>
                            <Typography variant="subtitle2" mb={0.5}>
                                Testing types
                            </Typography>
                            {!writingEnabled &&
                                !multiSelectEnabled &&
                                !dragDropEnabled &&
                                !sentenceFillBlankEnabled && (
                                    <Typography
                                        variant="body2"
                                        color="error.main"
                                        mb={0.5}
                                    >
                                        Please select at least one testing type.
                                    </Typography>
                                )}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={writingEnabled}
                                        onChange={(e) =>
                                            setWritingEnabled(e.target.checked)
                                        }
                                    />
                                }
                                label="Writing test"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={multiSelectEnabled}
                                        onChange={(e) =>
                                            setMultiSelectEnabled(
                                                e.target.checked,
                                            )
                                        }
                                    />
                                }
                                label="Multi-select test"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={dragDropEnabled}
                                        onChange={(e) =>
                                            setDragDropEnabled(e.target.checked)
                                        }
                                    />
                                }
                                label="Drag and drop matching test"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sentenceFillBlankEnabled}
                                        onChange={(e) =>
                                            setSentenceFillBlankEnabled(
                                                e.target.checked,
                                            )
                                        }
                                    />
                                }
                                label="Sentence fill-in-the-blank test"
                            />
                            {sentenceFillBlankEnabled && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sentenceTestAllWords}
                                            onChange={(e) =>
                                                setSentenceTestAllWords(
                                                    e.target.checked,
                                                )
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
