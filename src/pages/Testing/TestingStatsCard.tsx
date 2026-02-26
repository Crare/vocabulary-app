import { Box, Card, Chip, LinearProgress, Typography } from "@mui/material";
import { TestSettings } from "./types";
import { TimeTaken } from "../../components/TimeTaken";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface TestingStatsCardProps {
    settings: TestSettings;
    wordsLeft: number;
}

export const TestingStatsCard = (props: TestingStatsCardProps) => {
    const { settings, wordsLeft } = props;
    const total = settings.languageSet.language1Words.length;
    const done = total - wordsLeft;
    const progress = total > 0 ? (done / total) * 100 : 0;

    return (
        <Card sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Typography variant="h3">Testing</Typography>
                <Chip
                    icon={<AccessTimeIcon />}
                    label={<TimeTaken />}
                    variant="outlined"
                    size="small"
                />
            </Box>
            <Box sx={{ mb: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Progress: {done} / {total} words
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {wordsLeft} remaining
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(79, 70, 229, 0.1)",
                        "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            background:
                                "linear-gradient(90deg, #4f46e5, #7c3aed)",
                        },
                    }}
                />
            </Box>
        </Card>
    );
};
