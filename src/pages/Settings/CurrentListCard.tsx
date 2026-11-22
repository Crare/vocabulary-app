import {
  Box,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DownloadIcon from "@mui/icons-material/Download";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { LanguagePicker } from "./LanguagePicker";
import { surfaceSx, tapBorder } from "./styles";

interface CurrentListCardProps {
  name: string;
  onNameChange: (name: string) => void;
  lang1Name: string;
  lang2Name: string;
  onLang1Change: (name: string) => void;
  onLang2Change: (name: string) => void;
  onSwap: () => void;
  /** "29 words · 3 hints · no sentences" */
  summary: string;
  onSave: () => void;
  onDownload: () => void;
  onShareQr: () => void;
  onClear: () => void;
  hasWords: boolean;
}

/** The list being edited: its name, languages, size and list actions. */
export const CurrentListCard = (props: CurrentListCardProps) => {
  const {
    name,
    onNameChange,
    lang1Name,
    lang2Name,
    onLang1Change,
    onLang2Change,
    onSwap,
    summary,
    onSave,
    onDownload,
    onShareQr,
    onClear,
    hasWords,
  } = props;
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"), {
    noSsr: true,
  });
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  // Under the name on desktop; under the language buttons on phones.
  const summaryText = (
    <Typography
      variant="body2"
      sx={{
        flexBasis: "100%",
        mt: isDesktop ? 0.25 : 0,
        color: "text.secondary",
      }}
    >
      {summary}
    </Typography>
  );
  const runFromMenu = (action: () => void) => () => {
    setMenuAnchor(null);
    action();
  };

  return (
    <Box
      component="section"
      aria-label="Current list"
      sx={[
        surfaceSx,
        {
          p: { xs: "14px", md: "18px 20px" },
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: { xs: "12px", md: "12px 16px" },
        },
      ]}
    >
      <Box sx={{ flex: "1 1 320px", minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <InputBase
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name this list"
            inputProps={{ "aria-label": "List name" }}
            sx={{
              flex: 1,
              minWidth: 0,
              ml: "-8px",
              px: 1,
              height: 40,
              borderRadius: "8px",
              border: "1.5px solid transparent",
              fontWeight: 700,
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              "&:hover, &.Mui-focused": { borderColor: "divider" },
              "&.Mui-focused": { borderColor: "primary.main" },
            }}
          />
          {!isDesktop && (
            <Tooltip title="Save to My lists" arrow describeChild>
              <span>
                <IconButton
                  color="primary"
                  onClick={onSave}
                  disabled={!hasWords}
                  aria-label="Save to My lists"
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title="More actions" arrow>
            <IconButton
              color="primary"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              aria-label="More list actions"
              aria-haspopup="menu"
              aria-expanded={!!menuAnchor}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
        {isDesktop && summaryText}
      </Box>

      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "0 1 auto" },
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr) 44px minmax(0, 1fr)",
            md: "minmax(0, 160px) 44px minmax(0, 160px)",
          },
          gap: 1,
          alignItems: "center",
        }}
      >
        <LanguagePicker
          label="First language"
          value={lang1Name}
          onChange={onLang1Change}
          placeholder="Language 1"
        />
        <Tooltip title="Swap languages" arrow>
          <IconButton
            color="primary"
            onClick={onSwap}
            aria-label="Swap languages"
            sx={(theme) => ({
              width: 44,
              height: 44,
              border: `1.5px solid ${tapBorder(theme)}`,
            })}
          >
            <SwapHorizIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <LanguagePicker
          label="Second language"
          value={lang2Name}
          onChange={onLang2Change}
          placeholder="Language 2"
        />
      </Box>
      {!isDesktop && summaryText}

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={runFromMenu(onDownload)}
          disabled={!hasWords}
          sx={{ color: "primary.main" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download as file</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={runFromMenu(onShareQr)}
          sx={{ color: "primary.main" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <QrCode2Icon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share QR code</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={runFromMenu(onClear)}
          disabled={!hasWords}
          sx={{ color: "error.dark" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear all words</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
