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

/**
 * Calculate the average answer time for a single word in seconds.
 * Returns 0 when the word has no answer attempts.
 */
export const calculateAvgAnswerTime = (word: TestWord): number => {
    if (!word.answerAttempts || word.answerAttempts === 0) return 0;
    return word.totalAnswerTimeMs / word.answerAttempts / 1000;
};

/**
 * Format seconds into a human-readable string (e.g. "2.3s").
 */
export const formatSeconds = (seconds: number): string => {
    return `${seconds.toFixed(1)}s`;
};

/**
 * Calculate the overall average answer time across all words in seconds.
 */
export const calculateOverallAvgTime = (words: TestWord[]): number => {
    const totalMs = words.reduce(
        (sum, w) => sum + (w.totalAnswerTimeMs || 0),
        0,
    );
    const totalAttempts = words.reduce(
        (sum, w) => sum + (w.answerAttempts || 0),
        0,
    );
    if (totalAttempts === 0) return 0;
    return totalMs / totalAttempts / 1000;
};
