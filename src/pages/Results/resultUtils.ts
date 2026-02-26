import { TestWord } from "../Testing/types";

/**
 * Calculate a word's net score: correct answers minus all negative events.
 */
export const calculateScore = (word: TestWord): string => {
    const score =
        word.timesCorrect -
        word.timesFailed -
        word.timesSkipped -
        word.timesCheckedAnswer;
    return score.toString();
};

/**
 * Calculate percentage accuracy for a word.
 * Returns 0 when the word has never been tested.
 */
export const calculatePercentage = (word: TestWord): number => {
    const wrongTimes =
        word.timesCheckedAnswer + word.timesFailed + word.timesSkipped;
    const rightTimes = word.timesCorrect;
    const total = wrongTimes + rightTimes;
    if (total === 0) return 0;
    return Math.round((rightTimes / total) * 100);
};
