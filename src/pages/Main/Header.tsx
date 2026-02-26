import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";

export type NavView = "wordlists" | "settings" | "history";

interface HeaderProps {
    activeTab: NavView | null;
    onNavigate: (view: NavView) => void;
}

export const Header = ({ activeTab, onNavigate }: HeaderProps) => {
    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: 3,
                mb: 3,
            }}
        >
            <Toolbar sx={{ gap: 1 }}>
                <AutoStoriesIcon
                    sx={{ color: "rgba(255,255,255,0.9)", mr: 1 }}
                />
                <Typography
                    variant="h5"
                    fontWeight={700}
                    onClick={() => onNavigate("wordlists")}
                    sx={{
                        color: "#fff",
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
                                background: "#fff",
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
                                color: "rgba(255,255,255,0.75)",
                                "&.Mui-selected": { color: "#fff" },
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
                                color: "rgba(255,255,255,0.75)",
                                "&.Mui-selected": { color: "#fff" },
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
                                color: "rgba(255,255,255,0.75)",
                                "&.Mui-selected": { color: "#fff" },
                                minHeight: 48,
                                fontSize: "0.8rem",
                            }}
                        />
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
