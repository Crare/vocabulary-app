# Coding Conventions

## Language & tooling

- **TypeScript** with `strict: true`. Never use `any` unless unavoidable (and add a comment explaining why).
- **React 19** — function components only, no class components.
- **Vite 5** — HMR in dev, tree-shaking in prod.
- **MUI 7** — use the `sx` prop for styling; avoid separate CSS files (except `index.css` for global rules).

## File naming

| Kind         | Pattern                             | Example             |
| ------------ | ----------------------------------- | ------------------- |
| Component    | PascalCase `.tsx`                   | `WriteTestCard.tsx` |
| Hook         | camelCase `.ts` starting with `use` | `useDate.ts`        |
| Util / logic | camelCase `.ts`                     | `testLogic.ts`      |
| Types        | placed inside the relevant module   | `types.ts`          |
| Test         | `<name>.test.ts(x)` in `tests/`     | `testLogic.test.ts` |

## Component guidelines

- Keep components under ~300 lines. If a component grows beyond that, extract sub-components.
- Props interfaces go in the same file, named `<Component>Props`.
- Default exports only for the `Main` page component; everything else uses named exports.
- Use `useCallback` / `useMemo` only when there is a measurable performance reason or dependency issue.

## State & data flow

- State is lifted to `Main.tsx` and passed down. Do **not** introduce Redux or Zustand.
- For cross-cutting concerns (theme, sound), use React Context.
- LocalStorage access is wrapped in `src/util/historyStorage.ts` for history and inline in `SettingsView` / `TestConfigView` for settings. Prefer adding helpers to `util/` for new storage needs.

## Styling

- Use MUI's `sx` prop or the `style` attribute (for native elements like `<textarea>`).
- Design tokens (colours, gradients, alphas) live in `src/colors.ts`. Always reference tokens instead of hard-coding hex values.
- Theme customisation is in `src/theme.ts`.

## Logging

- Use `createLogger(tag)` from `src/util/logger.ts`.
- Every user action should log an event: `log.info("event_name", { key: value })`.
- Use snake_case for event names.

## Accessibility

- All interactive elements must have an `aria-label` or visible label.
- Test feedback (correct / incorrect) should use `role="status"` + `aria-live="assertive"`.
- Tooltips via MUI `<Tooltip>` on buttons and controls.
- Semantic HTML: `<nav>`, `<main>`, proper heading order.
- Skip-to-content link in `index.css`.

## Error handling

- Wrap `JSON.parse` / `localStorage` calls in try/catch and log failures.
- Never let an uncaught error crash the UI; degrade gracefully.

## Testing

- See `.spec/testing.md` for the full testing guide.
- Every new pure-logic function should have a matching test in `tests/`.
- Run `npm test -- --run` before pushing.
