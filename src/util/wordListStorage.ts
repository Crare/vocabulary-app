import { LanguageSet } from "../pages/Testing/types";
import { createLogger } from "./logger";

const log = createLogger("word_list_storage");

export const storageKeys = {
  LANGUAGE_SETS: "LANGUAGE_SETS",
  SETTINGS: "SETTINGS",
  HIDE_INSTRUCTIONS: "HIDE_INSTRUCTIONS",
} as const;

/**
 * The word-list fields this page keeps in the shared `SETTINGS` key. Word and
 * hint columns stay newline-joined strings so older versions can still read
 * them. `TestConfigView` writes its own fields into the same object.
 */
export interface WordListFields {
  language1Words: string;
  language2Words: string;
  hints: string;
  lang1Name: string;
  lang2Name: string;
  langSetName: string;
  language1Sentences: string;
  language2Sentences: string;
}

/** Everything in `SETTINGS`, including the test options owned by TestConfigView. */
export type PersistedSettings = Partial<WordListFields> &
  Record<string, unknown>;

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    log.error("storage_read_failed", {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    log.error("storage_write_failed", {
      key,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const loadPersistedSettings = (): PersistedSettings => {
  const settings = readJson<PersistedSettings | null>(
    storageKeys.SETTINGS,
    null,
  );
  return settings && typeof settings === "object" ? settings : {};
};

/** Merges the word-list fields into `SETTINGS`, keeping every other field. */
export const saveWordListFields = (fields: WordListFields) => {
  writeJson(storageKeys.SETTINGS, { ...loadPersistedSettings(), ...fields });
};

export const loadLanguageSets = (): LanguageSet[] => {
  const sets = readJson<unknown>(storageKeys.LANGUAGE_SETS, []);
  return Array.isArray(sets) ? (sets as LanguageSet[]) : [];
};

export const saveLanguageSets = (sets: LanguageSet[]) => {
  writeJson(storageKeys.LANGUAGE_SETS, sets);
};

export const isTipHidden = (): boolean => {
  try {
    return localStorage.getItem(storageKeys.HIDE_INSTRUCTIONS) === "true";
  } catch {
    return false;
  }
};

export const hideTip = () => {
  try {
    localStorage.setItem(storageKeys.HIDE_INSTRUCTIONS, "true");
  } catch {
    // Storage may be unavailable (private mode); the tip just shows again.
  }
};
