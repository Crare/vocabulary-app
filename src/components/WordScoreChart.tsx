import { Box, Typography, useTheme } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TestWord } from "../pages/Testing/types";

interface WordScoreChartProps {
    wordResults: TestWord[];
}

/**
 * Bar chart showing correct vs wrong answers for each word in a single test.
 */
export const WordScoreChart = ({ wordResults }: WordScoreChartProps) => {
    const theme = useTheme();

    const data = wordResults.map((w) => ({
        word:
            w.lang1Word.length > 12
                ? w.lang1Word.slice(0, 10) + "…"
                : w.lang1Word,
        Correct: w.timesCorrect,
        Wrong: w.timesFailed + w.timesSkipped + w.timesCheckedAnswer,
    }));

    return (
        <Box sx={{ width: "100%", mt: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
                Answers per word
            </Typography>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                    />
                    <XAxis
                        dataKey="word"
                        tick={{
                            fontSize: 11,
                            fill: theme.palette.text.secondary,
                        }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{
                            fontSize: 11,
                            fill: theme.palette.text.secondary,
                        }}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            color: theme.palette.text.primary,
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                        dataKey="Correct"
                        fill={theme.palette.success.main}
                        radius={[3, 3, 0, 0]}
                    />
                    <Bar
                        dataKey="Wrong"
                        fill={theme.palette.error.main}
                        radius={[3, 3, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};
