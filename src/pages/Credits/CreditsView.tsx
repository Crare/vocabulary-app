import { Box, Link, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ReactNode } from "react";
import { alpha, colors } from "../../colors";
import { trackEvent } from "../../util/analytics";
import { SettingsGroup } from "../../components/SettingControls";

interface CreditEntry {
  name: string;
  url: string;
  license: string;
  description: string;
}

interface CreditGroup {
  title: string;
  entries: CreditEntry[];
}

const credit = (
  name: string,
  url: string,
  license: string,
  description: string,
): CreditEntry => ({ name, url, license, description });

export const creditGroups: CreditGroup[] = [
  {
    title: "Built with",
    entries: [
      credit("React", "https://react.dev/", "MIT", "Builds the user interface"),
      credit("Vite", "https://vite.dev/", "MIT", "Builds and serves the app"),
      credit(
        "TypeScript",
        "https://www.typescriptlang.org/",
        "Apache-2.0",
        "JavaScript with types",
      ),
    ],
  },
  {
    title: "Look and feel",
    entries: [
      credit(
        "MUI (Material UI)",
        "https://mui.com/",
        "MIT",
        "Buttons, dialogs and other components",
      ),
      credit(
        "MUI X Data Grid",
        "https://mui.com/x/react-data-grid/",
        "MIT",
        "Result tables",
      ),
      credit(
        "Material Icons",
        "https://mui.com/material-ui/material-icons/",
        "Apache-2.0",
        "Icons",
      ),
      credit("Emotion", "https://emotion.sh/", "MIT", "Styling engine behind MUI"),
      credit("Recharts", "https://recharts.org/", "MIT", "Progress and score charts"),
      credit(
        "Inter",
        "https://fonts.google.com/specimen/Inter",
        "OFL-1.1",
        "Typeface",
      ),
    ],
  },
  {
    title: "Sound, words and stats",
    entries: [
      credit(
        "Web Audio API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
        "Built in",
        "Sounds are made in the browser; no audio files",
      ),
      credit(
        "Built-in word lists",
        "https://github.com/Crare/vocabulary-app",
        "Project",
        "Word lists curated for this app",
      ),
      credit(
        "GoatCounter",
        "https://goatcounter.com/",
        "EUPL-1.2",
        "Privacy-friendly visit counts",
      ),
    ],
  },
];

interface LinkRowProps {
  href: string;
  /** Name sent with the click event. */
  trackName: string;
  children: ReactNode;
}

/** A full-width row that opens an outside page in a new tab. */
const LinkRow = ({ href, trackName, children }: LinkRowProps) => (
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

const srOnly = {
  position: "absolute",
  // Strings: in `sx` a bare 1 means 100%.
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

const secondary = { fontSize: "0.82rem", lineHeight: 1.4, color: "text.secondary" };
const primaryText = { fontSize: "0.95rem", fontWeight: 600, color: "primary.main" };

export const CreditsView = () => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 640,
      mx: "auto",
      display: "flex",
      flexDirection: "column",
      gap: 2.5,
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 700 }}
      >
        Credits
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
        Vocabulary Trainer is free and open source, built on these projects.
      </Typography>
    </Box>

    <SettingsGroup title="About">
      <LinkRow href="https://crare.github.io/" trackName="Crare (Juho Heikkinen)">
        <Typography component="span" sx={secondary}>
          Made by
        </Typography>
        <Typography component="span" sx={primaryText}>
          Crare (Juho Heikkinen)
        </Typography>
      </LinkRow>
      <LinkRow
        href="https://github.com/Crare/vocabulary-app"
        trackName="GitHub Repository"
      >
        <Typography component="span" sx={secondary}>
          Source code
        </Typography>
        <Typography component="span" sx={primaryText}>
          View on GitHub
        </Typography>
      </LinkRow>
    </SettingsGroup>

    {creditGroups.map((group) => (
      <SettingsGroup key={group.title} title={group.title}>
        {group.entries.map((entry) => (
          <LinkRow key={entry.name} href={entry.url} trackName={entry.name}>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Typography component="span" sx={primaryText}>
                {entry.name}
              </Typography>
              <Box
                component="span"
                sx={(theme) => ({
                  px: 0.875,
                  py: 0.125,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  bgcolor:
                    theme.palette.mode === "dark" ? alpha.slate15 : colors.indigo50,
                })}
              >
                {entry.license}
              </Box>
            </Box>
            <Typography component="span" sx={secondary}>
              {entry.description}
            </Typography>
          </LinkRow>
        ))}
      </SettingsGroup>
    ))}

    <Typography sx={{ ...secondary, mx: 0.5, lineHeight: 1.5 }}>
      This site counts visits with GoatCounter: no cookies and no personal data.
      Your word lists and results stay on this device.
    </Typography>
  </Box>
);
