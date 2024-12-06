export interface TestSettings {
  language1Words: string[];
  language2Words: string[];
  wordNeedsToGetCorrectTimes: number;
  multiSelectChoicesAmount: number;
  onlySecondLanguageWordsTested: boolean;
  everySecondTestIsMultiOrWriting: boolean;
  testType: "both" | "multi-select" | "writing";
}
