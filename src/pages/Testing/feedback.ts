import { TestState } from "./types";

export type FeedbackTone = "correct" | "typo" | "wrong" | "revealed";

export interface Feedback {
  tone: FeedbackTone;
  title: string;
  /** Short explanation shown under the title. */
  text?: string;
  /** The right answer, shown large. */
  answer?: string;
  /** Show a cross even when the tone isn't "wrong" (partly right pairs). */
  crossIcon?: boolean;
}

/** Copy for the "I don't know" action, shared by every question type. */
export const DONT_KNOW_LABEL = "I don't know – show answer";

/**
 * Build the feedback shown in the answer panel after a single-word answer.
 * Returns undefined while the learner is still answering.
 *
 * @param typed What the learner typed or picked; empty for "I don't know".
 */
export function buildFeedback(
  testState: TestState | undefined,
  answer: string,
  typed = "",
): Feedback | undefined {
  const wrote = typed.trim();
  switch (testState) {
    case TestState.Success:
      return { tone: "correct", title: "Correct", answer };
    case TestState.TypoMatch:
      return {
        tone: "typo",
        title: "Almost. Counted as correct",
        text: `You wrote “${wrote}”. The spelling is`,
        answer,
      };
    case TestState.Failed:
      return {
        tone: "wrong",
        title: "Not quite",
        text: wrote ? `You wrote “${wrote}”. The answer is` : "The answer is",
        answer,
      };
    case TestState.CheckedAnswer:
      return {
        tone: "revealed",
        title: "Answer shown",
        text: "Counted as a miss. This word comes back later.",
        answer,
      };
    default:
      return undefined;
  }
}

/** Feedback for a checked round of match-the-pairs. */
export function buildPairsFeedback(right: number, total: number): Feedback {
  if (right === total) {
    return { tone: "correct", title: `All ${total} pairs right` };
  }
  return {
    tone: right === 0 ? "wrong" : "typo",
    title: `${right} of ${total} pairs right`,
    text: "Wrong pairs show the right word in green.",
    crossIcon: true,
  };
}
