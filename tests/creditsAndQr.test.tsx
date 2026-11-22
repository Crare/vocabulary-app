// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreditsView, creditGroups } from "../src/pages/Credits/CreditsView";
import { QrCodeModal, displayUrl } from "../src/components/QrCodeModal";

const URL = "https://crare.github.io/vocabulary-app/?ref=qr";

afterEach(() => {
  // Remove the share stub so later tests see a browser without sharing.
  delete (navigator as { share?: unknown }).share;
});

describe("CreditsView", () => {
  it("links every credit, opening in a new tab", () => {
    render(<CreditsView />);
    const total = creditGroups.reduce((n, g) => n + g.entries.length, 0);
    const links = screen.getAllByRole("link");
    // Every credit plus "Made by" and the GitHub link.
    expect(links).toHaveLength(total + 2);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

describe("QrCodeModal", () => {
  it("shows the address without the protocol", () => {
    expect(displayUrl(URL)).toBe("crare.github.io/vocabulary-app/?ref=qr");
  });

  it("copies the link and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<QrCodeModal open onClose={() => {}} url={URL} />);
    await user.click(screen.getByRole("button", { name: /Copy link/ }));
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(screen.getByRole("button", { name: /Copied/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });

  it("closes from the close button", async () => {
    const onClose = vi.fn();
    render(<QrCodeModal open onClose={onClose} url={URL} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("offers Share only where the browser can share", () => {
    const { unmount } = render(<QrCodeModal open onClose={() => {}} url={URL} />);
    expect(screen.queryByRole("button", { name: /Share link/ })).toBeNull();
    unmount();
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    render(<QrCodeModal open onClose={() => {}} url={URL} />);
    expect(screen.getByRole("button", { name: /Share link/ })).toBeInTheDocument();
  });
});
