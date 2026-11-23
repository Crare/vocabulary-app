import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { createLogger } from "../../util/logger";

const log = createLogger("testing");

interface TestTopBarProps {
  title: string;
  subtitle?: string;
  learned: number;
  total: number;
  /** Shown before the first answer: leave without saving a result. */
  onBackToStart?: () => void;
  onEndTest: () => void;
}

/**
 * Title row of the test. Ending the test sits behind the ⋯ button and a
 * confirm step, so it can't be hit by accident while answering.
 */
export const TestTopBar = ({
  title,
  subtitle,
  learned,
  total,
  onBackToStart,
  onEndTest,
}: TestTopBarProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const keepPractising = () => {
    log.info("end_test_cancelled", { learned, total });
    setConfirmOpen(false);
  };

  const endTest = () => {
    log.info("end_test_confirmed", { learned, total });
    setConfirmOpen(false);
    onEndTest();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 48 }}>
      {onBackToStart && (
        <IconButton
          onClick={onBackToStart}
          aria-label="Back to word list"
          color="primary"
          sx={{ width: 44, height: 44, ml: -1 }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={() => setConfirmOpen(true)}
        aria-label="Test options"
        aria-haspopup="dialog"
        color="primary"
        sx={{ width: 44, height: 44, mr: -1 }}
      >
        <MoreHorizIcon />
      </IconButton>

      <Dialog
        open={confirmOpen}
        onClose={keepPractising}
        aria-labelledby="end-test-title"
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-container": {
            alignItems: { xs: "flex-end", sm: "center" },
          },
          "& .MuiDialog-paper": {
            m: { xs: 0, sm: 4 },
            width: { xs: "100%", sm: undefined },
            maxWidth: { xs: "100%", sm: 444 },
            borderRadius: { xs: "20px 20px 0 0", sm: 4 },
            pb: { xs: "env(safe-area-inset-bottom)", sm: 0 },
          },
        }}
      >
        <DialogTitle id="end-test-title" sx={{ fontWeight: 700 }}>
          End the test now?
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            You have learned {learned} of {total} words. Results show what you
            practised so far and are saved to history.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: "column",
            alignItems: "stretch",
            gap: 1,
            px: 3,
            pb: 2.5,
            "& > :not(style) ~ :not(style)": { ml: 0 },
          }}
        >
          <Button onClick={endTest} sx={{ minHeight: 44 }}>
            End test and see results
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={keepPractising}
            autoFocus
            sx={{ minHeight: 52 }}
          >
            Keep practising
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
