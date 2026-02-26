// @vitest-environment happy-dom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";

test("renders title and subtitle", () => {
    render(<App />);
    const titleElement = screen.getByRole("heading", {
        level: 1,
        name: /^Vocabulary$/i,
    });
    expect(titleElement).toBeInTheDocument();
    const subtitleElement = screen.getByText(
        /Memorize any vocabulary by repetition/i,
    );
    expect(subtitleElement).toBeInTheDocument();
});
