import { Box, Typography } from "@mui/material";
import { alpha, colors } from "../../colors";
import { SettingsGroup } from "../../components/settings/SettingsGroup";

import { creditGroups } from "./creditsData";
import { LinkRow } from "./LinkRow";

export { creditGroups } from "./creditsData";


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
