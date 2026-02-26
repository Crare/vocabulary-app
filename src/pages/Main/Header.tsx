import {
    AppBar,
    Box,
    IconButton,
    Popover,
    Slider,
    Stack,
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
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useState } from "react";
import { useThemeMode } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import { colors, alpha, gradients } from "../../colors";
import { playCorrect } from "../../util/sounds";

export type NavView = "wordlists" | "settings" | "history";

interface HeaderProps {
    activeTab: NavView | null;
    onNavigate: (view: NavView) => void;
}

export const Header = ({ activeTab, onNavigate }: HeaderProps) => {
    const { mode, toggleMode } = useThemeMode();
    const { volume, setVolume } = useSound();
    const [volumeAnchor, setVolumeAnchor] = useState<HTMLButtonElement | null>(
        null,
    );

    const VolumeIcon =
        volume === 0
            ? VolumeOffIcon
            : volume < 0.5
              ? VolumeDownIcon
              : VolumeUpIcon;

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
                    onClick={(e) => setVolumeAnchor(e.currentTarget)}
                    sx={{ color: alpha.white85, ml: 0.5 }}
                    aria-label="Volume"
                >
                    <VolumeIcon />
                </IconButton>
                <Popover
                    open={Boolean(volumeAnchor)}
                    anchorEl={volumeAnchor}
                    onClose={() => setVolumeAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    slotProps={{
                        paper: {
                            sx: { p: 2, borderRadius: 3, minWidth: 48 },
                        },
                    }}
                >
                    <Stack alignItems="center" spacing={1} sx={{ height: 140 }}>
                        <VolumeUpIcon fontSize="small" color="action" />
                        <Slider
                            orientation="vertical"
                            value={volume}
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={(_e, v) => setVolume(v as number)}
                            onChangeCommitted={(_e, v) => {
                                const val = v as number;
                                setVolume(val);
                                if (val > 0) playCorrect(val);
                            }}
                            sx={{ flex: 1 }}
                            aria-label="Volume"
                        />
                        <VolumeOffIcon fontSize="small" color="action" />
                    </Stack>
                </Popover>
                <IconButton
                    onClick={toggleMode}
                    sx={{ color: alpha.white85, ml: 0.5 }}
                    aria-label="Toggle dark mode"
                >
                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
