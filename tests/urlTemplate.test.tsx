// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  });

  it("autostarts only once, not every time Word lists opens again", async () => {
    await openAppAt("?template=1&autostart=true");
    // The test is running
    fireEvent.click(await screen.findByRole("button", { name: "Test options" }));
    fireEvent.click(screen.getByRole("button", { name: "End test and see results" }));
    // Results load lazily; navigation returns once the test has ended.
    await screen.findByRole("navigation", { name: "Main navigation" });

    goTo("Word lists");
    expect(screen.queryByRole("button", { name: "Test options" })).not.toBeInTheDocument();
    expect(window.location.search).not.toContain("autostart");
  });
});
