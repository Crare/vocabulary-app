import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") => {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? "#818cf8" : "#4f46e5",
                light: "#818cf8",
                dark: "#3730a3",
            },
            secondary: {
                main: "#f59e0b",
                light: "#fbbf24",
                dark: "#d97706",
            },
            success: {
                main: "#10b981",
                light: "#34d399",
                dark: "#059669",
            },
            error: {
                main: "#ef4444",
                light: "#f87171",
                dark: "#dc2626",
            },
            background: {
                default: isDark ? "#0f172a" : "#f0f4ff",
                paper: isDark ? "#1e293b" : "#ffffff",
            },
            text: {
                primary: isDark ? "#e2e8f0" : "#1e293b",
                secondary: isDark ? "#94a3b8" : "#64748b",
            },
            divider: isDark
                ? "rgba(148, 163, 184, 0.15)"
                : "rgba(148, 163, 184, 0.15)",
        },
        typography: {
            fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
            h1: {
                fontSize: "2.5rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
            },
            h3: {
                fontSize: "1.5rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
            },
            h4: {
                fontSize: "1.15rem",
                fontWeight: 400,
            },
            h5: {
                fontSize: "1rem",
                fontWeight: 600,
            },
            body1: {
                fontSize: "0.95rem",
            },
            button: {
                textTransform: "none",
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background: isDark
                            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                            : "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 40%, #fdf2f8 100%)",
                        minHeight: "100vh",
                    },
                },
            },
            MuiCard: {
                defaultProps: {
                    elevation: 0,
                },
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: "1px solid rgba(148, 163, 184, 0.15)",
                        boxShadow:
                            "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                        "&:hover": {
                            boxShadow:
                                "0 4px 12px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        padding: "8px 20px",
                        fontSize: "0.9rem",
                    },
                    contained: {
                        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.2)",
                        "&:hover": {
                            boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
                        },
                    },
                    outlined: {
                        borderWidth: 1.5,
                        "&:hover": {
                            borderWidth: 1.5,
                        },
                    },
                },
            },
            MuiSlider: {
                styleOverrides: {
                    root: {
                        height: 6,
                    },
                    thumb: {
                        width: 18,
                        height: 18,
                    },
                },
            },
            MuiModal: {
                styleOverrides: {
                    root: {
                        backdropFilter: "blur(4px)",
                    },
                },
            },
            MuiInput: {
                styleOverrides: {
                    root: {
                        fontSize: "0.95rem",
                    },
                },
            },
            MuiCheckbox: {
                defaultProps: {
                    color: "primary",
                },
            },
            MuiRadio: {
                defaultProps: {
                    color: "primary",
                },
            },
        },
    });
};

const theme = createAppTheme("light");
export default theme;
