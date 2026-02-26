import { describe, it, expect } from "vitest";
import {
    calculateScore,
    calculatePercentage,
} from "../src/pages/Results/resultUtils";
import { TestWord } from "../src/pages/Testing/types";

const makeWord = (
    timesCorrect: number,
    timesFailed: number,
    timesSkipped: number,
    timesCheckedAnswer: number,
): TestWord => ({
    id: 0,
    lang1Word: "hello",
    lang2Word: "hola",
    timesCorrect,
    timesFailed,
    timesSkipped,
    timesCheckedAnswer,
    totalAnswerTimeMs: 0,
    answerAttempts: 0,
});

describe("resultUtils", () => {
    describe("calculateScore", () => {
        it("should return '0' when all values are zero", () => {
            expect(calculateScore(makeWord(0, 0, 0, 0))).toBe("0");
        });

        it("should return positive score when only correct", () => {
            expect(calculateScore(makeWord(5, 0, 0, 0))).toBe("5");
        });

        it("should subtract failed, skipped, and checked from correct", () => {
            expect(calculateScore(makeWord(5, 2, 1, 1))).toBe("1");
        });

        it("should return a negative score when wrongs outweigh corrects", () => {
            expect(calculateScore(makeWord(1, 3, 2, 0))).toBe("-4");
        });
    });

    describe("calculatePercentage", () => {
        it("should return 0 when word has never been tested", () => {
            expect(calculatePercentage(makeWord(0, 0, 0, 0))).toBe(0);
        });

        it("should return 100 when all answers are correct", () => {
            expect(calculatePercentage(makeWord(5, 0, 0, 0))).toBe(100);
        });

        it("should return 50 for equal correct and wrong", () => {
            expect(calculatePercentage(makeWord(3, 3, 0, 0))).toBe(50);
        });

        it("should round to the nearest integer", () => {
            // 2 correct, 1 wrong = 2/3 = 66.67% → 67
            expect(calculatePercentage(makeWord(2, 1, 0, 0))).toBe(67);
        });

        it("should count failed, skipped, and checked as wrong", () => {
            // 4 correct, 1 failed, 1 skipped, 1 checked = 4/7 ≈ 57.14 → 57
            expect(calculatePercentage(makeWord(4, 1, 1, 1))).toBe(57);
        });
    });
});
