import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { alpha } from "../../colors";
import { BOTTOM_NAV_HEIGHT, NavView } from "./navConfig";

interface BottomNavProps {
  activeTab: NavView | null;
  onNavigate: (view: NavView) => void;
}

const tabs: { value: NavView; label: string; icon: React.ReactNode }[] = [
  { value: "wordlists", label: "Word lists", icon: <FormatListBulletedIcon /> },
  { value: "history", label: "History", icon: <HistoryIcon /> },
  { value: "settings", label: "Settings", icon: <SettingsIcon /> },
];

/** Phone-only tab bar fixed to the bottom of the screen. */
export const BottomNav = ({ activeTab, onNavigate }: BottomNavProps) => {
  const value = tabs.some((t) => t.value === activeTab) ? activeTab : false;

  return (
    <Paper
      component="nav"
      aria-label="Main navigation"
      square
      elevation={0}
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: 1,
        borderColor: "divider",
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_e, v: NavView) => onNavigate(v)}
        sx={{ height: BOTTOM_NAV_HEIGHT, bgcolor: "background.paper" }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={
              <Box component="span" className="nav-pill">
                {tab.icon}
              </Box>
            }
            aria-current={activeTab === tab.value ? "page" : undefined}
            sx={{
              color: "primary.main",
              minWidth: 0,
              gap: 0.25,
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
              "& .nav-pill": {
                width: 56,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                transition: "background-color 0.15s ease",
              },
              "&.Mui-selected": { color: "primary.main" },
              "&.Mui-selected .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem",
                fontWeight: 700,
              },
              "&.Mui-selected .nav-pill": {
                bgcolor: alpha.primary15,
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
