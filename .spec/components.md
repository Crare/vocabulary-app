# Component Map

A quick reference to every component in the app and what it does.

## Pages (`src/pages/`)

### Main (`pages/Main/`)

| File         | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `Main.tsx`   | Application shell. Owns top-level view state and switches between child views.   |
| `Header.tsx` | AppBar with navigation tabs, dark-mode toggle, volume control, and credits link. |

### Settings (`pages/Settings/`)

| File                    | Description                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SettingsView.tsx`      | Word list editor — text areas for two languages, sentence training, load/save/import/export/template buttons, instructions banner, and the "Start Test" CTA. |
| `TestConfigView.tsx`    | Test configuration — sliders and checkboxes for difficulty, test types, answer delay, etc.                                                                   |
| `LoadSetModal.tsx`      | Dialog listing saved word sets with load / download / delete actions.                                                                                        |
| `TemplateListModal.tsx` | Dialog listing built-in template word sets.                                                                                                                  |

### Testing (`pages/Testing/`)

| File                    | Description                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `TestingView.tsx`       | Orchestrates the test loop: picks next word, chooses test type, handles answers, calls `onEndTesting`. |
| `WriteTestCard.tsx`     | Card where the user types the translation.                                                             |
| `SelectAnswerCard.tsx`  | Card with multiple-choice buttons.                                                                     |
| `DragDropTestCard.tsx`  | Card where users drag/drop (or click-swap) words to match pairs.                                       |
| `SentenceTestCard.tsx`  | Card showing a sentence with a blank; user types the missing word.                                     |
| `GuessWordTitle.tsx`    | Shared heading showing the word to translate and the target language.                                  |
| `GuessResult.tsx`       | Visual feedback (correct / incorrect) after answering.                                                 |
| `TestingStatsCard.tsx`  | Progress bar, time elapsed, and words remaining.                                                       |
| `TestBottomButtons.tsx` | Action buttons: Reveal answer, Skip, End test, Continue, Back to start.                                |
| `testLogic.ts`          | Pure functions: `chooseTestOption`, `chooseGuessDirection`, `isAnswerCorrect`, etc.                    |
| `types.ts`              | All test-related TypeScript interfaces and enums.                                                      |

### Results (`pages/Results/`)

| File              | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `ResultsView.tsx` | Displays test results — summary chips, word table, charts, re-test selected. |
| `resultUtils.ts`  | Score calculation helpers.                                                   |

### History (`pages/History/`)

| File              | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `HistoryView.tsx` | Lists all past tests grouped by set name with search, delete, and charts. |

### Credits (`pages/Credits/`)

| File              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `CreditsView.tsx` | Attribution for frameworks, UI libraries, sounds, and data. |

## Shared components (`src/components/`)

| File                          | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `ProgressChart.tsx`           | Recharts line chart showing score over time.      |
| `WordScoreChart.tsx`          | Recharts bar chart of per-word scores.            |
| `WordResultsTable.tsx`        | MUI DataGrid showing word-level results.          |
| `TestSummaryChips.tsx`        | Chips summarising score, time, and word counts.   |
| `SentenceTrainingResults.tsx` | Expandable section showing sentence test details. |
| `TimeTaken.tsx`               | Live clock component used during testing.         |

## Contexts

| File               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `ThemeContext.tsx` | Light / dark mode provider using MUI's `ThemeProvider`.      |
| `SoundContext.tsx` | Volume state + synthesised sound playback via Web Audio API. |

## Hooks

| File               | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `hooks/useDate.ts` | `calcTimeTakenText(start, end)` — formats elapsed time. |

## Utilities (`src/util/`)

| File                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `helpers.ts`        | `shuffle`, `randomIntFromInterval`, general-purpose helpers. |
| `historyStorage.ts` | CRUD wrappers around `localStorage` for `TEST_HISTORY`.      |
| `logger.ts`         | `createLogger(tag)` — structured console logging.            |
| `sounds.ts`         | Web Audio API functions: `playCorrect`, `playWrong`, etc.    |
