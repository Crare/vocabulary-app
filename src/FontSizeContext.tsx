import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    ReactNode,
} from "react";

const STORAGE_KEY = "FONT_SIZE_SCALE";
const MIN_SCALE = 0.75;
const MAX_SCALE = 1.5;
const STEP = 0.1;
const DEFAULT_SCALE = 1;

interface FontSizeContextValue {
    /** Current scale factor (0.75 – 1.5) */
    scale: number;
    increase: () => void;
    decrease: () => void;
    reset: () => void;
    canIncrease: boolean;
    canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextValue>({
    scale: DEFAULT_SCALE,
    increase: () => {},
    decrease: () => {},
    reset: () => {},
    canIncrease: true,
    canDecrease: true,
});

export const useFontSize = () => useContext(FontSizeContext);

const loadScale = (): number => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const n = parseFloat(stored);
            if (!isNaN(n) && n >= MIN_SCALE && n <= MAX_SCALE) return n;
        }
    } catch {
        // ignore
    }
    return DEFAULT_SCALE;
};

const round = (n: number) => Math.round(n * 100) / 100;

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
    const [scale, setScale] = useState<number>(loadScale);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(scale));
        document.documentElement.style.fontSize = `${scale * 100}%`;
    }, [scale]);

    const increase = useCallback(
        () => setScale((s) => round(Math.min(s + STEP, MAX_SCALE))),
        [],
    );
    const decrease = useCallback(
        () => setScale((s) => round(Math.max(s - STEP, MIN_SCALE))),
        [],
    );
    const reset = useCallback(() => setScale(DEFAULT_SCALE), []);

    const value = useMemo(
        () => ({
            scale,
            increase,
            decrease,
            reset,
            canIncrease: scale < MAX_SCALE,
            canDecrease: scale > MIN_SCALE,
        }),
        [scale, increase, decrease, reset],
    );

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
};
