// ─── Raw palette ──────────────────────────────────────────
export const colors = {
    // Primary (Indigo)
    indigo50: "#f0f4ff",
    indigo100: "#e0e7ff",
    indigo200: "#c7d2fe",
    indigo300: "#a5b4fc",
    indigo400: "#818cf8",
    indigo600: "#4f46e5",
    indigo800: "#3730a3",

    // Accent (Violet)
    violet600: "#7c3aed",

    // Dark-mode brand
    deepIndigo: "#272060",
    deepPurple: "#3b1870",

    // Secondary (Amber)
    amber400: "#fbbf24",
    amber500: "#f59e0b",
    amber600: "#d97706",

    // Success (Emerald)
    emerald400: "#34d399",
    emerald500: "#10b981",
    emerald600: "#059669",

    // Error (Red)
    red400: "#f87171",
    red500: "#ef4444",
    red600: "#dc2626",

    // Neutrals (Slate)
    slate200: "#e2e8f0",
    slate400: "#94a3b8",
    slate500: "#64748b",
    slate800: "#1e293b",
    slate900: "#0f172a",

    // Pink
    pink50: "#fdf2f8",

    // Base
    white: "#ffffff",
} as const;

// ─── Alpha variants ──────────────────────────────────────
export const alpha = {
    // Primary (indigo 600 = rgb(79, 70, 229))
    primary04: "rgba(79, 70, 229, 0.04)",
    primary08: "rgba(79, 70, 229, 0.08)",
    primary10: "rgba(79, 70, 229, 0.1)",
    primary15: "rgba(79, 70, 229, 0.15)",
    primary20: "rgba(79, 70, 229, 0.2)",
    primary30: "rgba(79, 70, 229, 0.3)",

    // Slate (rgb(148, 163, 184))
    slate10: "rgba(148, 163, 184, 0.1)",
    slate15: "rgba(148, 163, 184, 0.15)",
    slate25: "rgba(148, 163, 184, 0.25)",
    slate30: "rgba(148, 163, 184, 0.3)",

    // Success (emerald 500 = rgb(16, 185, 129))
    success10: "rgba(16, 185, 129, 0.1)",
    success30: "rgba(16, 185, 129, 0.3)",

    // Error (red 500 = rgb(239, 68, 68))
    error10: "rgba(239, 68, 68, 0.1)",
    error30: "rgba(239, 68, 68, 0.3)",

    // Black
    black03: "rgba(0, 0, 0, 0.03)",
    black04: "rgba(0, 0, 0, 0.04)",
    black06: "rgba(0, 0, 0, 0.06)",
    black15: "rgba(0, 0, 0, 0.15)",

    // White
    white30: "rgba(255, 255, 255, 0.3)",
    white50: "rgba(255, 255, 255, 0.5)",
    white75: "rgba(255, 255, 255, 0.75)",
    white80: "rgba(255, 255, 255, 0.8)",
    white85: "rgba(255, 255, 255, 0.85)",
    white90: "rgba(255, 255, 255, 0.9)",
} as const;

// ─── Gradients ────────────────────────────────────────────
export const gradients = {
    brand: `linear-gradient(90deg, ${colors.indigo600} 0%, ${colors.violet600} 100%)`,
    brandDark: `linear-gradient(90deg, ${colors.deepIndigo} 0%, ${colors.deepPurple} 100%)`,
    brand135: `linear-gradient(135deg, ${colors.indigo600} 0%, ${colors.violet600} 100%)`,
    brandDark135: `linear-gradient(135deg, ${colors.deepIndigo} 0%, ${colors.deepPurple} 100%)`,
    bodyLight: `linear-gradient(135deg, ${colors.indigo100} 0%, ${colors.indigo50} 40%, ${colors.pink50} 100%)`,
    bodyDark: `linear-gradient(135deg, ${colors.slate900} 0%, ${colors.slate800} 100%)`,
} as const;
