# AGENTS.md — AI Agent Guidance

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AgentMD file to help prevent future agents from having the same issue.

For detailed project specs (architecture, services, data models, deployment, testing), see the `.spec/` directory:

- [`.spec/architecture.md`](../.spec/architecture.md) — app structure, routing, state management, build commands.
- [`.spec/data-models.md`](../.spec/data-models.md) — every TypeScript interface, enum, and localStorage key.
- [`.spec/components.md`](../.spec/components.md) — full component map with one-line descriptions.
- [`.spec/testing.md`](../.spec/testing.md) — Vitest setup, file layout, and how to write new tests.
- [`.spec/conventions.md`](../.spec/conventions.md) — naming, styling, logging, accessibility, and error-handling rules.

All code must be optimized, readable, secure, and testable. Prefer clarity over cleverness, avoid premature abstractions, never hardcode secrets, and ensure new logic can be covered by unit tests.

## Gotchas & Pitfalls

- **No router** — view switching is a `useState` in `Main.tsx`, not React Router. Don't try to add route paths.
- **`sx` numbers between 0 and 1 are fractions** — `width: 1` in `sx` means 100%, not 1px. Write `"1px"` for visually hidden elements.
- **Test loop lives in `useTestSession`** — `pages/Testing/useTestSession.ts` owns the running test; `TestingView` only renders the current `round`. Word counters are one mutable array (never stale in timers); question picking is the pure `pickQuestion` in `testLogic.ts`, and a fill-the-gap question carries its blanked word (`question.blank`). Multiple-choice picks never use typo matching.
- **`?template=` links apply once per page load** — read them through `pendingTemplateRequest()` / `markTemplateRequestUsed()` in `wordsets/templates.ts`, never with module-level constants, or the template reloads over edits (and `autostart` restarts) every time Word lists remounts.
- **Views are lazy-loaded** — everything except Word lists is `React.lazy` in `Main.tsx`, inside `ViewErrorBoundary` (keyed by view) + `Suspense`. Component tests that navigate to another view must `await screen.findBy…`. In `vite dev` the first visit to a lazy view can trigger a dependency re-optimisation and a full page reload — that is dev-only; check lazy views with `vite build` + `vite preview`.
- **Shared styles** — `src/styles/surface.ts` (`isDark`, `hairline`, `tapBorder`, `surfaceSx`) and `src/styles/srOnly.ts`. Page `styles.ts` files re-export them; don't copy them again.
- **Two settings files** — `SettingsView.tsx` (with `useWordListEditor.ts`) handles word list input + some persisted settings; `TestConfigView.tsx` handles test configuration. Both read/write the same `SETTINGS` localStorage key. Be careful not to overwrite each other's fields. The Settings tab's fields go through `pages/Settings/testConfig.ts` (`saveTestConfig` merges, never replaces).
- **testType changed from string to object** — `testType` was originally `"both" | "multi-select" | "writing"`. It is now an object `{ writing, multiSelect, dragDrop, sentenceFillBlank }`. Old persisted values may still be strings; the code guards against this.
- **Sentence training is optional** — sentence arrays may be `undefined` on `LanguageSet`. Always null-check.
- **Drag-and-drop uses pointer events** — `DragDropTestCard` handles mouse and touch drags with pointer events (a lifted copy follows the pointer) plus tap-to-swap; each answer is a real button, so Enter/Space work from the keyboard.
- **No more Skip** — Skip and Show answer were merged into "I don't know", counted in `timesCheckedAnswer`. `timesSkipped` exists only in old history; always read misses through `timesDidntKnow()` in `resultUtils.ts`.
- **Built-in word sets are imported statically** — `words1.json`–`words13.json` are bundled at build time. Adding a new set requires adding the import and appending it to the `templates` array in `src/wordsets/templates.ts`. Only append: `?template=N` links use the 1-based position.
- **Word rows, not line-aligned text** — the editor keeps one `WordRow` (words + hint) per pair so hints cannot drift onto other words. `SETTINGS` and `LANGUAGE_SETS` still store line-aligned strings/arrays for compatibility; convert with the helpers in `pages/Settings/wordRows.ts` instead of splitting text by hand.
- **No backend** — everything is localStorage. There is no API layer to worry about.
- **MUI version 7** — some APIs changed from v5/v6 (e.g., `Grid` uses `size` prop instead of `xs`/`md`). Check the MUI 7 docs.
- **GitHub Pages base path** — the app is served under `/vocabulary-app/`, configured via `base` in `vite.config.ts` and `homepage` in `package.json`.
