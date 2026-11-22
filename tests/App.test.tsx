// @vitest-environment jsdom
import { expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
})();

beforeEach(() => {
  vi.stubGlobal("localStorage", localStorageMock);
});

test("renders the word list editor", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 2, name: "Words" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Start test/i }),
  ).toBeInTheDocument();
});
