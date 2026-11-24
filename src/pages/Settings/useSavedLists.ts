import { useCallback, useState } from "react";
import { LanguageSet } from "../Testing/types";
import { loadLanguageSets, saveLanguageSets } from "../../util/wordListStorage";
import { createLogger } from "../../util/logger";

const log = createLogger("settings");

/** Add `set`, or replace the saved set with the same name when `named`. */
export const upsertSet = (
  sets: LanguageSet[],
  set: LanguageSet,
  named: boolean,
): { sets: LanguageSet[]; replaced: boolean } => {
  const existing = named ? sets.findIndex((s) => s.name === set.name) : -1;
  return existing >= 0
    ? { sets: sets.map((s, i) => (i === existing ? set : s)), replaced: true }
    : { sets: [...sets, set], replaced: false };
};

/**
 * The lists in "My lists". Every change starts from what is in storage, so a
 * list saved in another tab is never overwritten by a stale copy.
 */
export const useSavedLists = () => {
  const [savedSets, setSavedSets] = useState<LanguageSet[]>(loadLanguageSets);

  const commit = (next: LanguageSet[]) => {
    saveLanguageSets(next);
    setSavedSets(next);
  };

  /** Save a list. Named lists update the saved list with the same name. */
  const save = useCallback((set: LanguageSet, named: boolean) => {
    const { sets, replaced } = upsertSet(loadLanguageSets(), set, named);
    commit(sets);
    log.info("set_saved", {
      name: set.name,
      wordCount: set.language1Words.length,
      replaced,
    });
    return replaced;
  }, []);

  /** Delete the saved list shown at `index`. */
  const remove = useCallback(
    (index: number) => {
      const target = savedSets[index];
      if (!target) return;
      // Match by content: storage may have changed since this list was shown.
      const key = JSON.stringify(target);
      const stored = loadLanguageSets();
      const at = stored.findIndex((s) => JSON.stringify(s) === key);
      const next = at >= 0 ? stored.filter((_, i) => i !== at) : stored;
      commit(next);
      log.info("set_deleted", { name: target.name, remainingSets: next.length });
    },
    [savedSets],
  );

  return { savedSets, save, remove };
};
