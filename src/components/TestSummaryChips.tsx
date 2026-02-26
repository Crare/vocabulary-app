import { Box, Chip } from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
    formatSeconds,
    calculateOverallAvgTime,
} from "../pages/Results/resultUtils";
import { TestWord } from "../pages/Testing/types";

interface TestSummaryChipsProps {
    wordResults: TestWord[];
    timeTaken: string;
    /** Show score chip (correct/total) — used in history view */
    score?: { correct: number; total: number };
}

export const TestSummaryChips = ({
    wordResults,
    timeTaken,
    score,
}: TestSummaryChipsProps) => (
    <Box
        sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
        }}
    >
        <Chip
            icon={<FormatListNumberedIcon />}
            label={`${wordResults.length} words`}
            size="small"
            variant="outlined"
        />
        <Chip
            icon={<AccessTimeIcon />}
            label={timeTaken}
            size="small"
            variant="outlined"
        />
        <Chip
            icon={<AvTimerIcon />}
            label={`Avg ${formatSeconds(calculateOverallAvgTime(wordResults))}/answer`}
            size="small"
            variant="outlined"
        />
        {score && (
            <Chip
                icon={<EmojiEventsIcon />}
                label={`${score.correct}/${score.total}`}
                size="small"
                color="primary"
                variant="outlined"
            />
        )}
    </Box>
);
