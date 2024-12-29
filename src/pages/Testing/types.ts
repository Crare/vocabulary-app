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

export interface TestWord {
  id: number;
  lang1Word: string;
  lang2Word: string;
  timesCorrect: number;
  timesFailed: number;
  timesSkipped: number;
  timesCheckedAnswer: number;
}

export enum TestOption {
  WriteCorrectAnswer,
  SelectFromMultiple,
}

export interface TestResults {
  wordResults: TestWord[];
  timeTaken: string;
  date: Date;
  score: number;
}

export enum TestState {
  Success,
  Failed,
  CheckedAnswer,
}
