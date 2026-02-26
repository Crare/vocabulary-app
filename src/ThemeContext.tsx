import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
    mode: ThemeMode;
    toggleMode: () => void;
}

const STORAGE_KEY = "THEME_MODE";

const ThemeModeContext = createContext<ThemeContextValue>({
    mode: "light",
    toggleMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

const loadMode = (): ThemeMode => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "dark" || stored === "light") return stored;
    } catch {
        // ignore
    }
    return "light";
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(loadMode);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    const toggleMode = () =>
        setMode((prev) => (prev === "light" ? "dark" : "light"));

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const value = useMemo(() => ({ mode, toggleMode }), [mode]);

    return (
        <ThemeModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
