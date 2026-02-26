import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    chooseTestOption,
    chooseGuessDirection,
    getDisplayWord,
    getExpectedAnswer,
    isAnswerCorrect,
    getAnswerOptionsForDirection,
    countWordsLeft,
} from "../src/pages/Testing/testLogic";
import { TestOption, TestSettings, TestWord } from "../src/pages/Testing/types";

// Mock the randomIntFromInterval function
vi.mock("../src/util/helpers", () => ({
    randomIntFromInterval: vi.fn(),
}));

import { randomIntFromInterval } from "../src/util/helpers";

describe("testLogic", () => {
    const mockSettings: TestSettings = {
        languageSet: {
            name: "Test Set",
            language1Words: ["hello", "world"],
            language2Words: ["hola", "mundo"],
        },
        wordNeedsToGetCorrectTimes: 3,
        multiSelectChoicesAmount: 4,
        onlySecondLanguageWordsTested: false,
        everySecondTestIsMultiOrWriting: false,
        testType: "both",
    };

    const mockWord: TestWord = {
        id: 0,
        lang1Word: "hello",
        lang2Word: "hola",
        timesCorrect: 0,
        timesFailed: 0,
        timesSkipped: 0,
        timesCheckedAnswer: 0,
    };

    const mockWords: TestWord[] = [
        mockWord,
        {
            id: 1,
            lang1Word: "world",
            lang2Word: "mundo",
            timesCorrect: 0,
            timesFailed: 0,
            timesSkipped: 0,
            timesCheckedAnswer: 0,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("chooseTestOption", () => {
        it("should return WriteCorrectAnswer when testType is 'writing'", () => {
            const settings = { ...mockSettings, testType: "writing" as const };
            expect(chooseTestOption(settings, 0)).toBe(
                TestOption.WriteCorrectAnswer,
            );
            expect(chooseTestOption(settings, 1)).toBe(
                TestOption.WriteCorrectAnswer,
            );
        });

        it("should return SelectFromMultiple when testType is 'multi-select'", () => {
            const settings = {
                ...mockSettings,
                testType: "multi-select" as const,
            };
            expect(chooseTestOption(settings, 0)).toBe(
                TestOption.SelectFromMultiple,
            );
            expect(chooseTestOption(settings, 1)).toBe(
                TestOption.SelectFromMultiple,
            );
        });

        it("should alternate strictly when testType is 'both' and everySecondTestIsMultiOrWriting is true", () => {
            const settings = {
                ...mockSettings,
                testType: "both" as const,
                everySecondTestIsMultiOrWriting: true,
            };

            // Even indices = writing
            expect(chooseTestOption(settings, 0)).toBe(
                TestOption.WriteCorrectAnswer,
            );
            expect(chooseTestOption(settings, 2)).toBe(
                TestOption.WriteCorrectAnswer,
            );
            expect(chooseTestOption(settings, 4)).toBe(
                TestOption.WriteCorrectAnswer,
            );

            // Odd indices = multi-select
            expect(chooseTestOption(settings, 1)).toBe(
                TestOption.SelectFromMultiple,
            );
            expect(chooseTestOption(settings, 3)).toBe(
                TestOption.SelectFromMultiple,
            );
            expect(chooseTestOption(settings, 5)).toBe(
                TestOption.SelectFromMultiple,
            );
        });

        it("should choose randomly when testType is 'both' and everySecondTestIsMultiOrWriting is false", () => {
            const settings = {
                ...mockSettings,
                testType: "both" as const,
                everySecondTestIsMultiOrWriting: false,
            };

            // Mock returns 0 = WriteCorrectAnswer
            vi.mocked(randomIntFromInterval).mockReturnValueOnce(0);
            expect(chooseTestOption(settings, 0)).toBe(
                TestOption.WriteCorrectAnswer,
            );

            // Mock returns 1 = SelectFromMultiple
            vi.mocked(randomIntFromInterval).mockReturnValueOnce(1);
            expect(chooseTestOption(settings, 0)).toBe(
                TestOption.SelectFromMultiple,
            );
        });
    });

    describe("chooseGuessDirection", () => {
        it("should return 'lang1to2' when onlySecondLanguageWordsTested is true", () => {
            const settings = {
                ...mockSettings,
                onlySecondLanguageWordsTested: true,
            };
            expect(chooseGuessDirection(settings)).toBe("lang1to2");
        });

        it("should choose randomly when onlySecondLanguageWordsTested is false", () => {
            const settings = {
                ...mockSettings,
                onlySecondLanguageWordsTested: false,
            };

            // Mock returns 0 = lang1to2
            vi.mocked(randomIntFromInterval).mockReturnValueOnce(0);
            expect(chooseGuessDirection(settings)).toBe("lang1to2");

            // Mock returns 1 = lang2to1
            vi.mocked(randomIntFromInterval).mockReturnValueOnce(1);
            expect(chooseGuessDirection(settings)).toBe("lang2to1");
        });
    });

    describe("getDisplayWord", () => {
        it("should return lang1Word when direction is 'lang1to2'", () => {
            expect(getDisplayWord(mockWord, "lang1to2")).toBe("hello");
        });

        it("should return lang2Word when direction is 'lang2to1'", () => {
            expect(getDisplayWord(mockWord, "lang2to1")).toBe("hola");
        });
    });

    describe("getExpectedAnswer", () => {
        it("should return lang2Word when direction is 'lang1to2'", () => {
            expect(getExpectedAnswer(mockWord, "lang1to2")).toBe("hola");
        });

        it("should return lang1Word when direction is 'lang2to1'", () => {
            expect(getExpectedAnswer(mockWord, "lang2to1")).toBe("hello");
        });
    });

    describe("isAnswerCorrect", () => {
        it("should return true when guess matches expected answer for 'lang1to2'", () => {
            expect(isAnswerCorrect("hola", mockWord, "lang1to2")).toBe(true);
        });

        it("should return false when guess does not match expected answer for 'lang1to2'", () => {
            expect(isAnswerCorrect("mundo", mockWord, "lang1to2")).toBe(false);
            expect(isAnswerCorrect("hello", mockWord, "lang1to2")).toBe(false);
        });

        it("should return true when guess matches expected answer for 'lang2to1'", () => {
            expect(isAnswerCorrect("hello", mockWord, "lang2to1")).toBe(true);
        });

        it("should return false when guess does not match expected answer for 'lang2to1'", () => {
            expect(isAnswerCorrect("world", mockWord, "lang2to1")).toBe(false);
            expect(isAnswerCorrect("hola", mockWord, "lang2to1")).toBe(false);
        });
    });

    describe("getAnswerOptionsForDirection", () => {
        it("should return lang2Words when direction is 'lang1to2'", () => {
            const result = getAnswerOptionsForDirection(mockWords, "lang1to2");
            expect(result).toEqual(["hola", "mundo"]);
        });

        it("should return lang1Words when direction is 'lang2to1'", () => {
            const result = getAnswerOptionsForDirection(mockWords, "lang2to1");
            expect(result).toEqual(["hello", "world"]);
        });
    });

    describe("countWordsLeft", () => {
        it("should return total count when no words are completed", () => {
            const words = [
                { ...mockWord, timesCorrect: 0 },
                { ...mockWord, id: 1, timesCorrect: 1 },
                { ...mockWord, id: 2, timesCorrect: 2 },
            ];
            expect(countWordsLeft(words, 3)).toBe(3);
        });

        it("should return correct count when some words are completed", () => {
            const words = [
                { ...mockWord, timesCorrect: 3 },
                { ...mockWord, id: 1, timesCorrect: 1 },
                { ...mockWord, id: 2, timesCorrect: 4 },
                { ...mockWord, id: 3, timesCorrect: 0 },
            ];
            expect(countWordsLeft(words, 3)).toBe(2); // only word 1 and 3 left
        });

        it("should return 0 when all words are completed", () => {
            const words = [
                { ...mockWord, timesCorrect: 3 },
                { ...mockWord, id: 1, timesCorrect: 5 },
                { ...mockWord, id: 2, timesCorrect: 4 },
            ];
            expect(countWordsLeft(words, 3)).toBe(0);
        });

        it("should handle different correctTimesNeeded values", () => {
            const words = [
                { ...mockWord, timesCorrect: 3 },
                { ...mockWord, id: 1, timesCorrect: 4 },
                { ...mockWord, id: 2, timesCorrect: 5 },
            ];
            expect(countWordsLeft(words, 5)).toBe(2); // only word 2 is done
            expect(countWordsLeft(words, 4)).toBe(1); // word 1 and 2 are done
        });

        it("should return total count for empty array", () => {
            expect(countWordsLeft([], 3)).toBe(0);
        });
    });
});
