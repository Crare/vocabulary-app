import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    Collapse,
    Grid,
    IconButton,
    Input,
    TextareaAutosize,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LanguageSet, TestSettings } from "../Testing/types";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { colors, alpha, gradients } from "../../colors";
import ClearIcon from "@mui/icons-material/Clear";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import LoopIcon from "@mui/icons-material/Loop";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { LoadSetModal } from "./LoadSetModal";
import { TemplateListModal } from "./TemplateListModal";

import { WordSet } from "../../wordsets/types";
import { LANGUAGE_OPTIONS } from "../../wordsets/languages";
import { createLogger } from "../../util/logger";
import set1 from "../../wordsets/words1.json";
import set2 from "../../wordsets/words2.json";
import set3 from "../../wordsets/words3.json";
import set4 from "../../wordsets/words4.json";
import set5 from "../../wordsets/words5.json";
import set6 from "../../wordsets/words6.json";
import set7 from "../../wordsets/words7.json";
import set8 from "../../wordsets/words8.json";
import set9 from "../../wordsets/words9.json";

const log = createLogger("settings");
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

const storage_keys = {
    LANGUAGE_SETS: "LANGUAGE_SETS",
    SETTINGS: "SETTINGS",
};

interface PersistedSettings {
    wordNeedsToGetCorrectTimes: number;
    multiSelectChoicesAmount: number;
    onlySecondLanguageWordsTested: boolean;
    everySecondTestIsMultiOrWriting: boolean;
    sentenceTestAllWords: boolean;
    answerDelayMs: number;
    language1Words: string;
    language2Words: string;
    lang1Name: string;
    lang2Name: string;
    langSetName: string;
    testType: "both" | "multi-select" | "writing";
    language1Sentences: string;
    language2Sentences: string;
}

const loadPersistedSettings = (): Partial<PersistedSettings> => {
    try {
        const raw = localStorage.getItem(storage_keys.SETTINGS);
        const settings = raw
            ? (JSON.parse(raw) as Partial<PersistedSettings>)
            : {};
        log.debug("settings_loaded", { hasPersistedSettings: !!raw });
        return settings;
    } catch (err) {
        log.error("settings_load_failed", {
            error: err instanceof Error ? err.message : String(err),
        });
        return {};
    }
};

export const SettingsView = (props: SettingsViewProps) => {
    const { onStartTest } = props;
    const muiTheme = useTheme();
    const [showInstructions, setShowInstructions] = useState<boolean>(
        () => localStorage.getItem("HIDE_INSTRUCTIONS") !== "true",
    );

    const [language1Words, setLanguage1Words] = useState<string>(
        () => loadPersistedSettings().language1Words ?? "",
    );
    const [language2Words, setLanguage2Words] = useState<string>(
        () => loadPersistedSettings().language2Words ?? "",
    );
    const [lang1Name, setLang1Name] = useState<string>(
        () => loadPersistedSettings().lang1Name ?? "",
    );
    const [lang2Name, setLang2Name] = useState<string>(
        () => loadPersistedSettings().lang2Name ?? "",
    );
    const [language1Sentences, setLanguage1Sentences] = useState<string>(
        () => loadPersistedSettings().language1Sentences ?? "",
    );
    const [language2Sentences, setLanguage2Sentences] = useState<string>(
        () => loadPersistedSettings().language2Sentences ?? "",
    );

    const clear = () => {
        setLanguage1Words("");
        setLanguage2Words("");
        setLanguage1Sentences("");
        setLanguage2Sentences("");
    };

    const startTest = () => {
        const persisted = loadPersistedSettings();
        const languageSet: LanguageSet = {
            name: langSetName.length > 0 ? langSetName : "unnamed language set",
            language1Words: language1Words.split("\n"),
            language2Words: language2Words.split("\n"),
            language1Name: lang1Name || undefined,
            language2Name: lang2Name || undefined,
            language1Sentences: language1Sentences
                ? language1Sentences.split("\n")
                : undefined,
            language2Sentences: language2Sentences
                ? language2Sentences.split("\n")
                : undefined,
        };
        const settings: TestSettings = {
            languageSet: languageSet,
            wordNeedsToGetCorrectTimes:
                persisted.wordNeedsToGetCorrectTimes ?? 3,
            multiSelectChoicesAmount: persisted.multiSelectChoicesAmount ?? 4,
            onlySecondLanguageWordsTested:
                persisted.onlySecondLanguageWordsTested ?? false,
            everySecondTestIsMultiOrWriting:
                persisted.everySecondTestIsMultiOrWriting ?? false,
            sentenceTestAllWords: persisted.sentenceTestAllWords ?? true,
            answerDelayMs: persisted.answerDelayMs ?? 1500,
            testType:
                persisted.testType && typeof persisted.testType === "object"
                    ? {
                          writing: (persisted.testType as any).writing ?? true,
                          multiSelect:
                              (persisted.testType as any).multiSelect ?? true,
                          dragDrop:
                              (persisted.testType as any).dragDrop ?? true,
                          sentenceFillBlank:
                              (persisted.testType as any).sentenceFillBlank ??
                              true,
                      }
                    : {
                          writing: true,
                          multiSelect: true,
                          dragDrop: true,
                          sentenceFillBlank: true,
                      },
        };
        onStartTest(settings);
    };

    const flip = () => {
        const tempLang1 = language1Words;
        const tempLang2 = language2Words;
        setLanguage1Words(tempLang2);
        setLanguage2Words(tempLang1);
        const tempName1 = lang1Name;
        setLang1Name(lang2Name);
        setLang2Name(tempName1);
    };

    const downloadWordSet = (
        name: string,
        lang1: string[],
        lang2: string[],
        language1?: string,
        language2?: string,
    ) => {
        const wordSet: WordSet = {
            name,
            language1: language1 || undefined,
            language2: language2 || undefined,
            words: lang1.map((l1, i) => ({ lang1: l1, lang2: lang2[i] ?? "" })),
        };
        const blob = new Blob([JSON.stringify(wordSet, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name.replace(/[^a-z0-9]/gi, "_")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textarea1Ref = useRef<HTMLTextAreaElement>(null);
    const textarea2Ref = useRef<HTMLTextAreaElement>(null);

    const syncScroll = (source: "lang1" | "lang2") => {
        const from =
            source === "lang1" ? textarea1Ref.current : textarea2Ref.current;
        const to =
            source === "lang1" ? textarea2Ref.current : textarea1Ref.current;
        if (from && to) to.scrollTop = from.scrollTop;
    };
    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(
                    event.target?.result as string,
                ) as WordSet;
                if (!parsed.name || !Array.isArray(parsed.words)) {
                    alert("Invalid file format.");
                    return;
                }
                setLangSetName(parsed.name);
                setLanguage1Words(parsed.words.map((w) => w.lang1).join("\n"));
                setLanguage2Words(parsed.words.map((w) => w.lang2).join("\n"));
                setLang1Name(parsed.language1 ?? "");
                setLang2Name(parsed.language2 ?? "");
            } catch {
                log.error("import_parse_failed", { fileName: file.name });
                alert(
                    "Could not parse file. Make sure it is a valid JSON word set.",
                );
            }
        };
        log.info("import_file_started", {
            fileName: file.name,
            fileSize: file.size,
        });
        reader.readAsText(file);
        // reset so the same file can be re-imported
        e.target.value = "";
    };

    const [langSetName, setLangSetName] = useState<string>(
        () => loadPersistedSettings().langSetName ?? "",
    );
    const [savedIndicator, setSavedIndicator] = useState(false);
    const saveSet = () => {
        const languageSet: LanguageSet = {
            name: langSetName.length > 0 ? langSetName : "unnamed language set",
            language1Words: language1Words.split("\n"),
            language2Words: language2Words.split("\n"),
            language1Name: lang1Name || undefined,
            language2Name: lang2Name || undefined,
            language1Sentences: language1Sentences
                ? language1Sentences.split("\n")
                : undefined,
            language2Sentences: language2Sentences
                ? language2Sentences.split("\n")
                : undefined,
        };
        var langSets = [...languageSets, languageSet];
        setLanguageSets([...languageSets, languageSet]);
        localStorage.setItem(
            storage_keys.LANGUAGE_SETS,
            JSON.stringify(langSets),
        );
        log.info("set_saved", {
            name: languageSet.name,
            wordCount: languageSet.language1Words.length,
            totalSets: langSets.length,
        });
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
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
        const deleted = languageSets[index];
        var newLanguageSets = languageSets.filter((set, i) => i !== index);
        setLanguageSets(newLanguageSets);
        localStorage.setItem(
            storage_keys.LANGUAGE_SETS,
            JSON.stringify(newLanguageSets),
        );
        log.info("set_deleted", {
            name: deleted?.name,
            remainingSets: newLanguageSets.length,
        });
    };

    const selectLanguageSet = (index: number) => {
        setLanguage1Words(languageSets[index].language1Words.join("\n"));
        setLanguage2Words(languageSets[index].language2Words.join("\n"));
        setLang1Name(languageSets[index].language1Name ?? "");
        setLang2Name(languageSets[index].language2Name ?? "");
        setLangSetName(languageSets[index].name);
        setLanguage1Sentences(
            languageSets[index].language1Sentences?.join("\n") ?? "",
        );
        setLanguage2Sentences(
            languageSets[index].language2Sentences?.join("\n") ?? "",
        );
        handleLoadSetModalClose();
    };

    const selectLanguageSetFromTemplate = (index: number) => {
        setLanguage1Words(
            templates[index].words.map((w) => w.lang1).join("\n"),
        );
        setLanguage2Words(
            templates[index].words.map((w) => w.lang2).join("\n"),
        );
        setLang1Name(templates[index].language1 ?? "");
        setLang2Name(templates[index].language2 ?? "");
        setLangSetName(templates[index].name);
        handleTemplateListModalClose();
    };

    const [languageSetIsValid, setLanguageSetIsValid] =
        useState<boolean>(false);
    const [hasTestType, setHasTestType] = useState<boolean>(true);
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

        // Check that at least one test type is enabled
        const persisted = loadPersistedSettings();
        const tt = persisted.testType;
        if (tt && typeof tt === "object") {
            const anyEnabled =
                (tt as any).writing ||
                (tt as any).multiSelect ||
                (tt as any).dragDrop ||
                (tt as any).sentenceFillBlank;
            setHasTestType(!!anyEnabled);
        } else {
            setHasTestType(true);
        }
    };
    useEffect(() => {
        checkLanguageSetIsValid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language1Words, language2Words]);

    // Re-check test type validity when the settings tab becomes visible
    // (test config changes are persisted to localStorage by TestConfigView)
    useEffect(() => {
        const onFocus = () => checkLanguageSetIsValid();
        window.addEventListener("focus", onFocus);
        const interval = setInterval(checkLanguageSetIsValid, 1000);
        return () => {
            window.removeEventListener("focus", onFocus);
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            const existing = loadPersistedSettings();
            const merged = {
                ...existing,
                language1Words,
                language2Words,
                lang1Name,
                lang2Name,
                langSetName,
                language1Sentences,
                language2Sentences,
            };
            localStorage.setItem(storage_keys.SETTINGS, JSON.stringify(merged));
        } catch {
            // ignore
        }
    }, [
        language1Words,
        language2Words,
        lang1Name,
        lang2Name,
        langSetName,
        language1Sentences,
        language2Sentences,
    ]);

    return (
        <Grid container className="content" gap={2} flexDirection={"column"}>
            <LoadSetModal
                open={isLoadSetModalOpen}
                onClose={handleLoadSetModalClose}
                languageSets={languageSets}
                onSelect={selectLanguageSet}
                onDownload={downloadWordSet}
                onDelete={deleteLanguageSet}
            />
            <TemplateListModal
                open={isTemplateListModalOpen}
                onClose={handleTemplateListModalClose}
                templates={templates}
                onSelect={selectLanguageSetFromTemplate}
                onDownload={downloadWordSet}
            />

            <Collapse in={showInstructions}>
                <Alert
                    severity="info"
                    icon={<HelpOutlineIcon />}
                    action={
                        <IconButton
                            aria-label="Dismiss instructions"
                            size="small"
                            onClick={() => {
                                setShowInstructions(false);
                                localStorage.setItem(
                                    "HIDE_INSTRUCTIONS",
                                    "true",
                                );
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                    sx={{ mb: 2, borderRadius: 3 }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        How to use Vocabulary Trainer
                    </Typography>
                    <Typography
                        variant="body2"
                        component="ol"
                        sx={{ pl: 2, m: 0 }}
                    >
                        <li>
                            Enter words in two languages below (one word per
                            line, same order).
                        </li>
                        <li>Or load a saved set / use a built-in template.</li>
                        <li>
                            Optionally add sentences for fill-in-the-blank
                            practice.
                        </li>
                        <li>
                            Press <strong>Start Test</strong> and practise until
                            every word is mastered!
                        </li>
                    </Typography>
                </Alert>
            </Collapse>

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
                    <Tooltip
                        title="Load a previously saved word set from local storage"
                        arrow
                    >
                        <Button
                            variant="outlined"
                            onClick={openLoadSetModal}
                            endIcon={<MenuOpenIcon />}
                            size="small"
                        >
                            Load set
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title="Pick a built-in word set template to get started quickly"
                        arrow
                    >
                        <Button
                            variant="outlined"
                            onClick={openTemplateListModal}
                            endIcon={<PlaylistAddIcon />}
                            size="small"
                        >
                            Use template
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title="Swap language 1 and language 2 columns"
                        arrow
                    >
                        <Button
                            variant="outlined"
                            onClick={flip}
                            endIcon={<LoopIcon />}
                            size="small"
                        >
                            Flip
                        </Button>
                    </Tooltip>
                    <Tooltip title="Clear all word and sentence inputs" arrow>
                        <Button
                            variant="outlined"
                            onClick={clear}
                            endIcon={<ClearIcon />}
                            size="small"
                        >
                            Clear
                        </Button>
                    </Tooltip>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleImportFile}
                        aria-label="Import word set JSON file"
                    />
                    <Tooltip title="Import a word set from a JSON file" arrow>
                        <Button
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            endIcon={<UploadFileIcon />}
                            size="small"
                        >
                            Import file
                        </Button>
                    </Tooltip>
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
                    justifyContent={"center"}
                >
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Autocomplete
                            freeSolo
                            options={LANGUAGE_OPTIONS}
                            value={lang1Name}
                            onInputChange={(_e, val) => setLang1Name(val)}
                            onChange={(_e, val) => setLang1Name(val ?? "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Your language"
                                    size="small"
                                    placeholder="e.g. 🇫🇮 Finnish"
                                    sx={{ mb: 1 }}
                                    inputProps={{
                                        ...params.inputProps,
                                        style: { textAlign: "right" },
                                    }}
                                />
                            )}
                        />
                        <TextareaAutosize
                            ref={textarea1Ref}
                            onScroll={() => syncScroll("lang1")}
                            aria-label={`Words in ${lang1Name || "language 1"}, one per line`}
                            style={{
                                width: "100%",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.9rem",
                                padding: 12,
                                borderRadius: 10,
                                border: `1.5px solid ${alpha.slate30}`,
                                backgroundColor:
                                    muiTheme.palette.background.paper,
                                color: muiTheme.palette.text.primary,
                                outline: "none",
                                resize: "vertical",
                                transition: "border-color 0.2s",
                                lineHeight: 1.6,
                                textAlign: "right",
                            }}
                            minRows={8}
                            maxRows={10}
                            value={language1Words}
                            onChange={(e) => setLanguage1Words(e.target.value)}
                            placeholder={placeholderYourLang}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <Autocomplete
                            freeSolo
                            options={LANGUAGE_OPTIONS}
                            value={lang2Name}
                            onInputChange={(_e, val) => setLang2Name(val)}
                            onChange={(_e, val) => setLang2Name(val ?? "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Other language"
                                    size="small"
                                    placeholder="e.g. 🇸🇪 Swedish"
                                    sx={{ mb: 1 }}
                                />
                            )}
                        />
                        <TextareaAutosize
                            ref={textarea2Ref}
                            onScroll={() => syncScroll("lang2")}
                            aria-label={`Words in ${lang2Name || "language 2"}, one per line`}
                            style={{
                                width: "100%",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.9rem",
                                padding: 12,
                                borderRadius: 10,
                                border: `1.5px solid ${alpha.slate30}`,
                                backgroundColor:
                                    muiTheme.palette.background.paper,
                                color: muiTheme.palette.text.primary,
                                outline: "none",
                                resize: "vertical",
                                transition: "border-color 0.2s",
                                lineHeight: 1.6,
                            }}
                            minRows={8}
                            maxRows={10}
                            value={language2Words}
                            onChange={(e) => setLanguage2Words(e.target.value)}
                            placeholder={placeholderOtherLang}
                        />
                    </Grid>

                    {/* Sentence Training Section */}
                    <Grid size={12}>
                        <Accordion
                            defaultExpanded={
                                !!(
                                    language1Sentences.trim() ||
                                    language2Sentences.trim()
                                )
                            }
                            disableGutters
                            sx={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                "&::before": { display: "none" },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    px: 1,
                                    minHeight: 36,
                                    "& .MuiAccordionSummary-content": {
                                        my: 0.5,
                                        justifyContent: "center",
                                    },
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    fontSize="0.85rem"
                                >
                                    <strong>
                                        Sentence training (optional)
                                    </strong>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pt: 0 }}>
                                <Typography
                                    variant="body2"
                                    textAlign="center"
                                    mb={1}
                                    color="text.secondary"
                                    fontSize="0.8rem"
                                >
                                    Add sentences containing each word. One
                                    sentence per line, matching the word order
                                    above.
                                </Typography>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                >
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, display: "block" }}
                                        >
                                            Sentences (
                                            {lang1Name || "Language 1"})
                                        </Typography>
                                        <TextareaAutosize
                                            style={{
                                                width: "100%",
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                                fontSize: "0.9rem",
                                                padding: 12,
                                                borderRadius: 10,
                                                border: `1.5px solid ${alpha.slate30}`,
                                                backgroundColor:
                                                    muiTheme.palette.background
                                                        .paper,
                                                color: muiTheme.palette.text
                                                    .primary,
                                                outline: "none",
                                                resize: "vertical",
                                                transition: "border-color 0.2s",
                                                lineHeight: 1.6,
                                                textAlign: "right",
                                            }}
                                            minRows={4}
                                            maxRows={8}
                                            value={language1Sentences}
                                            onChange={(e) =>
                                                setLanguage1Sentences(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={
                                                "e.g. Minä menen kouluun\nHän lukee kirjaa"
                                            }
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, display: "block" }}
                                        >
                                            Sentences (
                                            {lang2Name || "Language 2"})
                                        </Typography>
                                        <TextareaAutosize
                                            style={{
                                                width: "100%",
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                                fontSize: "0.9rem",
                                                padding: 12,
                                                borderRadius: 10,
                                                border: `1.5px solid ${alpha.slate30}`,
                                                backgroundColor:
                                                    muiTheme.palette.background
                                                        .paper,
                                                color: muiTheme.palette.text
                                                    .primary,
                                                outline: "none",
                                                resize: "vertical",
                                                transition: "border-color 0.2s",
                                                lineHeight: 1.6,
                                            }}
                                            minRows={4}
                                            maxRows={8}
                                            value={language2Sentences}
                                            onChange={(e) =>
                                                setLanguage2Sentences(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={
                                                "e.g. Jag går till skolan\nHan läser en bok"
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
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
                            aria-label="Name for this word set"
                        />
                        <Tooltip
                            title="Save this word set to local storage for later use"
                            arrow
                        >
                            <Button
                                variant="outlined"
                                onClick={saveSet}
                                endIcon={<SaveIcon />}
                                size="small"
                            >
                                Save set
                            </Button>
                        </Tooltip>
                        {savedIndicator && (
                            <Typography
                                variant="body2"
                                color="success.main"
                                fontWeight={600}
                                sx={{ ml: 0.5 }}
                            >
                                ✓ Set saved!
                            </Typography>
                        )}
                        <Tooltip
                            title="Download this word set as a JSON file you can share or import later"
                            arrow
                        >
                            <span>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        downloadWordSet(
                                            langSetName || "word-set",
                                            language1Words.split("\n"),
                                            language2Words.split("\n"),
                                            lang1Name,
                                            lang2Name,
                                        )
                                    }
                                    endIcon={<DownloadIcon />}
                                    size="small"
                                    disabled={!languageSetIsValid}
                                >
                                    Download
                                </Button>
                            </span>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Card>

            <Card
                sx={{
                    p: 3,
                    background:
                        muiTheme.palette.mode === "dark"
                            ? gradients.brandDark135
                            : gradients.brand135,
                    color: colors.white,
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" mb={2} sx={{ color: colors.white }}>
                    Ready?
                </Typography>
                {!languageSetIsValid && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: alpha.white80,
                            mb: 2,
                        }}
                    >
                        Add the same number of words in both fields to start.
                    </Typography>
                )}
                {!hasTestType && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: alpha.white80,
                            mb: 2,
                        }}
                    >
                        Select at least one testing type in settings.
                    </Typography>
                )}
                <Button
                    variant="contained"
                    onClick={startTest}
                    disabled={!languageSetIsValid || !hasTestType}
                    endIcon={<PlayArrowIcon />}
                    size="large"
                    sx={{
                        bgcolor: colors.white,
                        color: colors.indigo600,
                        fontWeight: 700,
                        px: 5,
                        py: 1.5,
                        fontSize: "1rem",
                        "&:hover": {
                            bgcolor: alpha.white90,
                        },
                        "&.Mui-disabled": {
                            bgcolor: alpha.white30,
                            color: alpha.white50,
                        },
                    }}
                >
                    Start Test
                </Button>
            </Card>
        </Grid>
    );
};
