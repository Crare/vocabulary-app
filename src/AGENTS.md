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
- **Refs for mutable test state** — `TestingView` stores `testWords`, `questionIndex`, and `isAnswering` in `useRef` (not `useState`) to avoid stale closures. Always read from the ref, not from a captured variable.
- **Two settings files** — `SettingsView.tsx` handles word list input + some persisted settings; `TestConfigView.tsx` handles test configuration. Both read/write the same `SETTINGS` localStorage key. Be careful not to overwrite each other's fields.
- **testType changed from string to object** — `testType` was originally `"both" | "multi-select" | "writing"`. It is now an object `{ writing, multiSelect, dragDrop, sentenceFillBlank }`. Old persisted values may still be strings; the code guards against this.
- **Sentence training is optional** — sentence arrays may be `undefined` on `LanguageSet`. Always null-check.
- **Drag-and-drop uses both mouse and click** — `DragDropTestCard` supports HTML5 drag and a click-to-swap fallback. Keyboard support is via Enter/Space on each answer box.
- **Built-in word sets are imported statically** — `words1.json`–`words9.json` are bundled at build time. Adding a new set requires adding the import and pushing it into the `templates` array in `SettingsView`.
- **No backend** — everything is localStorage. There is no API layer to worry about.
- **MUI version 7** — some APIs changed from v5/v6 (e.g., `Grid` uses `size` prop instead of `xs`/`md`). Check the MUI 7 docs.
- **GitHub Pages base path** — the app is served under `/vocabulary-app/`, configured via `base` in `vite.config.ts` and `homepage` in `package.json`.
