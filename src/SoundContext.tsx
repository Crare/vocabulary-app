import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import { playCorrect, playWrong, playStart, playFinish, playReveal, playSkip } from "./util/sounds";

interface SoundContextValue {
    volume: number;
    setVolume: (v: number) => void;
    onCorrect: () => void;
    onWrong: () => void;
    onStart: () => void;
    onFinish: () => void;
    onReveal: () => void;
    onSkip: () => void;
}

const STORAGE_KEY = "SOUND_VOLUME";

const SoundContext = createContext<SoundContextValue>({
    volume: 0.5,
    setVolume: () => {},
    onCorrect: () => {},
    onWrong: () => {},
    onStart: () => {},
    onFinish: () => {},
    onReveal: () => {},
    onSkip: () => {},
});

export const useSound = () => useContext(SoundContext);

const loadVolume = (): number => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            const v = parseFloat(stored);
            if (!isNaN(v) && v >= 0 && v <= 1) return v;
        }
    } catch {
        // ignore
    }
    return 0.5;
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
    const [volume, setVolumeState] = useState(loadVolume);
    const volumeRef = useRef(volume);

    useEffect(() => {
        volumeRef.current = volume;
    }, [volume]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(volume));
    }, [volume]);

    const setVolume = useCallback((v: number) => {
        setVolumeState(Math.max(0, Math.min(1, v)));
    }, []);

    const onCorrect = useCallback(() => {
        if (volumeRef.current > 0) playCorrect(volumeRef.current);
    }, []);
    const onWrong = useCallback(() => {
        if (volumeRef.current > 0) playWrong(volumeRef.current);
    }, []);
    const onStart = useCallback(() => {
        if (volumeRef.current > 0) playStart(volumeRef.current);
    }, []);
    const onFinish = useCallback(() => {
        if (volumeRef.current > 0) playFinish(volumeRef.current);
    }, []);
    const onReveal = useCallback(() => {
        if (volumeRef.current > 0) playReveal(volumeRef.current);
    }, []);
    const onSkip = useCallback(() => {
        if (volumeRef.current > 0) playSkip(volumeRef.current);
    }, []);

    const value = useMemo(
        () => ({ volume, setVolume, onCorrect, onWrong, onStart, onFinish, onReveal, onSkip }),
        [volume, setVolume, onCorrect, onWrong, onStart, onFinish, onReveal, onSkip],
    );

    return (
        <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
    );
};
