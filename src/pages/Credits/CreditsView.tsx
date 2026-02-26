import {
    Box,
    Card,
    Chip,
    Divider,
    Grid,
    Link,
    Typography,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import StorageIcon from "@mui/icons-material/Storage";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface CreditEntry {
    name: string;
    url: string;
    license: string;
    description: string;
}

const frameworkCredits: CreditEntry[] = [
    {
        name: "React",
        url: "https://react.dev/",
        license: "MIT",
        description: "UI library for building component-based interfaces",
    },
    {
        name: "Vite",
        url: "https://vite.dev/",
        license: "MIT",
        description: "Next-generation frontend build tool",
    },
    {
        name: "TypeScript",
        url: "https://www.typescriptlang.org/",
        license: "Apache-2.0",
        description: "Typed superset of JavaScript",
    },
];

const uiCredits: CreditEntry[] = [
    {
        name: "MUI (Material UI)",
        url: "https://mui.com/",
        license: "MIT",
        description: "React component library following Material Design",
    },
    {
        name: "MUI X Data Grid",
        url: "https://mui.com/x/react-data-grid/",
        license: "MIT",
        description: "Advanced data table component",
    },
    {
        name: "Material Icons",
        url: "https://mui.com/material-ui/material-icons/",
        license: "Apache-2.0",
        description: "Icon set used throughout the application",
    },
    {
        name: "Emotion",
        url: "https://emotion.sh/",
        license: "MIT",
        description: "CSS-in-JS styling engine used by MUI",
    },
    {
        name: "Recharts",
        url: "https://recharts.org/",
        license: "MIT",
        description: "Charting library for progress and score charts",
    },
    {
        name: "Inter (Google Fonts)",
        url: "https://fonts.google.com/specimen/Inter",
        license: "OFL-1.1",
        description: "Primary typeface used in the UI",
    },
];

const soundCredits: CreditEntry[] = [
    {
        name: "Web Audio API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
        license: "Browser built-in",
        description:
            "All sound effects are synthesised at runtime — no audio files are bundled",
    },
];

const dataCredits: CreditEntry[] = [
    {
        name: "Built-in word sets",
        url: "https://github.com/Crare/vocabulary-app",
        license: "Project",
        description:
            "Finnish–Swedish vocabulary sets curated for the application",
    },
];

const Section = ({
    icon,
    title,
    entries,
}: {
    icon: React.ReactNode;
    title: string;
    entries: CreditEntry[];
}) => (
    <Card sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {icon}
            <Typography variant="h3">{title}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
            {entries.map((entry) => (
                <Grid key={entry.name} size={{ xs: 12, sm: 6 }}>
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                            }}
                        >
                            <Link
                                href={entry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                                fontWeight={600}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                {entry.name}
                                <OpenInNewIcon sx={{ fontSize: 14 }} />
                            </Link>
                            <Chip
                                label={entry.license}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {entry.description}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Card>
);

export const CreditsView = () => (
    <Grid container gap={2} flexDirection="column">
        <Typography variant="h1" gutterBottom>
            Credits
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={1}>
            This application is built with the following open-source projects
            and resources.
        </Typography>

        <Section
            icon={<CodeIcon color="primary" />}
            title="Frameworks & Languages"
            entries={frameworkCredits}
        />
        <Section
            icon={<BrushIcon color="primary" />}
            title="UI & Design"
            entries={uiCredits}
        />
        <Section
            icon={<LibraryMusicIcon color="primary" />}
            title="Sound Effects"
            entries={soundCredits}
        />
        <Section
            icon={<StorageIcon color="primary" />}
            title="Data & Word Sets"
            entries={dataCredits}
        />

        <Card sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Created by{" "}
                <Link
                    href="https://crare.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    fontWeight={600}
                >
                    Crare (Juho Heikkinen)
                </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Vocabulary Trainer is open source —{" "}
                <Link
                    href="https://github.com/Crare/vocabulary-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                >
                    view on GitHub
                </Link>
            </Typography>
        </Card>
    </Grid>
);
