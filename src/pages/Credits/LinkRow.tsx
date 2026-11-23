import { Box, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ReactNode } from "react";
import { alpha } from "../../colors";
import { trackEvent } from "../../util/analytics";
import { srOnly } from "../../styles/srOnly";


interface LinkRowProps {
  href: string;
  /** Name sent with the click event. */
  trackName: string;
  children: ReactNode;
}

/** A full-width row that opens an outside page in a new tab. */
export const LinkRow = ({ href, trackName, children }: LinkRowProps) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    underline="none"
    onClick={() => trackEvent("link_click", { url: href, name: trackName })}
    sx={{
      minHeight: 60,
      px: 1.75,
      py: 1.25,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      "&:hover": { bgcolor: alpha.primary04 },
      "&.Mui-focusVisible, &:focus-visible": {
        outline: "2px solid",
        outlineColor: "primary.main",
        outlineOffset: -2,
      },
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
      {children}
    </Box>
    <OpenInNewIcon sx={{ fontSize: 18, color: "primary.main", flex: "none" }} />
    <Box component="span" sx={srOnly}>
      (opens in a new tab)
    </Box>
  </Link>
);
