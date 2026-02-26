import Main from "./pages/Main";
import { AppThemeProvider } from "./ThemeContext";
import { SoundProvider } from "./SoundContext";
import { FontSizeProvider } from "./FontSizeContext";

function App() {
    return (
        <AppThemeProvider>
            <FontSizeProvider>
                <SoundProvider>
                    <Main />
                </SoundProvider>
            </FontSizeProvider>
        </AppThemeProvider>
    );
}

export default App;
