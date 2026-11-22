# Data Models

All core types are defined in `src/pages/Testing/types.ts`.

## TestSettings

Passed from `SettingsView` → `Main` → `TestingView` when a test starts.

```ts
interface TestSettings {
    languageSet: LanguageSet;
    wordNeedsToGetCorrectTimes: number; // 1–10 (default 3)
    multiSelectChoicesAmount: number; // 2–10 (default 4)
    onlySecondLanguageWordsTested: boolean;
    everySecondTestIsMultiOrWriting: boolean;
    sentenceTestAllWords: boolean;
    answerDelayMs: number; // -1 = manual advance, 0–5000 ms
    testType: {
        writing: boolean;
        multiSelect: boolean;
        dragDrop: boolean;
        sentenceFillBlank: boolean;
    };
}
```

## LanguageSet

Represents a pair of word lists. Stored in `localStorage` under `LANGUAGE_SETS`.

```ts
interface LanguageSet {
    name: string;
    language1Words: string[];
    language2Words: string[];
    language1Name?: string; // e.g. "🇫🇮 Finnish"
    language2Name?: string; // e.g. "🇸🇪 Swedish"
    language1Sentences?: string[]; // optional, for fill-blank tests
    language2Sentences?: string[];
    hints?: string[]; // optional, aligned with the word lists
}
```

## TestWord

One entry per word pair during a test. Mutable during the test; frozen once stored in results.

```ts
interface TestWord {
    id: number;
    lang1Word: string;
    lang2Word: string;
    hint?: string; // shown with the question, not part of the answer
    timesCorrect: number;
    timesFailed: number;
    /** @deprecated Old history only; skip was merged into "I don't know". */
    timesSkipped?: number;
    /** "I don't know" presses. Read via timesDidntKnow() in resultUtils. */
    timesCheckedAnswer: number;
    totalAnswerTimeMs: number;
    answerAttempts: number;
    lang1Sentence?: string;
    lang2Sentence?: string;
    sentenceResults?: SentenceTestResult[];
}
```

## TestResults / HistoryEntry

```ts
interface TestResults {
    wordResults: TestWord[];
    timeTaken: string; // e.g. "2m 34s"
    date: Date;
    score: number;
}

interface HistoryEntry {
    id: string; // UUID
    date: string; // ISO 8601
    languageSetName: string;
    timeTaken: string;
    score: number;
    wordCount: number;
    wordResults: TestWord[];
}
```

## WordSet (import/export format)

Defined in `src/wordsets/types.ts`. Used for JSON file import/export and the built-in templates.

```ts
interface WordSet {
    name: string;
    language1?: string;
    language2?: string;
    // hint: optional clarification shown with the question, never part of the answer
    words: { lang1: string; lang2: string; hint?: string }[];
}
```

## localStorage keys

| Key                 | Type              | Description                          |
| ------------------- | ----------------- | ------------------------------------ |
| `SETTINGS`          | JSON object       | Persisted user settings + word input |
| `LANGUAGE_SETS`     | JSON array        | Saved LanguageSet[]                  |
| `TEST_HISTORY`      | JSON array        | HistoryEntry[]                       |
| `HIDE_INSTRUCTIONS` | `"true"` / absent | Dismiss the instructions banner      |

## Enums

```ts
enum TestOption {
    WriteCorrectAnswer,
    SelectFromMultiple,
    DragAndDrop,
    SentenceFillBlank,
}

enum TestState {
    Success,
    Failed,
    CheckedAnswer,
}
```
