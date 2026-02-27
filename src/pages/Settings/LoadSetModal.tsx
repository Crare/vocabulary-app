import {
  Box,
  Button,
  Grid,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import { LanguageSet } from "../Testing/types";
import { alpha } from "../../colors";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 560,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: `0 20px 60px ${alpha.black15}`,
  p: 4,
  outline: "none",
};

const fullscreenStyle = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  borderRadius: 0,
  boxShadow: "none",
  p: 2,
  outline: "none",
  overflow: "auto",
};

interface LoadSetModalProps {
  open: boolean;
  onClose: () => void;
  languageSets: LanguageSet[];
  onSelect: (index: number) => void;
  onDownload: (
    name: string,
    lang1: string[],
    lang2: string[],
    language1?: string,
    language2?: string,
  ) => void;
  onDelete: (index: number) => void;
}

export const LoadSetModal = (props: LoadSetModalProps) => {
  const { open, onClose, languageSets, onSelect, onDownload, onDelete } = props;
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="load-set-modal-title"
      aria-describedby="load-set-modal-description"
    >
      <Box
        sx={isMobile ? fullscreenStyle : modalStyle}
        maxHeight={isMobile ? "100%" : "70%"}
        overflow={"auto"}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h3">
            {languageSets.length === 0 ? "No saved sets" : "Your saved sets"}
          </Typography>
          <Button onClick={onClose} endIcon={<ClearIcon />} size="small">
            Close
          </Button>
        </Box>
        {languageSets.length === 0 ? (
          <Typography color="text.secondary">
            You don't have any saved language sets yet.
          </Typography>
        ) : (
          <Grid container flexDirection={"column"} gap={1.5}>
            {languageSets.map((set, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: alpha.primary04,
                  border: `1px solid ${alpha.primary10}`,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography fontWeight={600}>{set.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {set.language1Words.length} words
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onSelect(index)}
                  >
                    Select
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      onDownload(
                        set.name,
                        set.language1Words,
                        set.language2Words,
                        set.language1Name,
                        set.language2Name,
                      )
                    }
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    </Modal>
  );
};
