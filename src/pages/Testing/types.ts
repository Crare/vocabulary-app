export interface TestSettings {
    languageSet: LanguageSet;
    wordNeedsToGetCorrectTimes: number;
    multiSelectChoicesAmount: number;
    onlySecondLanguageWordsTested: boolean;
    everySecondTestIsMultiOrWriting: boolean;
    sentenceTestAllWords: boolean;
    testType: {
        writing: boolean;
        multiSelect: boolean;
        dragDrop: boolean;
        sentenceFillBlank: boolean;
    };
}

export interface LanguageSet {
    name: string;
    language1Words: string[];
    language2Words: string[];
    language1Name?: string;
    language2Name?: string;
    language1Sentences?: string[];
    language2Sentences?: string[];
}

export interface SentenceTestResult {
    testedWord: string;
    correct: boolean;
    sentence: string;
}

export interface TestWord {
    id: number;
    lang1Word: string;
    lang2Word: string;
    timesCorrect: number;
    timesFailed: number;
    timesSkipped: number;
    timesCheckedAnswer: number;
    totalAnswerTimeMs: number;
    answerAttempts: number;
    lang1Sentence?: string;
    lang2Sentence?: string;
    sentenceResults?: SentenceTestResult[];
}

export enum TestOption {
    WriteCorrectAnswer,
    SelectFromMultiple,
    DragAndDrop,
    SentenceFillBlank,
}

export interface TestResults {
    wordResults: TestWord[];
    timeTaken: string;
    date: Date;
    score: number;
}

export interface HistoryEntry {
    id: string;
    date: string; // ISO string
    languageSetName: string;
    timeTaken: string;
    score: number;
    wordCount: number;
    wordResults: TestWord[];
}

export enum TestState {
    Success,
    Failed,
    CheckedAnswer,
}
