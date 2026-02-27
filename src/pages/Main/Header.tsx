import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Slider,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HistoryIcon from "@mui/icons-material/History";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import { useState } from "react";
import { useThemeMode } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import {
  useFontSize,
  FONT_MIN_SCALE,
  FONT_MAX_SCALE,
  FONT_STEP,
} from "../../FontSizeContext";
import { colors, alpha, gradients } from "../../colors";
import { playCorrect } from "../../util/sounds";

export type NavView = "wordlists" | "settings" | "history" | "credits";

interface HeaderProps {
  activeTab: NavView | null;
  onNavigate: (view: NavView) => void;
  disabled?: boolean;
}

export const Header = ({ activeTab, onNavigate, disabled }: HeaderProps) => {
  const { mode, toggleMode } = useThemeMode();
  const { volume, setVolume } = useSound();
  const {
    scale,
    setScale: setFontScale,
    increase,
    decrease,
    canIncrease,
    canDecrease,
  } = useFontSize();
  const [volumeAnchor, setVolumeAnchor] = useState<HTMLButtonElement | null>(
    null,
  );
  const [textSizeAnchor, setTextSizeAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery("(max-width: 1199px)");

  const VolumeIcon =
    volume === 0 ? VolumeOffIcon : volume < 0.5 ? VolumeDownIcon : VolumeUpIcon;

  const navItems: { value: NavView; label: string; icon: React.ReactNode }[] = [
    { value: "wordlists", label: "Word Lists", icon: <MenuBookIcon /> },
    { value: "history", label: "History", icon: <HistoryIcon /> },
    { value: "settings", label: "Settings", icon: <SettingsIcon /> },
    { value: "credits", label: "Credits", icon: <InfoOutlinedIcon /> },
  ];

  const handleNav = (view: NavView) => {
    onNavigate(view);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      component="nav"
      aria-label="Main navigation"
      sx={{
        background: mode === "dark" ? gradients.brandDark : gradients.brand,
        mb: 3,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <AutoStoriesIcon sx={{ color: alpha.white90, mr: 1 }} />
        <Typography
          variant="h5"
          fontWeight={700}
          onClick={disabled ? undefined : () => onNavigate("wordlists")}
          sx={{
            color: colors.white,
            flexGrow: 1,
            letterSpacing: 0.5,
            cursor: disabled ? "default" : "pointer",
            fontSize: "0.95rem",
            "@media (min-width: 1200px)": { fontSize: "1.5rem" },
          }}
        >
          Vocabulary Trainer
        </Typography>
        {!disabled && (
          <>
            {isMobile ? (
              /* ---- Hamburger menu for mobile ---- */
              <>
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{ color: alpha.white85 }}
                  aria-label="Open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  PaperProps={{
                    sx: { width: 240, pt: 1 },
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ px: 2, py: 1.5 }}
                  >
                    Menu
                  </Typography>
                  <Divider />
                  <List>
                    {navItems.map((item) => (
                      <ListItemButton
                        key={item.value}
                        selected={activeTab === item.value}
                        onClick={() => handleNav(item.value)}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Drawer>
              </>
            ) : (
              /* ---- Desktop tabs ---- */
              <>
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
                        "&.Mui-selected": {
                          color: colors.white,
                        },
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
                        "&.Mui-selected": {
                          color: colors.white,
                        },
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
                        "&.Mui-selected": {
                          color: colors.white,
                        },
                        minHeight: 48,
                        fontSize: "0.8rem",
                      }}
                    />
                    <Tab
                      value="credits"
                      label="Credits"
                      icon={<InfoOutlinedIcon />}
                      iconPosition="start"
                      sx={{
                        color: alpha.white85,
                        "&.Mui-selected": {
                          color: colors.white,
                        },
                        minHeight: 48,
                        fontSize: "0.8rem",
                      }}
                    />
                  </Tabs>
                </Box>
              </>
            )}
          </>
        )}
        <IconButton
          onClick={(e) => setTextSizeAnchor(e.currentTarget)}
          sx={{ color: alpha.white85, ml: 0.5 }}
          aria-label="Text size"
        >
          <FormatSizeIcon />
        </IconButton>
        <Popover
          open={Boolean(textSizeAnchor)}
          anchorEl={textSizeAnchor}
          onClose={() => setTextSizeAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          slotProps={{
            paper: {
              sx: { p: 2, borderRadius: 3, minWidth: 200 },
            },
          }}
        >
          <Stack alignItems="center" spacing={1.5}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ width: "100%" }}
            >
              <Tooltip title="Decrease text size">
                <span>
                  <IconButton
                    onClick={decrease}
                    disabled={!canDecrease}
                    size="small"
                    aria-label="Decrease text size"
                  >
                    <TextDecreaseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Slider
                value={scale}
                min={FONT_MIN_SCALE}
                max={FONT_MAX_SCALE}
                step={FONT_STEP}
                onChange={(_e, v) => setFontScale(v as number)}
                sx={{ flex: 1 }}
                aria-label="Text size"
              />
              <Tooltip title="Increase text size">
                <span>
                  <IconButton
                    onClick={increase}
                    disabled={!canIncrease}
                    size="small"
                    aria-label="Increase text size"
                  >
                    <TextIncreaseIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ fontSize: `${scale}rem`, lineHeight: 1.4 }}
            >
              Sample text — {Math.round(scale * 100)}%
            </Typography>
            {scale !== 1 && (
              <Typography
                variant="body2"
                color="primary"
                textAlign="center"
                sx={{ cursor: "pointer", fontSize: "0.8rem" }}
                onClick={() => setFontScale(1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setFontScale(1);
                }}
              >
                Reset to 100%
              </Typography>
            )}
          </Stack>
        </Popover>
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
