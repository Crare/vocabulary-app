import { describe, it, expect, vi, afterEach } from "vitest";
import {
    shuffle,
    randomIntFromInterval,
    levenshteinDistance,
    stringSimilarity,
} from "../src/util/helpers";

describe("helpers", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("shuffle", () => {
        it("should preserve all elements", () => {
            const arr = [1, 2, 3, 4, 5];
            const original = [...arr];
            shuffle(arr);
            expect(arr).toHaveLength(original.length);
            expect([...arr].sort((a, b) => a - b)).toEqual(
                original.sort((a, b) => a - b),
            );
        });

        it("should handle an empty array", () => {
            const arr: number[] = [];
            shuffle(arr);
            expect(arr).toEqual([]);
        });

        it("should handle a single-element array", () => {
            const arr = [42];
            shuffle(arr);
            expect(arr).toEqual([42]);
        });

        it("should mutate the array in place", () => {
            const arr = [1, 2, 3];
            const ref = arr;
            shuffle(arr);
            expect(arr).toBe(ref);
        });
    });

    describe("randomIntFromInterval", () => {
        it("should return min when Math.random returns 0", () => {
            vi.spyOn(Math, "random").mockReturnValue(0);
            expect(randomIntFromInterval(1, 4)).toBe(1);
        });

        it("should return max when Math.random returns just below 1", () => {
            vi.spyOn(Math, "random").mockReturnValue(0.9999);
            expect(randomIntFromInterval(1, 4)).toBe(4);
        });

        it("should return min when min and max are the same", () => {
            vi.spyOn(Math, "random").mockReturnValue(0.5);
            expect(randomIntFromInterval(3, 3)).toBe(3);
        });

        it("should handle a range starting at 0", () => {
            vi.spyOn(Math, "random").mockReturnValue(0);
            expect(randomIntFromInterval(0, 10)).toBe(0);
        });
    });

    describe("levenshteinDistance", () => {
        it("should return 0 for identical strings", () => {
            expect(levenshteinDistance("hello", "hello")).toBe(0);
        });

        it("should return the length of the other string when one is empty", () => {
            expect(levenshteinDistance("", "abc")).toBe(3);
            expect(levenshteinDistance("abc", "")).toBe(3);
        });

        it("should return 1 for a single substitution", () => {
            expect(levenshteinDistance("cat", "car")).toBe(1);
        });

        it("should return 1 for a single insertion", () => {
            expect(levenshteinDistance("cat", "cats")).toBe(1);
        });

        it("should return 1 for a single deletion", () => {
            expect(levenshteinDistance("cats", "cat")).toBe(1);
        });

        it("should return 2 for two adjacent swapped characters", () => {
            expect(levenshteinDistance("ab", "ba")).toBe(2);
        });

        it("should handle completely different strings", () => {
            expect(levenshteinDistance("abc", "xyz")).toBe(3);
        });
    });

    describe("stringSimilarity", () => {
        it("should return 1 for identical strings", () => {
            expect(stringSimilarity("hello", "hello")).toBe(1);
        });

        it("should return 1 for two empty strings", () => {
            expect(stringSimilarity("", "")).toBe(1);
        });

        it("should return 0 for completely different strings of equal length", () => {
            expect(stringSimilarity("abc", "xyz")).toBeCloseTo(0, 5);
        });

        it("should return ~0.857 for 'hermosa' vs 'hermoza' (1 diff in 7 chars)", () => {
            const sim = stringSimilarity("hermosa", "hermoza");
            expect(sim).toBeCloseTo(6 / 7, 3);
            expect(sim).toBeGreaterThanOrEqual(0.8);
        });

        it("should return 0.75 for 'hola' vs 'holo' (1 diff in 4 chars)", () => {
            expect(stringSimilarity("hola", "holo")).toBe(0.75);
        });
    });
});
