import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface DragGhostProps {
  x: number;
  y: number;
  label: string;
}

/** The lifted copy of an answer that follows the pointer while dragging. */
export const DragGhost = ({ x, y, label }: DragGhostProps) => (
  <Box
    aria-hidden="true"
    sx={{
      position: "fixed",
      left: x - 84,
      top: y - 32,
      zIndex: 1500,
      width: 168,
      minHeight: 60,
      px: 1,
      borderRadius: 3,
      border: 2,
      borderColor: "primary.main",
      bgcolor: "background.paper",
      color: "primary.dark",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
      fontWeight: 600,
      pointerEvents: "none",
      transform: "rotate(-2deg) scale(1.05)",
      boxShadow: "0 14px 30px rgba(79,70,229,0.35)",
    }}
  >
    <DragIndicatorIcon fontSize="small" />
    {label}
  </Box>
);
