import { createTheme } from "@mui/material/styles";
import { colors, alpha, gradients } from "./colors";

export const createAppTheme = (mode: "light" | "dark") => {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? colors.indigo400 : colors.indigo600,
                light: colors.indigo400,
                dark: colors.indigo800,
            },
            secondary: {
                main: colors.amber500,
                light: colors.amber400,
                dark: colors.amber600,
            },
            success: {
                main: colors.emerald500,
                light: colors.emerald400,
                dark: colors.emerald600,
            },
            error: {
                main: colors.red500,
                light: colors.red400,
                dark: colors.red600,
            },
            background: {
                default: isDark ? colors.slate900 : colors.indigo50,
                paper: isDark ? colors.slate800 : colors.white,
            },
            text: {
                primary: isDark ? colors.slate200 : colors.slate800,
                secondary: isDark ? colors.slate400 : colors.slate500,
            },
            divider: alpha.slate15,
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
                            ? gradients.bodyDark
                            : gradients.bodyLight,
                        backgroundAttachment: "fixed",
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
                        border: `1px solid ${alpha.slate15}`,
                        boxShadow: `0 1px 3px ${alpha.black04}, 0 4px 12px ${alpha.black03}`,
                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                        "&:hover": {
                            boxShadow: `0 4px 12px ${alpha.black06}, 0 8px 24px ${alpha.black04}`,
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
                        boxShadow: `0 2px 8px ${alpha.primary20}`,
                        "&:hover": {
                            boxShadow: `0 4px 16px ${alpha.primary30}`,
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
