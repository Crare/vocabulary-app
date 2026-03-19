import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

export const QrCodeModal = ({ open, onClose, url }: QrCodeModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        Open on your phone
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ pt: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#ffffff",
              display: "inline-flex",
            }}
          >
            <QRCodeSVG value={url} size={220} />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ wordBreak: "break-all", maxWidth: 280, fontSize: "0.75rem" }}
          >
            {url}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy link"} arrow>
            <IconButton
              onClick={handleCopy}
              size="small"
              aria-label="Copy link"
              sx={{ border: 1, borderColor: "divider" }}
            >
              {copied ? (
                <CheckIcon fontSize="small" color="success" />
              ) : (
                <ContentCopyIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
