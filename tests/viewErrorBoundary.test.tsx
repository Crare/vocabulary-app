// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ViewErrorBoundary } from "../src/components/ViewErrorBoundary";

const Broken = (): never => {
  throw new Error("Failed to fetch dynamically imported module");
};

describe("ViewErrorBoundary", () => {
  it("renders the page when nothing fails", () => {
    render(
      <ViewErrorBoundary>
        <p>Page</p>
      </ViewErrorBoundary>,
    );
    expect(screen.getByText("Page")).toBeInTheDocument();
  });

  it("offers a reload instead of a blank screen when a page fails", () => {
    vi.spyOn(console, "error").mockImplementation(() => {}); // React logs the caught error
    const reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
    render(
      <ViewErrorBoundary>
        <Broken />
      </ViewErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("could not be loaded");
    fireEvent.click(screen.getByRole("button", { name: "Reload" }));
    expect(reload).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
