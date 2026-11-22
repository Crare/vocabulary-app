import { WordSet } from "../wordsets/types";

/** Saves a word set as a `.json` file through a temporary download link. */
export const downloadWordSetFile = (wordSet: WordSet) => {
  const blob = new Blob([JSON.stringify(wordSet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(wordSet.name || "word-set").replace(/[^a-z0-9]/gi, "_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
