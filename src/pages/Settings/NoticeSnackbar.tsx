import { Button, Snackbar } from "@mui/material";
import { colors } from "../../colors";


export interface Notice {
  message: string;
  undo?: () => void;
}

/** Short confirmation at the bottom, with Undo when the change can be reverted. */
export const NoticeSnackbar = ({
  notice,
  onClose,
}: {
  notice: Notice | null;
  onClose: () => void;
}) => (
  <Snackbar
    open={!!notice}
    onClose={(_e, reason) => reason !== "clickaway" && onClose()}
    autoHideDuration={notice?.undo ? 6000 : 3000}
    message={notice?.message}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    // Above the phone's sticky Start bar.
    sx={{ bottom: { xs: 200, md: 24 } }}
    action={
      notice?.undo && (
        <Button
          size="small"
          sx={{ color: colors.indigo300 }}
          onClick={() => {
            notice.undo?.();
            onClose();
          }}
        >
          Undo
        </Button>
      )
    }
  />
);
