import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders title and subtitle", () => {
  render(<App />);
  const titleElement = screen.getByText(/Vocabulary-app/i);
  expect(titleElement).toBeInTheDocument();
  const subtitleElement = screen.getByText(
    /Memorize any vocabulary by repetition./i
  );
  expect(subtitleElement).toBeInTheDocument();
});
