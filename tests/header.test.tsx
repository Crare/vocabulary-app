// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import { buildQrUrl, nextMuteVolume } from "../src/pages/Main/navConfig";

const store: Record<string, string> = {};
const localStorageMock = {
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

/** Makes every media query match (phone) or none match (desktop). */
const mockViewport = (phone: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: phone,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
};

beforeEach(() => {
  localStorageMock.clear();
  vi.stubGlobal("localStorage", localStorageMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("nextMuteVolume", () => {
  it("mutes when sound is on", () => {
    expect(nextMuteVolume(0.7, 0.7)).toBe(0);
  });

  it("restores the last audible volume when muted", () => {
    expect(nextMuteVolume(0, 0.3)).toBe(0.3);
  });

  it("falls back to 50% when no earlier volume is known", () => {
    expect(nextMuteVolume(0, null)).toBe(0.5);
    expect(nextMuteVolume(0, 0)).toBe(0.5);
  });
});

describe("buildQrUrl", () => {
  it("adds ref=qr", () => {
    expect(buildQrUrl("https://x.test/app/")).toBe("https://x.test/app/?ref=qr");
  });

  it("keeps an existing ref", () => {
    expect(buildQrUrl("https://x.test/?ref=mail")).toBe(
      "https://x.test/?ref=mail",
    );
  });
});

describe("Header on desktop", () => {
  beforeEach(() => mockViewport(false));

  it("shows the four page links and no tab bar", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    for (const name of ["Word lists", "History", "Settings", "Credits"]) {
      expect(within(nav).getByRole("button", { name })).toBeInTheDocument();
    }
    expect(within(nav).getByRole("button", { name: "Word lists" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("opens Options with text size, sound, dark mode and QR but no Credits row", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const dialog = await screen.findByRole("dialog", { name: "Options" });
    expect(within(dialog).getByRole("button", { name: "Larger text" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Mute sound" })).toBeInTheDocument();
    expect(within(dialog).getByRole("switch", { name: "Dark mode" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: /QR code/ })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /Credits/ })).toBeNull();
  });

  it("mutes and restores the volume", async () => {
    store.SOUND_VOLUME = "0.3";
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const dialog = await screen.findByRole("dialog", { name: "Options" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Mute sound" }));
    expect(within(dialog).getByText("0%")).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Turn sound on" }));
    expect(within(dialog).getByText("30%")).toBeInTheDocument();
  });
});

describe("Header on a phone", () => {
  beforeEach(() => mockViewport(true));

  it("shows a bottom tab bar with three tabs that switch pages", async () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const history = within(nav).getByRole("button", { name: "History" });
    expect(within(nav).getAllByRole("button")).toHaveLength(3);
    await userEvent.click(history);
    expect(history).toHaveAttribute("aria-current", "page");
  });

  it("puts Credits in the Options sheet", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Options" }));
    const sheet = await screen.findByRole("dialog", { name: "Options" });
    await userEvent.click(within(sheet).getByRole("button", { name: "Credits and about" }));
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    for (const tab of within(nav).getAllByRole("button")) {
      expect(tab).not.toHaveAttribute("aria-current");
    }
  });
});
