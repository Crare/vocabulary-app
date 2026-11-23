import { Box, Button, Typography } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { surfaceSx, tapBorder } from "./styles";


interface ListActionsProps {
  /** "tiles" is the phone row of three; "panel" the desktop side card. */
  variant: "tiles" | "panel";
  onTemplates: () => void;
  onMyLists: () => void;
  onImport: () => void;
  /** Desktop only; phones save from the bookmark on the list card. */
  onSave?: () => void;
  canSave?: boolean;
}

/** Ways to get a list: templates, saved lists and file import. */
export const ListActions = (props: ListActionsProps) => {
  const { variant, onTemplates, onMyLists, onImport, onSave, canSave } = props;
  const actions = [
    {
      label: "Templates",
      icon: <GridViewIcon fontSize="small" />,
      onClick: onTemplates,
    },
    {
      label: "My lists",
      icon: <FolderOutlinedIcon fontSize="small" />,
      onClick: onMyLists,
    },
  ];

  if (variant === "tiles") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        {[
          ...actions,
          {
            label: "Import",
            icon: <FileUploadOutlinedIcon fontSize="small" />,
            onClick: onImport,
          },
        ].map((a) => (
          <Button
            key={a.label}
            variant="outlined"
            onClick={a.onClick}
            sx={(theme) => ({
              height: 64,
              flexDirection: "column",
              gap: 0.5,
              p: 0,
              fontSize: "0.8rem",
              borderColor: tapBorder(theme),
              bgcolor: "background.paper",
            })}
          >
            {a.icon}
            {a.label}
          </Button>
        ))}
      </Box>
    );
  }

  return (
    <Box
      component="section"
      aria-labelledby="lists-title"
      sx={[
        surfaceSx,
        { p: "20px", display: "flex", flexDirection: "column", gap: 1.25 },
      ]}
    >
      <Typography
        id="lists-title"
        component="h2"
        sx={{ fontSize: "1rem", fontWeight: 700 }}
      >
        Lists
      </Typography>
      {actions.map((a) => (
        <Button
          key={a.label}
          variant="outlined"
          startIcon={a.icon}
          onClick={a.onClick}
          sx={(theme) => ({
            height: 44,
            justifyContent: "flex-start",
            borderColor: tapBorder(theme),
          })}
        >
          {a.label}
        </Button>
      ))}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onSave}
          disabled={!canSave}
          sx={(theme) => ({ height: 44, borderColor: tapBorder(theme) })}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={onImport}
          sx={(theme) => ({ height: 44, borderColor: tapBorder(theme) })}
        >
          Import
        </Button>
      </Box>
    </Box>
  );
};
