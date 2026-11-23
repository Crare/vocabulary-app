# Testing Guide

## Framework

- **Vitest** (v4). Default environment is `node`; component tests start with `// @vitest-environment jsdom`.
- Only `tests/**/*.test.{ts,tsx}` run (copies in `.claude/worktrees` are ignored).
- **@testing-library/react** + **@testing-library/user-event** for component tests.
- **@testing-library/jest-dom** for extended DOM matchers.

## File layout

All test files live in the top-level `tests/` directory (not co-located):

```
tests/
├── App.test.tsx         # Smoke test: renders without crashing
├── header.test.tsx      # Header, Options panel and phone tab bar (mocks matchMedia for phone/desktop)
├── helpers.test.ts      # Unit tests for src/util/helpers.ts
├── resultUtils.test.ts  # Unit tests for src/pages/Results/resultUtils.ts
├── testLogic.test.ts    # Unit tests for src/pages/Testing/testLogic.ts
├── testingView.test.tsx # The whole test loop through TestingView (writing, typos, I don't know, auto-advance, all question types)
├── urlTemplate.test.tsx # ?template= / autostart links apply once per page load (imports App fresh per test)
├── viewErrorBoundary.test.tsx
└── useDate.test.ts      # Unit tests for src/hooks/useDate.ts
```

## Running tests

```sh
# Watch mode (default)
npm test

# Single run (CI)
npm test -- --run
```

## Writing new tests

1. Create a file in `tests/` named `<module>.test.ts` (or `.test.tsx` for components).
2. Import from `vitest`: `describe`, `it`, `expect`.
3. For component tests, import from `@testing-library/react` and render the component.
4. Keep tests focused: one behaviour per `it()`.
5. Use descriptive names: `it("returns empty array when input is empty")`.

## Conventions

- **localStorage is provided** — `src/setupTests.ts` gives every test a fresh in-memory `localStorage` (Node 25's own one is unusable without a flag). No per-file mocks needed.
- **Answer controls ignore clicks briefly** after they appear (`AnswerPanel` arm delay, `pointer-events: none`), so drive them with `fireEvent` rather than `userEvent`.
- **Lazy views** — after navigating to a view other than Word lists, use `await screen.findBy…`.
- **Pure logic first** — prefer testing `testLogic.ts`, `resultUtils.ts`, and `helpers.ts` (pure functions) over complex component wiring.
- **Snapshot tests** — not currently used; prefer explicit assertions.
- **No E2E** — the project does not have Playwright / Cypress tests yet.
