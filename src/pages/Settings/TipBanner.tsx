import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../colors";


/** First-visit hint; dismissing it is remembered. */
export const TipBanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <Box
    sx={(theme) => ({
      display: "flex",
      alignItems: "flex-start",
      gap: 1,
      p: "12px 8px 12px 14px",
      borderRadius: "12px",
      bgcolor:
        theme.palette.mode === "dark" ? "background.paper" : colors.indigo100,
      color:
        theme.palette.mode === "dark" ? colors.indigo300 : colors.indigo800,
      fontSize: "0.82rem",
      lineHeight: 1.45,
    })}
  >
    <Typography
      component="p"
      sx={{ flex: 1, fontSize: "inherit", color: "inherit" }}
    >
      Pick a list or type your own words, then press <strong>Start test</strong>
      . You practise until every word sticks.
    </Typography>
    <IconButton
      size="small"
      color="primary"
      aria-label="Dismiss tip"
      onClick={onDismiss}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </Box>
);
