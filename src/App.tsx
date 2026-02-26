import Main from "./pages/Main";
import { AppThemeProvider } from "./ThemeContext";

function App() {
    return (
        <AppThemeProvider>
            <Main />
        </AppThemeProvider>
    );
}

export default App;
