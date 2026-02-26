import {
    AppBar,
    Box,
    IconButton,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../../ThemeContext";
import { colors, alpha, gradients } from "../../colors";

export type NavView = "wordlists" | "settings" | "history";

interface HeaderProps {
    activeTab: NavView | null;
    onNavigate: (view: NavView) => void;
}

export const Header = ({ activeTab, onNavigate }: HeaderProps) => {
    const { mode, toggleMode } = useThemeMode();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background:
                    mode === "dark" ? gradients.brandDark : gradients.brand,
                borderRadius: 3,
                mb: 3,
            }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <AutoStoriesIcon sx={{ color: alpha.white90, mr: 1 }} />
                <Typography
                    variant="h5"
                    fontWeight={700}
                    onClick={() => onNavigate("wordlists")}
                    sx={{
                        color: colors.white,
                        flexGrow: 1,
                        letterSpacing: 0.5,
                        cursor: "pointer",
                    }}
                >
                    Vocabulary Trainer
                </Typography>
                <Box>
                    <Tabs
                        value={activeTab ?? false}
                        onChange={(_e, val: NavView) => onNavigate(val)}
                        textColor="inherit"
                        TabIndicatorProps={{
                            style: {
                                background: colors.white,
                                height: 3,
                                borderRadius: 2,
                            },
                        }}
                    >
                        <Tab
                            value="wordlists"
                            label="Word Lists"
                            icon={<MenuBookIcon />}
                            iconPosition="start"
                            sx={{
                                color: alpha.white85,
                                "&.Mui-selected": { color: colors.white },
                                minHeight: 48,
                                fontSize: "0.8rem",
                            }}
                        />
                        <Tab
                            value="history"
                            label="History"
                            icon={<HistoryIcon />}
                            iconPosition="start"
                            sx={{
                                color: alpha.white85,
                                "&.Mui-selected": { color: colors.white },
                                minHeight: 48,
                                fontSize: "0.8rem",
                            }}
                        />
                        <Tab
                            value="settings"
                            label="Settings"
                            icon={<SettingsIcon />}
                            iconPosition="start"
                            sx={{
                                color: alpha.white85,
                                "&.Mui-selected": { color: colors.white },
                                minHeight: 48,
                                fontSize: "0.8rem",
                            }}
                        />
                    </Tabs>
                </Box>
                <IconButton
                    onClick={toggleMode}
                    sx={{ color: alpha.white85, ml: 1 }}
                    aria-label="Toggle dark mode"
                >
                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
