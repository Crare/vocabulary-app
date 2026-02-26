import {
    Box,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Input,
    Modal,
    Radio,
    RadioGroup,
    Slider,
    TextareaAutosize,
    Typography,
} from "@mui/material";
import { LanguageSet, TestSettings } from "../Testing/types";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import LoopIcon from "@mui/icons-material/Loop";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import { WordSet } from "../../wordsets/types";
import set1 from "../../wordsets/words1.json";
import set2 from "../../wordsets/words2.json";
import set3 from "../../wordsets/words3.json";
import set4 from "../../wordsets/words4.json";
import set5 from "../../wordsets/words5.json";
import set6 from "../../wordsets/words6.json";
import set7 from "../../wordsets/words7.json";
import set8 from "../../wordsets/words8.json";
import set9 from "../../wordsets/words9.json";
const templates: WordSet[] = [
    set1,
    set2,
    set3,
    set4,
    set5,
    set6,
    set7,
    set8,
    set9,
];

const placeholderYourLang = set1.words.map((w) => w.lang1).join("\n");
const placeholderOtherLang = set1.words.map((w) => w.lang2).join("\n");

interface SettingsViewProps {
    onStartTest: (settings: TestSettings) => void;
}

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    maxWidth: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const storage_keys = {
    LANGUAGE_SETS: "LANGUAGE_SETS",
};

export const SettingsView = (props: SettingsViewProps) => {
    const { onStartTest } = props;

    const [wordNeedsToGetCorrectTimes, setWordNeedsToGetCorrectTimes] =
        useState<number>(3);
    const [multiSelectChoicesAmount, setMultiSelectChoicesAmount] =
        useState<number>(4);

    const [onlySecondLanguageWordsTested, setOnlySecondLanguageWordsTested] =
        useState<boolean>(false);
    const [
        everySecondTestIsMultiOrWriting,
        setEverySecondTestIsMultiOrWriting,
    ] = useState<boolean>(false);

    const [language1Words, setLanguage1Words] = useState<string>("");
    const [language2Words, setLanguage2Words] = useState<string>("");

    const [testType, setTestType] = useState<
        "both" | "multi-select" | "writing"
    >("both");

    const clear = () => {
        setLanguage1Words("");
        setLanguage2Words("");
    };

    const startTest = () => {
        const languageSet: LanguageSet = {
            name: langSetName.length > 0 ? langSetName : "unnamed language set",
            language1Words: language1Words.split("\n"),
            language2Words: language2Words.split("\n"),
        };
        const settings: TestSettings = {
            languageSet: languageSet,
            wordNeedsToGetCorrectTimes: wordNeedsToGetCorrectTimes,
            multiSelectChoicesAmount: multiSelectChoicesAmount,
            onlySecondLanguageWordsTested: onlySecondLanguageWordsTested,
            everySecondTestIsMultiOrWriting: everySecondTestIsMultiOrWriting,
            testType: testType,
        };
        onStartTest(settings);
    };

    const flip = () => {
        const tempLang1 = language1Words;
        const tempLang2 = language2Words;
        setLanguage1Words(tempLang2);
        setLanguage2Words(tempLang1);
    };

    // const [langSetCount, setLangSetCount] = useState<number>(0);
    const [langSetName, setLangSetName] = useState<string>("");
    const saveSet = () => {
        const languageSet: LanguageSet = {
            name: langSetName.length > 0 ? langSetName : "unnamed language set",
            language1Words: language1Words.split("\n"),
            language2Words: language2Words.split("\n"),
        };
        var langSets = [...languageSets, languageSet];
        setLanguageSets([...languageSets, languageSet]);
        setLangSetName("");
        localStorage.setItem(
            storage_keys.LANGUAGE_SETS,
            JSON.stringify(langSets),
        );
    };

    const [isLoadSetModalOpen, setLoadSetIsModalOpen] =
        useState<boolean>(false);
    const openLoadSetModal = () => {
        loadSetsFromStorage();
        setLoadSetIsModalOpen(true);
    };
    const handleLoadSetModalClose = () => {
        setLoadSetIsModalOpen(false);
    };

    const [isTemplateListModalOpen, setIsTemplateListModalOpen] =
        useState<boolean>(false);
    const openTemplateListModal = () => {
        setIsTemplateListModalOpen(true);
    };
    const handleTemplateListModalClose = () => {
        setIsTemplateListModalOpen(false);
    };

    const [languageSets, setLanguageSets] = useState<LanguageSet[]>([]);
    const loadSetsFromStorage = () => {
        const sets = localStorage.getItem(storage_keys.LANGUAGE_SETS);
        if (sets) {
            const langSets = JSON.parse(sets) as LanguageSet[];
            setLanguageSets(langSets);
        }
    };

    const deleteLanguageSet = (index: number) => {
        var newLanguageSets = languageSets.filter((set, i) => i !== index);
        setLanguageSets(newLanguageSets);
        localStorage.setItem(
            storage_keys.LANGUAGE_SETS,
            JSON.stringify(newLanguageSets),
        );
    };

    const selectLanguageSet = (index: number) => {
        setLanguage1Words(languageSets[index].language1Words.join("\n"));
        setLanguage2Words(languageSets[index].language2Words.join("\n"));
        handleLoadSetModalClose();
    };

    const selectLanguageSetFromTemplate = (index: number) => {
        setLanguage1Words(
            templates[index].words.map((w) => w.lang1).join("\n"),
        );
        setLanguage2Words(
            templates[index].words.map((w) => w.lang2).join("\n"),
        );
        handleTemplateListModalClose();
    };

    const [languageSetIsValid, setLanguageSetIsValid] =
        useState<boolean>(false);
    const checkLanguageSetIsValid = () => {
        let valid = true;
        if (language1Words.length === 0) {
            valid = false;
        }
        if (language1Words.length === 0) {
            valid = false;
        }
        if (
            language1Words.split("\n").length !==
            language2Words.split("\n").length
        ) {
            valid = false;
        }
        setLanguageSetIsValid(valid);
    };
    useEffect(() => {
        checkLanguageSetIsValid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language1Words, language2Words]);

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <Modal
                open={isLoadSetModalOpen}
                onClose={handleLoadSetModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} maxHeight={"60%"} overflow={"scroll"}>
                    <Button
                        onClick={handleLoadSetModalClose}
                        endIcon={<ClearIcon />}
                        style={{ float: "right" }}
                    >
                        Close
                    </Button>
                    {languageSets.length === 0 ? (
                        <Typography>
                            You don't have any saved language sets yet.
                        </Typography>
                    ) : (
                        <>
                            <Typography
                                id="modal-modal-title"
                                variant="h6"
                                component="h2"
                            >
                                Your saved language sets:
                            </Typography>
                            <Grid
                                container
                                flexDirection={"column"}
                                flex={1}
                                width={"100%"}
                            >
                                {languageSets.map((set, index) => {
                                    return (
                                        <Grid
                                            key={index}
                                            m={1}
                                            style={{ border: "1px solid gray" }}
                                            borderRadius={4}
                                            padding={1}
                                        >
                                            <Grid
                                                container
                                                flexDirection={"row"}
                                                flex={1}
                                                width={"100%"}
                                                justifyContent={"space-between"}
                                                gap={2}
                                            >
                                                <Typography
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {set.name}
                                                </Typography>
                                                <Typography
                                                    style={{ color: "black" }}
                                                >
                                                    (words:{" "}
                                                    {set.language1Words.length})
                                                </Typography>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 10,
                                                    }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        onClick={() =>
                                                            selectLanguageSet(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Select
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() =>
                                                            deleteLanguageSet(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </>
                    )}
                </Box>
            </Modal>

            <Modal
                open={isTemplateListModalOpen}
                onClose={handleTemplateListModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} maxHeight={"60%"} overflow={"scroll"}>
                    <Button
                        onClick={handleTemplateListModalClose}
                        endIcon={<ClearIcon />}
                        style={{ float: "right" }}
                    >
                        Close
                    </Button>

                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Templates:
                    </Typography>
                    <Grid container flexDirection={"column"} width={"100%"}>
                        {templates.map((template, index) => {
                            return (
                                <Grid
                                    key={index}
                                    m={1}
                                    style={{ border: "1px solid gray" }}
                                    borderRadius={4}
                                    padding={1}
                                >
                                    <Grid
                                        container
                                        flexDirection={"row"}
                                        flex={1}
                                        width={"100%"}
                                        justifyContent={"space-between"}
                                    >
                                        <Typography
                                            style={{ fontWeight: "bold" }}
                                        >
                                            {template.name}
                                        </Typography>
                                        <Typography style={{ color: "black" }}>
                                            (words:{" "}
                                            {
                                                template.words.map(
                                                    (w) => w.lang1,
                                                ).length
                                            }
                                            )
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                selectLanguageSetFromTemplate(
                                                    index,
                                                )
                                            }
                                        >
                                            Select
                                        </Button>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Modal>

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
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <div>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={openLoadSetModal}
                                endIcon={<MenuOpenIcon />}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                Load set
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={openTemplateListModal}
                                endIcon={<PlaylistAddIcon />}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                Use template
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={flip}
                                endIcon={<LoopIcon />}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                flip
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={clear}
                                endIcon={<ClearIcon />}
                                style={{ marginRight: 8, marginBottom: 8 }}
                            >
                                clear
                            </Button>
                        </div>
                    </Grid>

                    <Grid
                        size={{ xs: 12, sm: 5 }}
                        display={"flex"}
                        justifyContent={"flex-end"}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div>
                                <Button
                                    type="button"
                                    variant="contained"
                                    style={{
                                        justifySelf: "flex-end",
                                        marginLeft: 8,
                                        marginBottom: 8,
                                        float: "right",
                                    }}
                                    onClick={startTest}
                                    disabled={!languageSetIsValid}
                                    endIcon={<PlayArrowIcon />}
                                >
                                    Start!
                                </Button>
                            </div>
                            {!languageSetIsValid ? (
                                <Typography
                                    variant="caption"
                                    color={"red"}
                                    style={{
                                        marginLeft: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    Please add same amount of words in both
                                    fields first.
                                </Typography>
                            ) : null}
                        </div>
                    </Grid>
                </Grid>

                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                    mt={4}
                    mb={2}
                >
                    <Typography variant="body1">
                        Add words in two languages in same order and they will
                        be mappeed to each other. One word per line.
                    </Typography>
                </Grid>
                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                >
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Typography variant="h5">
                            Add words in your language
                        </Typography>
                        <TextareaAutosize
                            style={{ width: "100%" }}
                            minRows={10}
                            value={language1Words}
                            onChange={(e) => setLanguage1Words(e.target.value)}
                            placeholder={placeholderYourLang}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Typography variant="h5">
                            Add words in another language
                        </Typography>
                        <TextareaAutosize
                            style={{ width: "100%" }}
                            minRows={10}
                            value={language2Words}
                            onChange={(e) => setLanguage2Words(e.target.value)}
                            placeholder={placeholderOtherLang}
                        />
                    </Grid>
                    <Grid
                        size={12}
                        mr={6}
                        gap={2}
                        justifyContent={"flex-end"}
                        // alignItems={"center"}
                        display={"flex"}
                    >
                        <Input
                            title="set name"
                            placeholder="Give name for the set..."
                            value={langSetName}
                            onChange={(e) => {
                                setLangSetName(e.target.value);
                            }}
                        />
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={saveSet}
                            endIcon={<SaveIcon />}
                        >
                            Save set for later
                        </Button>
                    </Grid>
                </Grid>
            </Card>

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
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h5">
                            Amount of times needed word needs to be get correct:{" "}
                            {wordNeedsToGetCorrectTimes}
                        </Typography>
                        <Slider
                            min={1}
                            max={10}
                            value={wordNeedsToGetCorrectTimes}
                            onChange={(e: Event, newValue: number | number[]) =>
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
                            onChange={(e: Event, newValue: number | number[]) =>
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
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="both"
                            name="radio-buttons-group"
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

            <Card style={{ padding: 20 }}>
                <Typography variant="h3" m={2} textAlign={"center"}>
                    Ready?
                </Typography>
                <Grid container flexDirection={"row"} gap={2}>
                    <Grid
                        size={12}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                            }}
                        >
                            {!languageSetIsValid ? (
                                <Typography
                                    variant="caption"
                                    color={"red"}
                                    style={{
                                        margin: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    Please add same amount of words in both
                                    fields first.
                                </Typography>
                            ) : null}
                            <div style={{ textAlign: "center" }}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    onClick={startTest}
                                    disabled={!languageSetIsValid}
                                    endIcon={<PlayArrowIcon />}
                                >
                                    Start!
                                </Button>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    );
};
