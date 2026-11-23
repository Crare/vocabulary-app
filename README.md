[![pages-build-deployment](https://github.com/Crare/vocabulary-app/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Crare/vocabulary-app/actions/workflows/pages/pages-build-deployment)

# Vocabulary Trainer

> Learn any language vocabulary — add your own words or use built-in templates and let the app quiz you until every word sticks.

https://crare.github.io/vocabulary-app?ref=readme

## Features

- **Custom word lists** — type words in two languages (one per line), or import/export JSON files.
- **Built-in templates** — Finnish–Swedish and English–Finnish sets (including verbs) included; load them with one click.
- **Hints** — an optional hint per word (shown with the question, never part of the answer) tells apart words like "play" (game) and "play" (instrument).
- **Multiple test modes** — writing, multi-select, drag-and-drop matching, and sentence fill-in-the-blank.
- **Sentence training** — optionally add sentences for contextual practice.
- **Configurable difficulty** — adjust how many correct answers are needed, number of choices, answer delay, etc.
- **Progress tracking** — results, charts, and full test history stored in local storage.
- **Dark mode** — toggle between light and dark themes.
- **Sound effects** — synthesised audio feedback with adjustable volume.
- **Tooltips & instructions** — hover over buttons and controls for contextual help; a dismissible "How to use" banner guides new users.
- **Offline-ready** — works fully in the browser; no server required.

## Accessibility

The app follows WAI-ARIA best practices:

- **Skip-to-content link** — keyboard users can jump straight to the main area.
- **Semantic landmarks** — `<nav>`, `<main>` and proper heading hierarchy.
- **ARIA labels** — all inputs, sliders, buttons, and interactive elements have meaningful labels.
- **Live regions** — test results (correct / incorrect) are announced to screen readers via `aria-live="assertive"`.
- **Keyboard navigation** — drag-and-drop items support Enter / Space as alternatives; all controls are reachable via Tab.
- **Color contrast** — default theme colours meet WCAG AA.
- **Focus management** — text inputs auto-focus when a new question appears.

## Screenshots

The app is built phone first. These are from a phone-sized screen.

<table>
  <tr>
    <td align="center" width="33%"><img src="./readme-img/phone-home.jpg" width="250" alt="Word lists page with a template selected and a large Start test button"><br><sub><b>Pick a template and start</b><br>The page stays minimal until you want to edit.</sub></td>
    <td align="center" width="33%"><img src="./readme-img/phone-editor.jpg" width="250" alt="Word table with English and Finnish columns and optional hints"><br><sub><b>Edit words in a table</b><br>Optional hints tell apart words like play (game) and play (instrument).</sub></td>
    <td align="center" width="33%"><img src="./readme-img/phone-typo.jpg" width="250" alt="Writing question showing a typo counted as correct, with the right spelling"><br><sub><b>Type the answer</b><br>Small typos still count, with the right spelling shown.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-img/phone-wrong.jpg" width="250" alt="Wrong answer feedback showing what you wrote and the right answer"><br><sub><b>Learn from mistakes</b><br>See what you wrote next to the right answer.</sub></td>
    <td align="center"><img src="./readme-img/phone-choice.jpg" width="250" alt="Multiple choice question with four answers and an I don't know button"><br><sub><b>Multiple choice</b><br>Or press "I don't know" to see the answer.</sub></td>
    <td align="center"><img src="./readme-img/phone-match.jpg" width="250" alt="Match pairs question with hints under the words"><br><sub><b>Match pairs</b><br>Drag answers onto each other or tap two to swap.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-img/phone-match-checked.jpg" width="250" alt="Checked match pairs, with wrong pairs showing the right word"><br><sub><b>Checked pairs</b><br>Wrong pairs show the word that belongs there.</sub></td>
    <td align="center"><img src="./readme-img/phone-results.jpg" width="250" alt="Results page with the score and the words to practise"><br><sub><b>Results</b><br>Retest only the words you missed.</sub></td>
    <td align="center"><img src="./readme-img/phone-history.jpg" width="250" alt="History page listing word lists with their latest score and trend"><br><sub><b>History</b><br>Track progress per word list.</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="./readme-img/phone-settings.jpg" width="250" alt="Test settings with switches for each question type"><br><sub><b>Settings</b><br>Every option explained in plain words.</sub></td>
    <td></td>
    <td></td>
  </tr>
</table>

## Tech stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 5
- [TypeScript](https://www.typescriptlang.org/) 5
- [MUI](https://mui.com/) 7
- [Vitest](https://vitest.dev/) for testing
- Deployed to [GitHub Pages](https://pages.github.com/)

## Install

```sh
npm install
```

## Run

```sh
npm run dev
```

Opens at http://localhost:3000/vocabulary-app/

## Build

```sh
npm run build
```

## Test

Tests live in the `tests/` folder and use [Vitest](https://vitest.dev/).

Run once:

```sh
npm test -- --run
```

Run in watch mode:

```sh
npm test
```

## Preview production build locally

```sh
npm run preview
```

## Deploy to GitHub Pages

```sh
npm run deploy
```

## Project structure

```
src/
  pages/          # Route-level views (Main, Settings, Testing, Results, History, Credits)
  components/     # Shared UI components (charts, tables, chips)
  hooks/          # Custom React hooks
  util/           # Helpers, storage, logger, sounds
  wordsets/       # Built-in word set JSON files & types
tests/            # Vitest unit tests
.spec/            # Architecture & design specs for AI agents
```

## AI agent guidance

See [`src/AGENTS.md`](src/AGENTS.md) and the [`.spec/`](.spec/) directory for architecture docs, data models, and coding conventions aimed at AI coding assistants.
