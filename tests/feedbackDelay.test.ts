import { describe, expect, it } from "vitest";
import {
  feedbackDelayMs,
  MISTAKE_EXTRA_DELAY_MS,
} from "../src/pages/Testing/feedback";

describe("feedbackDelayMs", () => {
  it("keeps the set delay after a correct answer", () => {
    expect(feedbackDelayMs(1500, false)).toBe(1500);
  });

  it("shows the right answer 500 ms longer after a mistake", () => {
    expect(MISTAKE_EXTRA_DELAY_MS).toBe(500);
    expect(feedbackDelayMs(1500, true)).toBe(2000);
    expect(feedbackDelayMs(0, true)).toBe(500);
  });

  it("never auto-advances in manual mode", () => {
    expect(feedbackDelayMs(-1, true)).toBeUndefined();
    expect(feedbackDelayMs(-1, false)).toBeUndefined();
  });
});
