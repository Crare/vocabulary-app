import { describe, it, expect, vi, afterEach } from "vitest";
import { shuffle, randomIntFromInterval } from "../src/util/helpers";

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
});
