import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useThemeMode } from "../../ThemeContext";
import { useSound } from "../../SoundContext";
import {
  useFontSize,
  FONT_MIN_SCALE,
  FONT_MAX_SCALE,
  FONT_STEP,
} from "../../FontSizeContext";
import { playCorrect } from "../../util/sounds";
import { alpha } from "../../colors";

interface OptionsPanelProps {
  /** Toggles sound between muted and the last audible volume. */
  onToggleMute: () => void;
  /** Shown as a row when given (hidden during a test). */
  onOpenQr?: () => void;
  /** Shown as a row when given (phone only; desktop has a Credits link). */
  onOpenCredits?: () => void;
}

const sectionSx = {
  py: 1.5,
  borderBottom: 1,
  borderColor: "divider",
} as const;

const roundButtonSx = {
  width: 44,
  height: 44,
  flex: "none",
  border: 1.5,
  borderColor: alpha.primary30,
  color: "primary.main",
  fontWeight: 700,
} as const;

const rowSx = {
  minHeight: 56,
  width: "100%",
  justifyContent: "flex-start",
  gap: 1.75,
  color: "primary.main",
  fontWeight: 600,
  fontSize: "0.9rem",
  borderRadius: 2,
} as const;

/** Text size, sound, dark mode and the extra entries of the app's Options menu. */
export const OptionsPanel = ({
  onToggleMute,
  onOpenQr,
  onOpenCredits,
}: OptionsPanelProps) => {
  const { mode, toggleMode } = useThemeMode();
  const { volume, setVolume } = useSound();
  const { scale, setScale, increase, decrease, canIncrease, canDecrease } =
    useFontSize();
  const sizePct = Math.round(scale * 100);
  const volumePct = Math.round(volume * 100);

  return (
    <Stack>
      <Box sx={sectionSx}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography id="options-text-size" variant="body2" fontWeight={600}>
            Text size
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sizePct}%
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            onClick={decrease}
            disabled={!canDecrease}
            aria-label="Smaller text"
            sx={{ ...roundButtonSx, fontSize: "0.8rem" }}
          >
            A−
          </IconButton>
          <Slider
            value={scale}
            min={FONT_MIN_SCALE}
            max={FONT_MAX_SCALE}
            step={FONT_STEP}
            onChange={(_e, v) => setScale(v as number)}
            aria-labelledby="options-text-size"
            getAriaValueText={(v) => `${Math.round(v * 100)}%`}
            sx={{ flex: 1 }}
          />
          <IconButton
            onClick={increase}
            disabled={!canIncrease}
            aria-label="Larger text"
            sx={{ ...roundButtonSx, fontSize: "1.05rem" }}
          >
            A+
          </IconButton>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: `${scale * 0.875}rem`, lineHeight: 1.4 }}
          >
            Sample text
          </Typography>
          {scale !== 1 && (
            <Button size="small" onClick={() => setScale(1)} sx={{ ml: 1 }}>
              Reset
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={sectionSx}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography id="options-volume" variant="body2" fontWeight={600}>
            Sound volume
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {volumePct}%
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <IconButton
            onClick={onToggleMute}
            aria-label={volume === 0 ? "Turn sound on" : "Mute sound"}
            aria-pressed={volume === 0}
            sx={roundButtonSx}
          >
            {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.05}
            onChange={(_e, v) => setVolume(v as number)}
            onChangeCommitted={(_e, v) => {
              const val = v as number;
              if (val > 0) playCorrect(val);
            }}
            aria-labelledby="options-volume"
            getAriaValueText={(v) => `${Math.round(v * 100)}%`}
            sx={{ flex: 1, mr: 1 }}
          />
        </Stack>
      </Box>

      <Stack
        component="label"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          minHeight: 56,
          cursor: "pointer",
          ...(onOpenQr || onOpenCredits ? sectionSx : {}),
          py: 0,
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          Dark mode
        </Typography>
        <Switch
          checked={mode === "dark"}
          onChange={toggleMode}
          slotProps={{ input: { role: "switch" } }}
        />
      </Stack>

      {onOpenQr && (
        <ButtonBase
          onClick={onOpenQr}
          sx={{
            ...rowSx,
            ...(onOpenCredits ? { borderBottom: 1, borderColor: "divider", borderRadius: 0 } : {}),
          }}
        >
          <QrCode2Icon />
          Open on another device (QR code)
        </ButtonBase>
      )}
      {onOpenCredits && (
        <ButtonBase onClick={onOpenCredits} sx={rowSx}>
          <InfoOutlinedIcon />
          Credits and about
        </ButtonBase>
      )}
    </Stack>
  );
};
