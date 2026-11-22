# Component Map

A quick reference to every component in the app and what it does.

## Pages (`src/pages/`)

### Main (`pages/Main/`)

| File         | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `Main.tsx`   | Application shell. Owns top-level view state and switches between child views.   |
| `Header.tsx` | AppBar with navigation tabs, dark-mode toggle, volume control, and credits link. |

### Settings (`pages/Settings/`)

The Word lists page is phone first: on phones it is one column with a sticky Start bar; from the `md` breakpoint the table gets a hint column and a side panel holds Practise and Lists.

| File                   | Description                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SettingsView.tsx`     | Word lists page. Wires the editor state, saved lists, import, paste, QR share and test start together.           |
| `useWordListEditor.ts` | Holds the list being edited and writes it to `SETTINGS` in the original newline-joined format.                   |
| `wordRows.ts`          | Pure row model: one `WordRow` per pair with its hint; converts to and from the stored formats.                   |
| `pasteList.ts`         | Pure parser for pasted `word = translation \| hint` lines and tab-separated rows.                                |
| `startTest.ts`         | Pure helpers that build `TestSettings` and the partition for a split test from the stored options.               |
| `CurrentListCard.tsx`  | List name, save, the ⋯ menu (download, QR code, clear), language pickers with swap, and the count line.          |
| `LanguagePicker.tsx`   | Button that opens a searchable language list; any typed name is accepted.                                        |
| `WordTable.tsx`        | Table editor: English/Finnish cells, "+ hint" (phone) or a hint column (desktop), delete, Add word, Paste list.  |
| `PasteListDialog.tsx`  | Paste dialog with preview, side swap, "Add to the end" and "Replace all rows".                                   |
| `ListPickerSheet.tsx`  | Bottom sheet (dialog on desktop) with Templates / My lists tabs, search, use, download and delete.               |
| `ListActions.tsx`      | Templates / My lists / Import tiles (phone) or the Lists panel (desktop), the tip banner, and the undo snackbar. |
| `PractisePanel.tsx`    | All / Half / Quarter choice and "Start test · N words", as the phone bar or the desktop card.                    |
| `SentenceSection.tsx`  | Collapsed sentence training section.                                                                             |
| `SegmentedControl.tsx` | Pill-style radio group or tab list.                                                                              |
| `styles.ts`            | Shared `sx` styles for the page.                                                                                 |
| `TestConfigView.tsx`    | Settings tab — grouped switches, steppers and choice buttons for question types, direction, answer delay, etc., each with a plain-words explanation. |
| `testConfig.ts`         | Test config defaults, `readTestConfig` (validates stored values), and `loadTestConfig` / `saveTestConfig`, which merge into `SETTINGS`.                       |

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

| File                      | Description                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `HistoryView.tsx`         | Word lists with past tests, newest first, with search and empty state. Phone: list or detail; desktop: both side by side. Owns delete, Undo and Clear all. |
| `HistoryListItem.tsx`     | One word list: latest score, change since the previous test, and a sparkline.                            |
| `HistoryGroupDetail.tsx`  | One word list: Latest/Best/First tiles, `ProgressChart`, words to practise, tests, delete-all.           |
| `HistoryTestRow.tsx`      | One past test that opens to show right / wrong / didn't-know counts per word, with hints.                |
| `ConfirmDeleteDialog.tsx` | Confirmation before deleting several tests (bottom sheet on phones).                                     |
| `Sparkline.tsx`           | Tiny accuracy line for a list card.                                                                       |
| `TrendBadge.tsx`          | "+7 pts" / "−3 pts" with an arrow.                                                                        |
| `historyStats.ts`         | Pure helpers: grouping, accuracy, summaries, weakest words, didn't-know counts, relative days.           |

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
| `historyStorage.ts` | CRUD wrappers around `localStorage` for `TEST_HISTORY` (incl. `restoreHistoryEntry` for Undo). |
| `logger.ts`         | `createLogger(tag)` — structured console logging.            |
| `sounds.ts`         | Web Audio API functions: `playCorrect`, `playWrong`, etc.    |
