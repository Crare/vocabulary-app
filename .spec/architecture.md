# Architecture Overview

## Application type

Single-page React application (SPA) built with Vite, TypeScript, and MUI.
Deployed as a static site to GitHub Pages. No backend — all data is stored in the browser's `localStorage`.

## Directory layout

```
src/
├── App.tsx               # Root component (providers only)
├── index.tsx             # ReactDOM entry point
├── index.css             # Global styles + skip-to-content link
├── theme.ts              # MUI theme factory
├── ThemeContext.tsx       # Light/dark mode context
├── SoundContext.tsx       # Volume + sound-effect context
├── colors.ts             # Design tokens (colours, gradients, alpha helpers)
├── pages/                # One folder per "route" / view
│   ├── Main/             # Shell: header + view switching
│   ├── Settings/         # Word list editor + test configuration
│   ├── Testing/          # All test card components + logic
│   ├── Results/          # Post-test results & charts
│   ├── History/          # Historical test entries
│   └── Credits/          # Attribution page
├── components/           # Shared presentational components
├── hooks/                # Custom hooks (useDate, etc.)
├── util/                 # Pure helpers, localStorage wrappers, logger, sounds
└── wordsets/             # Built-in word set JSON + TypeScript types
tests/                    # Vitest unit tests (mirrors src structure)
.spec/                    # This directory — AI agent guidance
```

## Routing

There is no client-side router. `Main.tsx` holds a `view` state that toggles between `"wordlists" | "settings" | "testing" | "results" | "history" | "credits"`. The `Header` renders MUI `Tabs` that drive navigation.

## State management

- **No global store** — state lives in `useState` / `useRef` inside `Main.tsx` and is passed down as props.
- **`ThemeContext`** — provides `mode` (light/dark) and `toggleMode`.
- **`SoundContext`** — provides `volume`, `setVolume`, and playback callbacks (`onCorrect`, `onWrong`, `onFinish`, `onStart`).
- **`localStorage`** — persists: user settings (`SETTINGS`), saved word sets (`LANGUAGE_SETS`), and test history (`TEST_HISTORY`).

## Build & deploy

| Command             | What it does                               |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Vite dev server at `:3000/vocabulary-app/` |
| `npm run build`     | `tsc && vite build` → `build/`             |
| `npm run preview`   | Serve production build locally             |
| `npm run deploy`    | Build + `gh-pages -d build`                |
| `npm test`          | Vitest (watch mode by default)             |
| `npm test -- --run` | Vitest single run                          |

## Key conventions

- **No class components** — everything is a function component with hooks.
- **MUI `sx` prop** — all styling is inline via MUI's `sx` or `style` (for `<textarea>`). No CSS modules.
- **Flat component hierarchy** — pages import their own sub-components; shared components live in `src/components/`.
- **Structured logging** — `createLogger(tag)` from `src/util/logger.ts` gives `log.info(event, data)` etc.
- **Strict TS** — `tsconfig.json` uses `strict: true`.
