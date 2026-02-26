import {
    HistoryEntry,
    TestResults,
    TestSettings,
} from "../pages/Testing/types";
import { createLogger } from "./logger";

const log = createLogger("history");
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
    log.info("result_saved", {
        entryId: entry.id,
        languageSet: entry.languageSetName,
        score: entry.score,
        wordCount: entry.wordCount,
        totalEntries: updated.length,
    });
};

export const loadHistory = (): HistoryEntry[] => {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        const entries = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
        log.debug("history_loaded", { entryCount: entries.length });
        return entries;
    } catch (err) {
        log.error("history_load_failed", {
            error: err instanceof Error ? err.message : String(err),
        });
        return [];
    }
};

export const deleteHistoryEntry = (id: string): void => {
    const updated = loadHistory().filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    log.info("entry_deleted", {
        entryId: id,
        remainingEntries: updated.length,
    });
};

export const clearHistory = (): void => {
    localStorage.removeItem(HISTORY_KEY);
    log.info("history_cleared");
};
