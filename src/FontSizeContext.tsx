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
export const FONT_MIN_SCALE = 0.75;
export const FONT_MAX_SCALE = 1.5;
export const FONT_STEP = 0.1;
const DEFAULT_SCALE = 1;

interface FontSizeContextValue {
  /** Current scale factor (0.75 – 1.5) */
  scale: number;
  setScale: (value: number) => void;
  increase: () => void;
  decrease: () => void;
  reset: () => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  scale: DEFAULT_SCALE,
  setScale: () => {},
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
      if (!isNaN(n) && n >= FONT_MIN_SCALE && n <= FONT_MAX_SCALE) return n;
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
    () => setScale((s) => round(Math.min(s + FONT_STEP, FONT_MAX_SCALE))),
    [],
  );
  const decrease = useCallback(
    () => setScale((s) => round(Math.max(s - FONT_STEP, FONT_MIN_SCALE))),
    [],
  );
  const reset = useCallback(() => setScale(DEFAULT_SCALE), []);

  const setScaleTo = useCallback(
    (value: number) =>
      setScale(
        round(Math.min(Math.max(value, FONT_MIN_SCALE), FONT_MAX_SCALE)),
      ),
    [],
  );

  const value = useMemo(
    () => ({
      scale,
      setScale: setScaleTo,
      increase,
      decrease,
      reset,
      canIncrease: scale < FONT_MAX_SCALE,
      canDecrease: scale > FONT_MIN_SCALE,
    }),
    [scale, setScaleTo, increase, decrease, reset],
  );

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
};
