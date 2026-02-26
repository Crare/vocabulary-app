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
    width: "90%",
    maxWidth: 560,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    p: 4,
    outline: "none",
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
        if (language2Words.length === 0) {
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
                <Box sx={modalStyle} maxHeight={"70%"} overflow={"auto"}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h3">
                            {languageSets.length === 0
                                ? "No saved sets"
                                : "Your saved sets"}
                        </Typography>
                        <Button
                            onClick={handleLoadSetModalClose}
                            endIcon={<ClearIcon />}
                            size="small"
                        >
                            Close
                        </Button>
                    </Box>
                    {languageSets.length === 0 ? (
                        <Typography color="text.secondary">
                            You don't have any saved language sets yet.
                        </Typography>
                    ) : (
                        <Grid container flexDirection={"column"} gap={1.5}>
                            {languageSets.map((set, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: "rgba(79, 70, 229, 0.04)",
                                        border: "1px solid rgba(79, 70, 229, 0.1)",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={600}>
                                            {set.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {set.language1Words.length} words
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() =>
                                                selectLanguageSet(index)
                                            }
                                        >
                                            Select
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                deleteLanguageSet(index)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Modal>

            <Modal
                open={isTemplateListModalOpen}
                onClose={handleTemplateListModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle} maxHeight={"70%"} overflow={"auto"}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h3">Templates</Typography>
                        <Button
                            onClick={handleTemplateListModalClose}
                            endIcon={<ClearIcon />}
                            size="small"
                        >
                            Close
                        </Button>
                    </Box>
                    <Grid container flexDirection={"column"} gap={1.5}>
                        {templates.map((template, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: "rgba(79, 70, 229, 0.04)",
                                    border: "1px solid rgba(79, 70, 229, 0.1)",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Box>
                                    <Typography fontWeight={600}>
                                        {template.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {template.words.length} words
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                        selectLanguageSetFromTemplate(index)
                                    }
                                >
                                    Select
                                </Button>
                            </Box>
                        ))}
                    </Grid>
                </Box>
            </Modal>

            <Card sx={{ p: 3 }}>
                <Typography variant="h3" mb={3} textAlign={"center"}>
                    Word Lists
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 3,
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={openLoadSetModal}
                        endIcon={<MenuOpenIcon />}
                        size="small"
                    >
                        Load set
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={openTemplateListModal}
                        endIcon={<PlaylistAddIcon />}
                        size="small"
                    >
                        Use template
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={flip}
                        endIcon={<LoopIcon />}
                        size="small"
                    >
                        Flip
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={clear}
                        endIcon={<ClearIcon />}
                        size="small"
                    >
                        Clear
                    </Button>
                </Box>

                <Typography
                    variant="body1"
                    textAlign="center"
                    mb={2}
                    color="text.secondary"
                    fontSize="0.85rem"
                >
                    Add words in two languages in the same order. One word per
                    line.
                </Typography>
                <Grid
                    container
                    flexDirection={"row"}
                    gap={2}
                    justifyContent={"space-evenly"}
                >
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Typography variant="h5" mb={1}>
                            Your language
                        </Typography>
                        <TextareaAutosize
                            style={{
                                width: "100%",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.9rem",
                                padding: 12,
                                borderRadius: 10,
                                border: "1.5px solid #e2e8f0",
                                outline: "none",
                                resize: "vertical",
                                transition: "border-color 0.2s",
                                lineHeight: 1.6,
                            }}
                            minRows={8}
                            value={language1Words}
                            onChange={(e) => setLanguage1Words(e.target.value)}
                            placeholder={placeholderYourLang}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Typography variant="h5" mb={1}>
                            Other language
                        </Typography>
                        <TextareaAutosize
                            style={{
                                width: "100%",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.9rem",
                                padding: 12,
                                borderRadius: 10,
                                border: "1.5px solid #e2e8f0",
                                outline: "none",
                                resize: "vertical",
                                transition: "border-color 0.2s",
                                lineHeight: 1.6,
                            }}
                            minRows={8}
                            value={language2Words}
                            onChange={(e) => setLanguage2Words(e.target.value)}
                            placeholder={placeholderOtherLang}
                        />
                    </Grid>
                    <Grid
                        size={12}
                        gap={1.5}
                        justifyContent={"center"}
                        alignItems={"center"}
                        display={"flex"}
                        flexWrap={"wrap"}
                    >
                        <Input
                            placeholder="Name for this set..."
                            value={langSetName}
                            onChange={(e) => setLangSetName(e.target.value)}
                            sx={{ minWidth: 200 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={saveSet}
                            endIcon={<SaveIcon />}
                            size="small"
                        >
                            Save set
                        </Button>
                    </Grid>
                </Grid>
            </Card>

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

            <Card
                sx={{
                    p: 3,
                    background:
                        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff",
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" mb={2} sx={{ color: "#fff" }}>
                    Ready?
                </Typography>
                {!languageSetIsValid && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255,255,255,0.8)",
                            mb: 2,
                        }}
                    >
                        Add the same number of words in both fields to start.
                    </Typography>
                )}
                <Button
                    variant="contained"
                    onClick={startTest}
                    disabled={!languageSetIsValid}
                    endIcon={<PlayArrowIcon />}
                    size="large"
                    sx={{
                        bgcolor: "#fff",
                        color: "#4f46e5",
                        fontWeight: 700,
                        px: 5,
                        py: 1.5,
                        fontSize: "1rem",
                        "&:hover": {
                            bgcolor: "rgba(255,255,255,0.9)",
                        },
                        "&.Mui-disabled": {
                            bgcolor: "rgba(255,255,255,0.3)",
                            color: "rgba(255,255,255,0.5)",
                        },
                    }}
                >
                    Start Test
                </Button>
            </Card>
        </Grid>
    );
};
