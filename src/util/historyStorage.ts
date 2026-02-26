import {
    HistoryEntry,
    TestResults,
    TestSettings,
} from "../pages/Testing/types";

const HISTORY_KEY = "TEST_HISTORY";
const MAX_ENTRIES = 50;

export const saveTestResult = (
    results: TestResults,
    settings: TestSettings,
): void => {
    const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: new Date().toISOString(),
        languageSetName: settings.languageSet.name,
        timeTaken: results.timeTaken,
        score: results.score,
        wordCount: results.wordResults.length,
        wordResults: results.wordResults,
    };

    const existing = loadHistory();
    const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const loadHistory = (): HistoryEntry[] => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
        return [];
    }
};

export const deleteHistoryEntry = (id: string): void => {
    const updated = loadHistory().filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = (): void => {
    localStorage.removeItem(HISTORY_KEY);
};
