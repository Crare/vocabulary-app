import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { WordSet } from "../../wordsets/types";
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

interface TemplateListModalProps {
  open: boolean;
  onClose: () => void;
  templates: WordSet[];
  onSelect: (index: number) => void;
  onDownload: (
    name: string,
    lang1: string[],
    lang2: string[],
    language1?: string,
    language2?: string,
  ) => void;
}

export const TemplateListModal = (props: TemplateListModalProps) => {
  const { open, onClose, templates, onSelect, onDownload } = props;
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const q = search.toLowerCase();
  const filtered = templates.filter(
    (t) =>
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.language1 ?? "").toLowerCase().includes(q) ||
      (t.language2 ?? "").toLowerCase().includes(q),
  );

  const groups = new Map<string, WordSet[]>();
  for (const t of filtered) {
    const key =
      t.language1 && t.language2 ? `${t.language1} → ${t.language2}` : "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="template-list-modal-title"
      aria-describedby="template-list-modal-description"
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
          <Typography variant="h3">Templates</Typography>
          <Button onClick={onClose} endIcon={<ClearIcon />} size="small">
            Close
          </Button>
        </Box>
        <TextField
          size="small"
          fullWidth
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        {Array.from(groups.entries()).map(([groupKey, groupTemplates]) => (
          <Accordion
            key={groupKey}
            disableGutters
            elevation={0}
            sx={{
              border: `1px solid ${alpha.primary15}`,
              borderRadius: "12px !important",
              mb: 1.5,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{groupKey}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Grid container flexDirection="column" gap={1}>
                {groupTemplates.map((template) => {
                  const index = templates.indexOf(template);
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha.primary04,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography fontWeight={600}>
                          {template.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.words.length} words
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
                              template.name,
                              template.words.map((w) => w.lang1),
                              template.words.map((w) => w.lang2),
                              template.language1,
                              template.language2,
                            )
                          }
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
        {filtered.length === 0 && (
          <Typography color="text.secondary" textAlign="center">
            No templates match your search.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};
