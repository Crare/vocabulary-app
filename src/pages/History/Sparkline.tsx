import { useTheme } from "@mui/material";

interface SparklineProps {
  /** Accuracy values 0–100, oldest first. Needs at least two. */
  values: number[];
  width?: number;
  height?: number;
}

const PAD = 4;

/** Tiny line of accuracy per test, with the latest point marked. */
export const Sparkline = ({
  values,
  width = 96,
  height = 40,
}: SparklineProps) => {
  const theme = useTheme();
  if (values.length < 2) return null;

  const step = (width - PAD * 2) / (values.length - 1);
  const y = (v: number) => height - PAD - (v / 100) * (height - PAD * 2);
  const points = values.map((v, i) => [PAD + i * step, y(v)] as const);
  const d = points
    .map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");
  const [lastX, lastY] = points[points.length - 1];
  const color = theme.palette.primary.main;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Accuracy over ${values.length} tests: ${values.join("%, ")}%`}
      style={{ flex: "none", overflow: "visible" }}
    >
      <line
        x1={0}
        x2={width}
        y1={height - 2}
        y2={height - 2}
        stroke={theme.palette.divider}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r={4}
        fill={color}
        stroke={theme.palette.background.paper}
        strokeWidth={2}
      />
    </svg>
  );
};
