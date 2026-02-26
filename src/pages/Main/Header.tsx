import { Grid, Typography } from "@mui/material";
import "./Main.css";

export const Header = () => {
    return (
        <Grid className="header" size={12}>
            <Grid>
                <Typography variant="h1" textAlign={"center"}>
                    Vocabulary-app
                </Typography>
                <Typography variant="h4" textAlign={"center"}>
                    Memorize any vocabulary by repetition.
                </Typography>
            </Grid>
        </Grid>
    );
};
