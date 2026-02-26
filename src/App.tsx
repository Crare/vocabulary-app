import Main from "./pages/Main";
import { AppThemeProvider } from "./ThemeContext";
import { SoundProvider } from "./SoundContext";

function App() {
    return (
        <AppThemeProvider>
            <SoundProvider>
                <Main />
            </SoundProvider>
        </AppThemeProvider>
    );
}

export default App;
