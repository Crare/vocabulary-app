import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShortTextIcon from "@mui/icons-material/ShortText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { alpha } from "../colors";
import { TestWord } from "../pages/Testing/types";

interface SentenceRow {
    id: number;
    word: string;
    testedWord: string;
    sentence: string;
    correct: boolean;
}

function buildSentenceData(wordResults: TestWord[]): SentenceRow[] {
    const data: SentenceRow[] = [];
    let id = 0;
    for (const w of wordResults) {
        if (w.sentenceResults) {
            for (const sr of w.sentenceResults) {
                data.push({
                    id: id++,
                    word: `${w.lang1Word} / ${w.lang2Word}`,
                    testedWord: sr.testedWord,
                    sentence: sr.sentence,
                    correct: sr.correct,
                });
            }
        }
    }
    return data;
}

/** Per-word stats across all sentence attempts */
interface WordStats {
    total: number;
    correct: number;
    failed: number;
}

interface SentenceGroupProps {
    sentence: string;
    rows: SentenceRow[];
    wordStatsMap: Map<string, WordStats>;
    /** Smaller sizing for compact contexts (e.g. history entries) */
    compact?: boolean;
}

const SentenceGroup = ({
    sentence,
    rows,
    wordStatsMap,
    compact,
}: SentenceGroupProps) => {
    const iconSize = compact ? 18 : 20;

    return (
        <Box
            sx={{
                borderRadius: compact ? 1.5 : 2,
                border: "1px solid",
                borderColor: alpha.slate15,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: compact ? 0.75 : 1,
                    px: 1.5,
                    py: compact ? 0.75 : 1,
                    bgcolor: alpha.slate10,
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                    {sentence}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    p: compact ? 0.75 : 1,
                }}
            >
                {rows.map((row) => {
                    const stats = wordStatsMap.get(
                        row.testedWord.toLowerCase(),
                    ) ?? { total: 1, correct: 0, failed: 0 };
                    return (
                        <Box
                            key={row.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1,
                                borderRadius: 1.5,
                                bgcolor: row.correct
                                    ? alpha.success05
                                    : alpha.error05,
                                border: "1px solid",
                                borderColor: row.correct
                                    ? alpha.success20
                                    : alpha.error20,
                            }}
                        >
                            {row.correct ? (
                                <CheckCircleOutlineIcon
                                    sx={{
                                        color: "success.main",
                                        fontSize: iconSize,
                                        mt: 0.2,
                                    }}
                                />
                            ) : (
                                <HighlightOffIcon
                                    sx={{
                                        color: "error.main",
                                        fontSize: iconSize,
                                        mt: 0.2,
                                    }}
                                />
                            )}
                            <Typography
                                variant="body2"
                                fontWeight={700}
                                fontSize={compact ? "0.8rem" : undefined}
                            >
                                {row.testedWord}
                            </Typography>
                            <Box
                                sx={{
                                    ml: "auto",
                                    display: "flex",
                                    gap: 0.5,
                                }}
                            >
                                <Chip
                                    label={`${stats.total}×`}
                                    size="small"
                                    variant="outlined"
                                />
                                <Chip
                                    label={`${stats.correct} ✓`}
                                    size="small"
                                    color="success"
                                />
                                <Chip
                                    label={`${stats.failed} ✗`}
                                    size="small"
                                    color="error"
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

interface SentenceTrainingResultsProps {
    wordResults: TestWord[];
    /** Use compact styling (smaller fonts, tighter spacing) */
    compact?: boolean;
    /** Extra sx for the outer Accordion */
    accordionSx?: object;
}

export const SentenceTrainingResults = ({
    wordResults,
    compact,
    accordionSx,
}: SentenceTrainingResultsProps) => {
    const sentenceData = buildSentenceData(wordResults);
    if (sentenceData.length === 0) return null;

    const correctCount = sentenceData.filter((s) => s.correct).length;
    const totalCount = sentenceData.length;
    const accuracy = Math.round((correctCount / totalCount) * 100);

    // Group by sentence
    const grouped = new Map<string, SentenceRow[]>();
    for (const row of sentenceData) {
        if (!grouped.has(row.sentence)) grouped.set(row.sentence, []);
        grouped.get(row.sentence)!.push(row);
    }

    // Aggregate per-word stats across all sentences
    const wordStatsMap = new Map<string, WordStats>();
    for (const row of sentenceData) {
        const key = row.testedWord.toLowerCase();
        const existing = wordStatsMap.get(key) ?? {
            total: 0,
            correct: 0,
            failed: 0,
        };
        existing.total++;
        if (row.correct) existing.correct++;
        else existing.failed++;
        wordStatsMap.set(key, existing);
    }

    return (
        <Accordion
            defaultExpanded={false}
            disableGutters={compact}
            elevation={compact ? 0 : undefined}
            sx={{
                borderRadius: compact ? "8px !important" : 3,
                "&:before": { display: "none" },
                ...(compact && {
                    border: 1,
                    borderColor: alpha.slate15,
                    mb: 1.5,
                }),
                ...accordionSx,
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <ShortTextIcon
                        fontSize={compact ? "small" : "medium"}
                        color="primary"
                    />
                    <Typography
                        variant={compact ? "body2" : "h5"}
                        fontWeight={compact ? 600 : undefined}
                    >
                        Sentence Training
                    </Typography>
                    <Chip
                        label={`${correctCount}/${totalCount}${compact ? "" : " correct"} (${accuracy}%)`}
                        size="small"
                        color={
                            accuracy >= 80
                                ? "success"
                                : accuracy >= 50
                                  ? "warning"
                                  : "error"
                        }
                        sx={compact ? undefined : { ml: 1 }}
                    />
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    {Array.from(grouped.entries()).map(([sentence, rows]) => (
                        <SentenceGroup
                            key={sentence}
                            sentence={sentence}
                            rows={rows}
                            wordStatsMap={wordStatsMap}
                            compact={compact}
                        />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
