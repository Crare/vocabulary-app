# Component Map

A quick reference to every component in the app and what it does.

## Pages (`src/pages/`)

### Main (`pages/Main/`)

| File               | Description                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `Main.tsx`         | Application shell. Owns top-level view state, switches between child views, shows `BottomNav` on phones and sets `--bottom-nav-height`. |
| `Header.tsx`       | Solid indigo app bar. Desktop: page links (Word lists, History, Settings, Credits) and an Options button with a popover. Phone: an Options icon button that opens a bottom sheet. During a test the links hide and a mute toggle shows. |
| `BottomNav.tsx`    | Phone-only (< 900px) tab bar fixed to the bottom: Word lists, History, Settings. Hidden during a test.                             |
| `OptionsPanel.tsx` | Content of the Options sheet/popover: text size, sound volume with mute, dark mode, QR share and (phone only) Credits.            |
| `navConfig.ts`     | `NavView` type, the phone media query, tab bar height and pure helpers (`nextMuteVolume`, `buildQrUrl`).                          |

### Settings (`pages/Settings/`)

| File                    | Description                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SettingsView.tsx`      | Word list editor — text areas for two languages, sentence training, load/save/import/export/template buttons, instructions banner, and the "Start Test" CTA. |
| `TestConfigView.tsx`    | Settings tab — grouped switches, steppers and choice buttons for question types, direction, answer delay, etc., each with a plain-words explanation. |
| `testConfig.ts`         | Test config defaults, `readTestConfig` (validates stored values), and `loadTestConfig` / `saveTestConfig`, which merge into `SETTINGS`.                       |
| `LoadSetModal.tsx`      | Dialog listing saved word sets with load / download / delete actions.                                                                                        |
| `TemplateListModal.tsx` | Dialog listing built-in template word sets.                                                                                                                  |

### Testing (`pages/Testing/`)

| File                    | Description                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `TestingView.tsx`       | Orchestrates the test loop: picks next word, chooses test type, handles answers, calls `onEndTesting`. |
| `WriteTestCard.tsx`    | Writing question: question card plus a typed answer in the answer panel.                                                   |
| `SelectAnswerCard.tsx` | Multiple choice: option tiles in the answer panel; the right and picked tiles are coloured after answering.                |
| `DragDropTestCard.tsx` | Match pairs: tap two answers to swap, or drag one (a lifted copy follows the pointer/finger); Check pairs or show answers. |
| `SentenceTestCard.tsx` | Fill the gap: reference sentence, sentence with a blank, typed answer; the gap keeps what was typed.                       |
| `GuessWordTitle.tsx`   | Question card pieces: `QuestionCard`, `ModeLabel`, the word and its italic `Hint`.                                         |
| `AnswerPanel.tsx`      | Bottom panel of every question (sticky on phones): answer controls, divider, "I don't know"; then feedback + Continue.     |
| `TypedAnswerField.tsx` | Answer text field with the Check button beside it.                                                                         |
| `feedback.ts`          | Pure helpers building the feedback copy for each answer state.                                                             |
| `TestTopBar.tsx`       | List name, back-to-word-list (before the first answer) and the ⋯ button whose confirm sheet ends the test.                 |
| `TestingStatsCard.tsx` | Slim progress: words learned, words left, elapsed time.                                                                    |
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
| `CreditsView.tsx` | Attribution as grouped, full-width link rows (author, GitHub, libraries, sounds, data). |

## Shared components (`src/components/`)

| File                          | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `ProgressChart.tsx`           | Recharts line chart showing score over time.      |
| `WordScoreChart.tsx`          | Recharts bar chart of per-word scores.            |
| `WordResultsTable.tsx`        | MUI DataGrid showing word-level results.          |
| `TestSummaryChips.tsx`        | Chips summarising score, time, and word counts.   |
| `SentenceTrainingResults.tsx` | Expandable section showing sentence test details. |
| `TimeTaken.tsx`               | Live clock component used during testing.         |
| `SettingControls.tsx`         | Settings-list rows: `SettingsGroup`, `SwitchRow`, `StepperRow`, `ChoiceRow`. |
| `QrCodeModal.tsx`             | QR code of the app's address with Copy and Share; a bottom sheet on phones. |

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
