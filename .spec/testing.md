# Testing Guide

## Framework

- **Vitest** (v2) with `happy-dom` as the test environment.
- **@testing-library/react** + **@testing-library/user-event** for component tests.
- **@testing-library/jest-dom** for extended DOM matchers.

## File layout

All test files live in the top-level `tests/` directory (not co-located):

```
tests/
├── App.test.tsx         # Smoke test: renders without crashing
├── helpers.test.ts      # Unit tests for src/util/helpers.ts
├── resultUtils.test.ts  # Unit tests for src/pages/Results/resultUtils.ts
├── testLogic.test.ts    # Unit tests for src/pages/Testing/testLogic.ts
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

- **No mocking localStorage by default** — tests that touch storage should use `beforeEach` to clear it.
- **Pure logic first** — prefer testing `testLogic.ts`, `resultUtils.ts`, and `helpers.ts` (pure functions) over complex component wiring.
- **Snapshot tests** — not currently used; prefer explicit assertions.
- **No E2E** — the project does not have Playwright / Cypress tests yet.
