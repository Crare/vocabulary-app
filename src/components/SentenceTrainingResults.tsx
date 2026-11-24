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
import { alpha } from "../colors";
import { TestWord } from "../pages/Testing/types";

import { SentenceRow, WordStats, buildSentenceData } from "./sentenceResults/sentenceData";
import { SentenceGroup } from "./sentenceResults/SentenceGroup";

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
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={compact ? undefined : { minHeight: 52, px: "14px" }}
            >
                {compact ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ShortTextIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={600}>
                            Sentence Training
                        </Typography>
                        <Chip
                            label={`${correctCount}/${totalCount} (${accuracy}%)`}
                            size="small"
                            color={
                                accuracy >= 80
                                    ? "success"
                                    : accuracy >= 50
                                      ? "warning"
                                      : "error"
                            }
                        />
                    </Box>
                ) : (
                    <Typography
                        component="span"
                        sx={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "primary.main",
                        }}
                    >
                        Sentences{" "}
                        <Box
                            component="span"
                            sx={{ fontWeight: 500, color: "text.secondary" }}
                        >
                            · {correctCount} of {totalCount} right
                        </Box>
                    </Typography>
                )}
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
