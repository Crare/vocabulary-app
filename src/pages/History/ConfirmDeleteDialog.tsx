import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ReactNode } from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Asks before deleting several tests. On phones it slides up as a bottom
 * sheet; the safe "Keep them" choice gets focus first.
 */
export const ConfirmDeleteDialog = ({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-body"
      sx={
        isPhone
          ? {
              "& .MuiDialog-container": { alignItems: "flex-end" },
              "& .MuiDialog-paper": {
                m: 0,
                width: "100%",
                maxWidth: "100%",
                borderRadius: "20px 20px 0 0",
              },
            }
          : undefined
      }
    >
      <DialogContent
        sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        {isPhone && (
          <Box
            aria-hidden="true"
            sx={{
              alignSelf: "center",
              width: 40,
              height: 4,
              borderRadius: "2px",
              bgcolor: "divider",
              mt: -1,
              mb: 1,
            }}
          />
        )}
        <Typography
          id="confirm-delete-title"
          variant="h6"
          component="h2"
          fontWeight={700}
        >
          {title}
        </Typography>
        <Typography id="confirm-delete-body" color="text.secondary">
          {body}
        </Typography>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={onConfirm}
          sx={{ mt: 1, minHeight: 52, borderRadius: "14px", fontWeight: 700 }}
        >
          {confirmLabel}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={onCancel}
          autoFocus
          sx={{ minHeight: 48, borderRadius: "14px" }}
        >
          Keep them
        </Button>
      </DialogContent>
    </Dialog>
  );
};
