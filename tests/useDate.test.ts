import { describe, it, expect } from "vitest";
import {
    getTimeBetweenDates,
    calcTimeTakenText,
} from "../src/hooks/useDate";

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
            expect(result).toEqual({ seconds: 5, minutes: 0, hours: 0, days: 0 });
        });

        it("should return total seconds and minutes for a 90-second difference", () => {
            const result = getTimeBetweenDates(start, makeDate(90));
            expect(result.seconds).toBe(90);
            expect(result.minutes).toBe(1);
            expect(result.hours).toBe(0);
            expect(result.days).toBe(0);
        });

        it("should return cumulative totals for a 3661-second difference", () => {
            const result = getTimeBetweenDates(start, makeDate(3661));
            expect(result.seconds).toBe(3661);
            expect(result.minutes).toBe(61);
            expect(result.hours).toBe(1);
            expect(result.days).toBe(0);
        });

        it("should return days for an 86400-second difference", () => {
            const result = getTimeBetweenDates(start, makeDate(86400));
            expect(result.seconds).toBe(86400);
            expect(result.minutes).toBe(1440);
            expect(result.hours).toBe(24);
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

        it("should include minutes and total seconds for 90 seconds", () => {
            expect(calcTimeTakenText(start, makeDate(90))).toBe("1min 90s");
        });

        it("should include hours, total minutes and total seconds for 3661 seconds", () => {
            expect(calcTimeTakenText(start, makeDate(3661))).toBe(
                "1h 61min 3661s",
            );
        });

        it("should include days for 86400 seconds", () => {
            expect(calcTimeTakenText(start, makeDate(86400))).toBe(
                "1days 24h 1440min 86400s",
            );
        });
    });
});
