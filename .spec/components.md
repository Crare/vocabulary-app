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
| `TestConfigView.tsx`   | Settings tab — grouped switches, steppers and choice buttons for question types, direction, answer delay, etc.  |
| `testConfig.ts`        | Test config defaults, validation, and load/save helpers that merge into `SETTINGS`.                             |

### Testing (`pages/Testing/`)

| File                    | Description                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `TestingView.tsx`       | Renders the running test: top bar, progress and the card for the current question.                     |
| `useTestSession.ts`     | The test loop hook: picks questions, records answers, auto-advance, "I don't know", finishing once.     |
| `WriteTestCard.tsx`    | Writing question: question card plus a typed answer in the answer panel.                                                   |
| `SelectAnswerCard.tsx` | Multiple choice: option tiles in the answer panel; the right and picked tiles are coloured after answering.                |
| `DragDropTestCard.tsx` | Match pairs: tap two answers to swap, or drag one (a lifted copy follows the pointer/finger); Check pairs or show answers. |
| `SentenceTestCard.tsx` | Fill the gap: reference sentence, sentence with a blank, typed answer; the gap keeps what was typed.                       |
| `GuessWordTitle.tsx`   | Instruction line, the word to translate and its hint.                                                                      |
| `QuestionCard.tsx` / `ModeLabel.tsx` / `Hint.tsx` | The question card, its grey instruction line, and the italic hint.                                     |
| `PairAnswerButton.tsx` / `DragGhost.tsx` | One answer tile in match-the-pairs, and the copy that follows the pointer while dragging.                       |
| `toneStyle.ts` / `ToneIcon.tsx` | Colours and icon for each feedback tone.                                                                          |
| `sentenceLogic.ts`     | `blankOutWord`: picks the word to blank out of a sentence (prefers untested words).                                        |
| `AnswerPanel.tsx`      | Bottom panel of every question (sticky on phones): answer controls, divider, "I don't know"; then feedback + Continue.     |
| `TypedAnswerField.tsx` | Answer text field with the Check button beside it.                                                                         |
| `feedback.ts`          | Pure helpers building the feedback copy for each answer state.                                                             |
| `TestTopBar.tsx`       | List name, back-to-word-list (before the first answer) and the ⋯ button whose confirm sheet ends the test.                 |
| `TestingStatsCard.tsx` | Slim progress: words learned, words left, elapsed time.                                                                    |
| `testLogic.ts`          | Pure functions: `pickQuestion`, `matchAnswer`, `recordAttempt`, `createTestWords`, `getRemainingWords`, etc. |
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
| `settings/`                   | Settings-list rows, one per file: `SettingsGroup`, `SettingText`, `SwitchRow`, `StepperRow`, `ChoiceRow`. |
| `sentenceResults/`            | `sentenceData.ts` (rows + per-word stats) and `SentenceGroup.tsx` used by `SentenceTrainingResults`. |
| `ViewErrorBoundary.tsx`       | Shows "could not be loaded" + Reload instead of a blank page when a (lazy) view fails. |
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
| `hooks/useLatest.ts` | Ref that always holds the latest value, for stable callbacks/timers. |
| `hooks/useSwapDrag.ts` | Tap-to-swap and pointer drag-to-swap for a list of items (match the pairs). |
| `pages/Settings/useWordListEditor.ts` | The list being edited (rows, sentences, names), saved to `SETTINGS`; add/delete rows, swap languages. |
| `pages/Settings/useSavedLists.ts` | "My lists": save (update by name) and delete, always starting from storage. |
| `pages/Testing/useTestSession.ts` | The test loop (see Testing). |

## Utilities (`src/util/`)

| File                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `helpers.ts`        | `shuffle`, `randomIntFromInterval`, general-purpose helpers. |
| `historyStorage.ts` | CRUD wrappers around `localStorage` for `TEST_HISTORY` (incl. `restoreHistoryEntry` for Undo). |
| `logger.ts`         | `createLogger(tag)` — structured console logging.            |
| `sounds.ts`         | Web Audio API functions: `playCorrect`, `playWrong`, etc.    |
