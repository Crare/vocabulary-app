// @vitest-environment happy-dom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders title and subtitle", () => {
    render(<App />);
    const titleElement = screen.getByRole("heading", {
        level: 3,
        name: /Word Lists/i,
    });
    expect(titleElement).toBeInTheDocument();
});
