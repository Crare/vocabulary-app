import { Box, useTheme } from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { HistoryEntry } from "../pages/Testing/types";
import { calculateTotalScore } from "../pages/Results/resultUtils";

/** How many of the most recent tests the chart shows. */
export const PROGRESS_CHART_MAX_POINTS = 10;

interface ProgressChartProps {
    /** History entries for a single language set, ordered newest first. */
    entries: HistoryEntry[];
}

export interface ProgressPoint {
    /** 1-based position, oldest first; used as the x value so same-day tests stay apart. */
    index: number;
    /** Short date for the axis and tooltip. */
    label: string;
    accuracy: number;
}

/** Last tests, oldest first, as chart points. */
export const toProgressPoints = (
    entries: HistoryEntry[],
    max = PROGRESS_CHART_MAX_POINTS,
): ProgressPoint[] =>
    entries
        .slice(0, max)
        .reverse()
        .map((e, i) => {
            const { correct, total } = calculateTotalScore(e.wordResults);
            return {
                index: i + 1,
                label: new Date(e.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                }),
                accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            };
        });

/**
 * Line chart of accuracy % over the last tests of a language set. Sized for
 * phone width: three y ticks, first and last date only, latest point labelled.
 */
export const ProgressChart = ({ entries }: ProgressChartProps) => {
    const theme = useTheme();

    if (entries.length < 2) return null;

    const data = toProgressPoints(entries);
    const first = data[0];
    const last = data[data.length - 1];
    const tick = { fontSize: 11, fill: theme.palette.text.secondary };
    const labelOf = (index: number) =>
        data.find((p) => p.index === index)?.label ?? "";

    return (
        <Box
            role="img"
            aria-label={`Accuracy for the last ${data.length} tests: ${data
                .map((p) => `${p.accuracy}%`)
                .join(", ")}`}
            sx={{ width: "100%", mt: 1 }}
        >
            <ResponsiveContainer width="100%" height={170}>
                <LineChart
                    data={data}
                    margin={{ top: 22, right: 14, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        vertical={false}
                        stroke={theme.palette.divider}
                    />
                    <XAxis
                        dataKey="index"
                        type="number"
                        domain={[first.index, last.index]}
                        ticks={[first.index, last.index]}
                        tickFormatter={(index: number) =>
                            index === last.index ? "Latest" : labelOf(index)
                        }
                        tick={tick}
                        tickLine={false}
                        axisLine={{ stroke: theme.palette.divider }}
                        padding={{ left: 8, right: 8 }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        ticks={[0, 50, 100]}
                        tick={tick}
                        tickLine={false}
                        axisLine={false}
                        width={42}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            color: theme.palette.text.primary,
                        }}
                        labelFormatter={(index) =>
                            `Test ${index} · ${labelOf(Number(index))}`
                        }
                        formatter={(value) => [`${value}%`, "Accuracy"]}
                    />
                    <Line
                        type="linear"
                        dataKey="accuracy"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{
                            r: 4,
                            fill: theme.palette.primary.main,
                            stroke: theme.palette.background.paper,
                            strokeWidth: 2,
                        }}
                        activeDot={{ r: 7 }}
                        isAnimationActive={false}
                    >
                        <LabelList
                            dataKey="accuracy"
                            position="top"
                            offset={10}
                            content={(props) => {
                                const { x, y, value, index } = props as {
                                    x?: number;
                                    y?: number;
                                    value?: number;
                                    index?: number;
                                };
                                if (index !== data.length - 1) return null;
                                return (
                                    <text
                                        x={Number(x)}
                                        y={Number(y) - 10}
                                        textAnchor="end"
                                        fontSize={12}
                                        fontWeight={700}
                                        fill={theme.palette.text.primary}
                                    >
                                        {value}%
                                    </text>
                                );
                            }}
                        />
                    </Line>
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};
