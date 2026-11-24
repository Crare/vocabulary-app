import { Box, Chip, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { alpha } from "../../colors";

import { SentenceRow, WordStats } from "./sentenceData";

interface SentenceGroupProps {
    sentence: string;
    rows: SentenceRow[];
    wordStatsMap: Map<string, WordStats>;
    /** Smaller sizing for compact contexts (e.g. history entries) */
    compact?: boolean;
}

export const SentenceGroup = ({
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
