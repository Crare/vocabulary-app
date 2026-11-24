import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { alpha, colors } from "../colors";
import { createLogger } from "../util/logger";
import { srOnly } from "../styles/srOnly";

const log = createLogger("qr-share");

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

/** The address without "https://", easier to read under the code. */
export const displayUrl = (url: string) => url.replace(/^https?:\/\//, "");

/** Visually hidden but read by screen readers ("1px": in `sx`, 1 means 100%). */

const canShare = () =>
  typeof navigator !== "undefined" && typeof navigator.share === "function";

/**
 * Shows a QR code for the app's address. On a phone it is a bottom sheet for
 * sharing the app with someone else; on a computer, a dialog to open the app
 * on your own phone.
 */
export const QrCodeModal = ({ open, onClose, url }: QrCodeModalProps) => {
  const isPhone = useMediaQuery("(max-width:600px)");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const showCopyState = (state: "copied" | "failed") => {
    setCopyState(state);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showCopyState("copied");
      log.info("qr_link_copied");
    } catch (err) {
      showCopyState("failed");
      log.warn("qr_link_copy_failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: "Vocabulary Trainer", url });
      log.info("qr_link_shared");
    } catch (err) {
      // Closing the share sheet rejects with AbortError; that is not a failure.
      if (err instanceof Error && err.name === "AbortError") return;
      log.warn("qr_link_share_failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const copyLabel =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Couldn't copy"
        : "Copy link";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={isPhone}
      aria-labelledby="qr-title"
      aria-describedby="qr-help"
      sx={isPhone ? { "& .MuiDialog-container": { alignItems: "flex-end" } } : undefined}
      slotProps={{
        paper: {
          sx: isPhone
            ? {
                m: 0,
                width: "100%",
                maxWidth: "100%",
                borderRadius: "24px 24px 0 0",
                p: "8px 20px calc(24px + env(safe-area-inset-bottom))",
              }
            : { borderRadius: "20px", p: 3, width: 380 },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.75 }}>
        {isPhone && (
          <Box
            aria-hidden="true"
            sx={{ width: 40, height: 5, borderRadius: 3, bgcolor: colors.slate200 }}
          />
        )}
        <Box sx={{ alignSelf: "stretch", display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1, pt: 0.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography id="qr-title" component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {isPhone ? "Share Vocabulary Trainer" : "Open on your phone"}
            </Typography>
            <Typography id="qr-help" sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
              {isPhone
                ? "Scan with a phone camera to open the app."
                : "Scan with your phone's camera to open this page."}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close"
            onClick={onClose}
            sx={{ width: 44, height: 44, mr: -1.25, color: "primary.main" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={(theme) => ({
            p: 1.75,
            borderRadius: "16px",
            border: `1px solid ${theme.palette.mode === "dark" ? alpha.slate15 : colors.slate200}`,
            // The code needs a light background to scan, also in dark mode.
            bgcolor: colors.white,
            display: "inline-flex",
          })}
        >
          <QRCodeSVG value={url} size={208} title="QR code for the app's address" />
        </Box>

        <Typography
          sx={{
            maxWidth: 300,
            fontSize: "0.82rem",
            color: "text.secondary",
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          {displayUrl(url)}
        </Typography>

        <Box
          sx={{
            alignSelf: "stretch",
            display: "grid",
            gridAutoColumns: "minmax(0, 1fr)",
            gridAutoFlow: "column",
            gap: 1.25,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCopy}
            startIcon={copyState === "copied" ? <CheckIcon /> : <ContentCopyIcon />}
            sx={{ minHeight: 48, borderWidth: 1.5, borderColor: colors.indigo200 }}
          >
            {copyLabel}
          </Button>
          {canShare() && (
            <Button
              variant="contained"
              onClick={handleShare}
              startIcon={<IosShareIcon />}
              sx={{ minHeight: 48 }}
            >
              Share link
            </Button>
          )}
        </Box>
        {/* Announces the copy result; the button's own text changes too. */}
        <Box role="status" sx={srOnly}>
          {copyState === "idle" ? "" : copyLabel}
        </Box>
      </Box>
    </Dialog>
  );
};
