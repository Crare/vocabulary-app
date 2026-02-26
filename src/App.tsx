import { ThemeProvider, CssBaseline } from "@mui/material";
import Main from "./pages/Main";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Main />
        </ThemeProvider>
    );
}

export default App;
