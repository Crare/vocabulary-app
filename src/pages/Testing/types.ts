export interface TestSettings {
  languageSet: LanguageSet;
  wordNeedsToGetCorrectTimes: number;
  multiSelectChoicesAmount: number;
  onlySecondLanguageWordsTested: boolean;
  everySecondTestIsMultiOrWriting: boolean;
  testType: "both" | "multi-select" | "writing";
}

export interface LanguageSet {
  name: string;
  language1Words: string[];
  language2Words: string[];
}
