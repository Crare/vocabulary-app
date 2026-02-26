import { Box, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export const Header = () => {
    return (
        <Box
            sx={{
                background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
                borderRadius: 4,
                py: 5,
                px: 3,
                mb: 3,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                },
            }}
        >
            <AutoStoriesIcon
                sx={{
                    fontSize: 48,
                    color: "rgba(255,255,255,0.9)",
                    mb: 1,
                }}
            />
            <Typography
                variant="h1"
                sx={{
                    color: "#fff",
                    textShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    position: "relative",
                }}
            >
                Vocabulary
            </Typography>
            <Typography
                variant="h4"
                sx={{
                    color: "rgba(255,255,255,0.8)",
                    mt: 1,
                    position: "relative",
                }}
            >
                Memorize any vocabulary by repetition
            </Typography>
        </Box>
    );
};
