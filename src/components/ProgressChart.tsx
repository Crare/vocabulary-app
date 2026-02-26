import { Box, Typography, useTheme } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { HistoryEntry } from "../pages/Testing/types";
import { calculateTotalScore } from "../pages/Results/resultUtils";

interface ProgressChartProps {
    /** History entries for a single language set, ordered newest first. */
    entries: HistoryEntry[];
}

/**
 * Line chart showing accuracy % over time for a language set.
 */
export const ProgressChart = ({ entries }: ProgressChartProps) => {
    const theme = useTheme();

    if (entries.length < 2) return null;

    // Reverse so oldest is first (left side of chart)
    const data = [...entries].reverse().map((e, i) => {
        const { correct, total } = calculateTotalScore(e.wordResults);
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const d = new Date(e.date);
        return {
            index: i + 1,
            label: d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            }),
            Accuracy: accuracy,
        };
    });

    return (
        <Box sx={{ width: "100%", mt: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
                Accuracy over time
            </Typography>
            <ResponsiveContainer width="100%" height={180}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                    />
                    <XAxis
                        dataKey="label"
                        tick={{
                            fontSize: 11,
                            fill: theme.palette.text.secondary,
                        }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{
                            fontSize: 11,
                            fill: theme.palette.text.secondary,
                        }}
                        width={35}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            color: theme.palette.text.primary,
                        }}
                        formatter={(value) => [`${value}%`, "Accuracy"]}
                    />
                    <Line
                        type="monotone"
                        dataKey="Accuracy"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: theme.palette.primary.main,
                        }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};
