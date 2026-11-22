import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Drawer,
  IconButton,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useEffect, useRef, useState } from "react";
import { QrCodeModal } from "../../components/QrCodeModal";
import { useThemeMode } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import { colors, alpha } from "../../colors";
import { createLogger } from "../../util/logger";
import { OptionsPanel } from "./OptionsPanel";
import {
  NavView,
  PHONE_NAV_QUERY,
  buildQrUrl,
  nextMuteVolume,
} from "./navConfig";

export type { NavView } from "./navConfig";

const log = createLogger("header");

interface HeaderProps {
  activeTab: NavView | null;
  onNavigate: (view: NavView) => void;
  /** True while a test runs: navigation hides, sound and text size stay. */
  disabled?: boolean;
}

const desktopLinks: { value: NavView; label: string }[] = [
  { value: "wordlists", label: "Word lists" },
  { value: "history", label: "History" },
  { value: "settings", label: "Settings" },
  { value: "credits", label: "Credits" },
];

const barIconSx = { width: 44, height: 44, color: colors.white } as const;

export const Header = ({ activeTab, onNavigate, disabled }: HeaderProps) => {
  const { mode } = useThemeMode();
  const { volume, setVolume } = useSound();
  const isPhone = useMediaQuery(PHONE_NAV_QUERY);
  const [optionsAnchor, setOptionsAnchor] = useState<HTMLElement | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const lastAudibleVolume = useRef<number | null>(volume > 0 ? volume : null);

  useEffect(() => {
    if (volume > 0) lastAudibleVolume.current = volume;
  }, [volume]);

  // Close a popover/sheet that no longer fits when the layout switches.
  useEffect(() => {
    setOptionsAnchor(null);
  }, [isPhone]);

  const optionsOpen = Boolean(optionsAnchor);
  const closeOptions = () => setOptionsAnchor(null);

  const toggleMute = () => {
    const next = nextMuteVolume(volume, lastAudibleVolume.current);
    log.info("mute_toggled", { muted: next === 0 });
    setVolume(next);
  };

  const openQr = () => {
    log.info("qr_opened");
    closeOptions();
    setQrOpen(true);
  };

  const openCredits = () => {
    closeOptions();
    onNavigate("credits");
  };

  const panel = (
    <OptionsPanel
      onToggleMute={toggleMute}
      onOpenQr={disabled ? undefined : openQr}
      onOpenCredits={disabled || !isPhone ? undefined : openCredits}
    />
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      component="header"
      sx={{
        bgcolor: mode === "dark" ? colors.deepIndigo : colors.indigo600,
        backgroundImage: "none",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, md: 60 },
          px: { xs: 1, md: 3 },
          pl: { xs: 2, md: 3 },
          gap: { xs: 0.5, md: 3 },
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
        }}
        disableGutters
      >
        <ButtonBase
          onClick={() => onNavigate("wordlists")}
          disabled={disabled}
          aria-label="Vocabulary Trainer, go to word lists"
          sx={{ gap: 1.25, borderRadius: 2, minHeight: 44, color: colors.white }}
        >
          <AutoStoriesIcon aria-hidden />
          <Typography
            component="span"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.05rem", md: "1.125rem" } }}
          >
            Vocabulary Trainer
          </Typography>
        </ButtonBase>

        {!isPhone && !disabled && (
          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{ display: "flex", gap: 0.5, alignSelf: "stretch" }}
          >
            {desktopLinks.map((link) => {
              const current = activeTab === link.value;
              return (
                <ButtonBase
                  key={link.value}
                  onClick={() => onNavigate(link.value)}
                  aria-current={current ? "page" : undefined}
                  sx={{
                    px: 1.75,
                    fontSize: "0.875rem",
                    fontWeight: current ? 600 : 500,
                    color: current ? colors.white : colors.indigo100,
                    borderTop: "3px solid transparent",
                    borderBottom: `3px solid ${current ? colors.white : "transparent"}`,
                    "&:hover": { color: colors.white },
                    "&.Mui-focusVisible": { outline: `2px solid ${colors.white}` },
                  }}
                >
                  {link.label}
                </ButtonBase>
              );
            })}
          </Box>
        )}

        <Stack direction="row" alignItems="center" sx={{ ml: "auto" }} spacing={0.5}>
          {disabled && (
            <Tooltip title={volume === 0 ? "Turn sound on" : "Mute sound"}>
              <IconButton
                onClick={toggleMute}
                aria-label={volume === 0 ? "Turn sound on" : "Mute sound"}
                aria-pressed={volume === 0}
                sx={barIconSx}
              >
                {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>
          )}
          {isPhone ? (
            <IconButton
              onClick={(e) => setOptionsAnchor(e.currentTarget)}
              aria-label={disabled ? "Text size and sound" : "Options"}
              aria-haspopup="dialog"
              aria-expanded={optionsOpen}
              sx={barIconSx}
            >
              <TuneIcon />
            </IconButton>
          ) : (
            <Button
              onClick={(e) => setOptionsAnchor(e.currentTarget)}
              startIcon={<TuneIcon />}
              aria-haspopup="dialog"
              aria-expanded={optionsOpen}
              sx={{
                height: 40,
                px: 1.75,
                borderRadius: 5,
                color: colors.white,
                border: `1.5px solid ${alpha.white50}`,
                "&:hover": { borderColor: colors.white, bgcolor: "transparent" },
              }}
            >
              Options
            </Button>
          )}
        </Stack>
      </Toolbar>

      {isPhone ? (
        <Drawer
          anchor="bottom"
          open={optionsOpen}
          onClose={closeOptions}
          slotProps={{
            paper: {
              role: "dialog",
              "aria-labelledby": "options-title",
              sx: {
                borderRadius: "20px 20px 0 0",
                px: 2,
                pt: 1,
                pb: "calc(16px + env(safe-area-inset-bottom))",
                maxHeight: "90vh",
              },
            },
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: alpha.slate30,
              alignSelf: "center",
              mb: 0.5,
            }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography id="options-title" variant="h6" component="h2" fontWeight={700}>
              Options
            </Typography>
            <IconButton
              onClick={closeOptions}
              aria-label="Close options"
              sx={{ width: 44, height: 44, color: "primary.main" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          {panel}
        </Drawer>
      ) : (
        <Popover
          open={optionsOpen}
          anchorEl={optionsAnchor}
          onClose={closeOptions}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              role: "dialog",
              "aria-label": "Options",
              sx: { mt: 1, px: 2, py: 0.5, width: 320, borderRadius: 4 },
            },
          }}
        >
          {panel}
        </Popover>
      )}

      <QrCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={buildQrUrl(window.location.href)}
      />
    </AppBar>
  );
};
