import { describe, it, expect } from "vitest";
import { getTimeBetweenDates, calcTimeTakenText } from "../src/hooks/useDate";

const makeDate = (secondsOffset: number): Date =>
  new Date(secondsOffset * 1000);

const start = makeDate(0);

describe("useDate", () => {
  describe("getTimeBetweenDates", () => {
    it("should return all zeros when dates are the same", () => {
      expect(getTimeBetweenDates(start, start)).toEqual({
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
      });
    });

    it("should return correct seconds for a 5-second difference", () => {
      const result = getTimeBetweenDates(start, makeDate(5));
      expect(result).toEqual({
        seconds: 5,
        minutes: 0,
        hours: 0,
        days: 0,
      });
    });

    it("should return normalized values for a 90-second difference", () => {
      const result = getTimeBetweenDates(start, makeDate(90));
      expect(result.seconds).toBe(30);
      expect(result.minutes).toBe(1);
      expect(result.hours).toBe(0);
      expect(result.days).toBe(0);
    });

    it("should return normalized values for a 3661-second difference", () => {
      const result = getTimeBetweenDates(start, makeDate(3661));
      expect(result.seconds).toBe(1);
      expect(result.minutes).toBe(1);
      expect(result.hours).toBe(1);
      expect(result.days).toBe(0);
    });

    it("should roll 24 hours into 1 day", () => {
      const result = getTimeBetweenDates(start, makeDate(86400));
      expect(result.seconds).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.days).toBe(1);
    });
  });

  describe("calcTimeTakenText", () => {
    it("should return empty string for 0 seconds", () => {
      expect(calcTimeTakenText(start, start)).toBe("");
    });

    it("should return '5s' for 5 seconds", () => {
      expect(calcTimeTakenText(start, makeDate(5))).toBe("5s");
    });

    it("should include minutes and remaining seconds for 90 seconds", () => {
      expect(calcTimeTakenText(start, makeDate(90))).toBe("1min 30s");
    });

    it("should include normalized hours, minutes and seconds for 3661 seconds", () => {
      expect(calcTimeTakenText(start, makeDate(3661))).toBe("1h 1min 1s");
    });

    it("should include days for 86400 seconds", () => {
      expect(calcTimeTakenText(start, makeDate(86400))).toBe("1d");
    });

    it("should include day, hour, minute and second remainders", () => {
      expect(calcTimeTakenText(start, makeDate(90061))).toBe("1d 1h 1min 1s");
    });
  });
});
