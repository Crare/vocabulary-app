import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  Drawer,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { ReactNode, useEffect, useState } from "react";
import { colors } from "../../colors";
import { languageFlag, languageName } from "../../wordsets/languages";
import { SegmentedControl } from "./SegmentedControl";
import { cellSx, srOnly, surfaceSx } from "./styles";

export type ListTab = "templates" | "saved";

/** What the sheet shows of a template or a saved list. */
export interface ListSummary {
  name: string;
  language1?: string;
  language2?: string;
  wordCount: number;
  hasHints: boolean;
  hasSentences: boolean;
}

interface ListPickerSheetProps {
  open: boolean;
  tab: ListTab;
  onTabChange: (tab: ListTab) => void;
  onClose: () => void;
  templates: ListSummary[];
  saved: ListSummary[];
  /** Name of the list being edited, marked "In use". */
  currentName: string;
  onUse: (tab: ListTab, index: number) => void;
  onDownload: (tab: ListTab, index: number) => void;
  onDeleteSaved: (index: number) => void;
}

const languagesText = (l: ListSummary) => {
  const side = (label?: string) =>
    label ? languageFlag(label) || languageName(label) : "?";
  return l.language1 || l.language2
    ? `${side(l.language1)} → ${side(l.language2)} · `
    : "";
};

const matches = (l: ListSummary, q: string) =>
  !q ||
  [l.name, l.language1 ?? "", l.language2 ?? ""].some((s) =>
    s.toLowerCase().includes(q),
  );

/** Templates and saved lists in one sheet, with tabs and search. */
export const ListPickerSheet = (props: ListPickerSheetProps) => {
  const { open, tab, onTabChange, onClose, templates, saved, currentName } =
    props;
  const { onUse, onDownload, onDeleteSaved } = props;
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"));
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!open) setSearch("");
    setConfirmDelete(null);
  }, [open, tab]);

  const lists = tab === "templates" ? templates : saved;
  const q = search.trim().toLowerCase();
  const visible = lists
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => matches(l, q));

  const body: ReactNode = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {!isDesktop && (
        <Box
          sx={{ display: "flex", justifyContent: "center", pt: 1 }}
          aria-hidden="true"
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              bgcolor: colors.slate300,
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: "8px 8px 8px 16px",
        }}
      >
        <Typography
          id="list-sheet-title"
          component="h2"
          sx={{ fontSize: "1.1rem", fontWeight: 700 }}
        >
          Choose a list
        </Typography>
        <IconButton
          color="primary"
          onClick={onClose}
          aria-label="Close"
          sx={{ width: 44, height: 44 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
        <SegmentedControl
          kind="tab"
          label="List source"
          value={tab}
          onChange={onTabChange}
          options={[
            {
              value: "templates",
              label: `Templates · ${templates.length}`,
              id: "tab-templates",
              controls: "list-panel",
            },
            {
              value: "saved",
              label: `My lists · ${saved.length}`,
              id: "tab-saved",
              controls: "list-panel",
            },
          ]}
        />
        <Box
          component="label"
          sx={[
            cellSx,
            {
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 1,
              height: 44,
              color: "text.secondary",
            },
          ]}
        >
          <SearchIcon fontSize="small" />
          <Box component="span" sx={srOnly}>
            Search lists
          </Box>
          <InputBase
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or language"
            sx={{ flex: 1, fontWeight: 500 }}
            inputProps={{ type: "search" }}
          />
        </Box>
      </Box>
      <Box
        id="list-panel"
        role="tabpanel"
        aria-labelledby={tab === "templates" ? "tab-templates" : "tab-saved"}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          p: "10px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {visible.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            {lists.length === 0
              ? "No saved lists yet. Save the list you are editing with the bookmark button."
              : "No lists match your search."}
          </Typography>
        )}
        {visible.map(({ l, i }) => {
          const inUse = l.name === currentName;
          const meta = `${languagesText(l)}${l.wordCount} words${l.hasHints ? " · hints" : ""}${l.hasSentences ? " · sentences" : ""}`;
          return (
            <Box
              key={`${tab}-${i}`}
              sx={[
                surfaceSx,
                {
                  borderRadius: "12px",
                  borderWidth: "1.5px",
                  display: "flex",
                  alignItems: "center",
                },
                (theme) =>
                  inUse
                    ? {
                        borderColor: colors.indigo300,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "background.paper"
                            : colors.indigo50,
                      }
                    : {},
              ]}
            >
              {confirmDelete === i ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 120 }}>
                    Delete “{l.name}”?
                  </Typography>
                  <Button size="small" onClick={() => setConfirmDelete(null)}>
                    Keep
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    sx={{ color: "error.dark", borderColor: colors.red200 }}
                    onClick={() => {
                      setConfirmDelete(null);
                      onDeleteSaved(i);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ) : (
                <>
                  <ButtonBase
                    onClick={() => onUse(tab, i)}
                    aria-label={`${inUse ? "In use" : "Use"}: ${l.name}, ${meta}`}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      textAlign: "left",
                      borderRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {l.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {meta}
                      </Typography>
                    </Box>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {inUse ? "In use" : "Use"}
                    </Typography>
                  </ButtonBase>
                  <Tooltip title="Download as file" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => onDownload(tab, i)}
                      aria-label={`Download ${l.name}`}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {tab === "saved" && (
                    <Tooltip title="Delete list" arrow>
                      <IconButton
                        onClick={() => setConfirmDelete(i)}
                        aria-label={`Delete ${l.name}`}
                        sx={{ color: "error.dark", mr: 0.5 }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return isDesktop ? (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="list-sheet-title"
      slotProps={{ paper: { sx: { height: "80vh", borderRadius: 4 } } }}
    >
      {body}
    </Dialog>
  ) : (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          role: "dialog",
          "aria-labelledby": "list-sheet-title",
          sx: { height: "calc(100% - 56px)", borderRadius: "20px 20px 0 0" },
        } as object,
      }}
    >
      {body}
    </Drawer>
  );
};
