// @vitest-environment jsdom
import { expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

const localStorageMock = (() => {
    const store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    };
})();

beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
});

test("renders title and subtitle", () => {
    render(<App />);
    const titleElement = screen.getByRole("heading", {
        level: 3,
        name: /Word Lists/i,
    });
    expect(titleElement).toBeInTheDocument();
});
