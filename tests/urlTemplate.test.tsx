// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

/** Load the app fresh, as if the page was opened at `search`. */
const openAppAt = async (search: string) => {
  window.history.replaceState({}, "", `/vocabulary-app/${search}`);
  vi.resetModules();
  const { default: App } = await import("../src/App");
  render(<App />);
};

const nav = () => screen.getByRole("navigation", { name: "Main navigation" });
const goTo = (page: string) =>
  fireEvent.click(within(nav()).getByRole("button", { name: page }));

/** Each test re-imports the whole app, so allow for a slow CI runner. */
const APP_RELOAD_TIMEOUT_MS = 20_000;

// Transform the app and its lazy views once, up front. A cold first import
// took ~10s on CI and timed the first test out; after this, each
// `openAppAt` only re-evaluates already transformed modules.
beforeAll(async () => {
  await Promise.all([
    import("../src/App"),
    import("../src/pages/Testing/TestingView"),
    import("../src/pages/Results/ResultsView"),
    import("../src/pages/History/HistoryView"),
  ]);
}, 60_000);

beforeEach(() => window.history.replaceState({}, "", "/vocabulary-app/"));
afterEach(() => window.history.replaceState({}, "", "/vocabulary-app/"));

describe("opening the app from a ?template= link", () => {
  it("loads the template once and keeps later edits after navigating", async () => {
    await openAppAt("?template=1");
    expect(screen.getByText(/IT-vocabulary set 1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Show & edit words/ }));
    fireEvent.change(screen.getByRole("textbox", { name: "List name" }), {
      target: { value: "My edited list" },
    });

    goTo("History");
    goTo("Word lists");

    expect(screen.getByRole("textbox", { name: "List name" })).toHaveValue("My edited list");
  }, APP_RELOAD_TIMEOUT_MS);

  it("autostarts only once, not every time Word lists opens again", async () => {
    await openAppAt("?template=1&autostart=true");
    // The test is running
    fireEvent.click(
      await screen.findByRole("button", { name: "Test options" }, { timeout: 5000 }),
    );
    fireEvent.click(screen.getByRole("button", { name: "End test and see results" }));
    // Results load lazily; navigation returns once the test has ended.
    await screen.findByRole(
      "navigation",
      { name: "Main navigation" },
      { timeout: 5000 },
    );

    goTo("Word lists");
    expect(screen.queryByRole("button", { name: "Test options" })).not.toBeInTheDocument();
    expect(window.location.search).not.toContain("autostart");
  }, APP_RELOAD_TIMEOUT_MS);
});
