import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { TestState, TestWord } from "./types";
import { GuessDirection } from "./testLogic";
import { Hint, ModeLabel, QuestionCard } from "./GuessWordTitle";
import { AnswerPanel, toneStyle } from "./AnswerPanel";
import { TypedAnswerField } from "./TypedAnswerField";
import { buildFeedback } from "./feedback";
import { randomIntFromInterval, stringSimilarity } from "../../util/helpers";
import { alpha, colors } from "../../colors";

interface SentenceTestCardProps {
    testState: TestState | undefined;
    guessWord: TestWord;
    guessDirection: GuessDirection;
    targetLanguageName?: string;
    referenceLanguageName?: string;
    /** Words already tested in sentence tests for this guessWord */
    alreadyTestedWords?: string[];
    /** When true, prefer blanking untested words first */
    testAllWords?: boolean;
    onSendAnswer: (
        correct: boolean,
        testedWord: string,
        sentence: string,
        typo?: boolean,
    ) => void;
    /** Called when the blank word is selected, so parent can use it for "I don't know" */
    onBlankWordSelected?: (word: string) => void;
    /** When true, close-but-not-exact answers count as correct (but show a typo warning) */
    allowTypos?: boolean;
    onDontKnow: () => void;
    onContinue: () => void;
    autoAdvanceMs?: number;
}


/**
 * Pick a word from the sentence to blank out.
 * If testAllWords is true, prefer words not yet in alreadyTestedWords.
 * Falls back to random if all words have been tested.
 */
function blankOutWord(
    sentence: string,
    testAllWords?: boolean,
    alreadyTestedWords?: string[],
): {
    blankedSentence: string;
    missingWord: string;
} {
    const words = sentence.split(/\s+/);
    if (words.length <= 1) {
        return { blankedSentence: "_____", missingWord: sentence.trim() };
    }

    let idx: number;

    if (testAllWords && alreadyTestedWords && alreadyTestedWords.length > 0) {
        const testedSet = new Set(
            alreadyTestedWords.map((w) => w.toLowerCase()),
        );
        // Find indices of words not yet tested
        const untestedIndices = words
            .map((w, i) => ({
                i,
                cleaned: w.replace(/[.,!?;:"""''()[\]{}]/g, "").toLowerCase(),
            }))
            .filter(
                (item) =>
                    item.cleaned.length > 0 && !testedSet.has(item.cleaned),
            )
            .map((item) => item.i);

        if (untestedIndices.length > 0) {
            idx =
                untestedIndices[
                    randomIntFromInterval(0, untestedIndices.length - 1)
                ];
        } else {
            // All words tested at least once — pick random
            idx = randomIntFromInterval(0, words.length - 1);
        }
    } else {
        idx = randomIntFromInterval(0, words.length - 1);
    }

    const missingWord = words[idx];
    // Strip punctuation from the missing word for answer matching
    const cleaned = missingWord.replace(/[.,!?;:"""''()[\]{}]/g, "");
    const blanked = [...words];
    blanked[idx] = "_____";
    return { blankedSentence: blanked.join(" "), missingWord: cleaned };
}

/** Fill-in-the-blank question: type the word missing from the sentence. */
export const SentenceTestCard = ({
    testState,
    guessWord,
    guessDirection,
    targetLanguageName,
    referenceLanguageName,
    alreadyTestedWords,
    testAllWords,
    onSendAnswer,
    onBlankWordSelected,
    allowTypos,
    onDontKnow,
    onContinue,
    autoAdvanceMs,
}: SentenceTestCardProps) => {
    const [guess, setGuess] = useState("");

    // The sentence with the blank is in the language being answered.
    const targetSentence =
        guessDirection === "lang1to2"
            ? guessWord.lang2Sentence
            : guessWord.lang1Sentence;
    // The same sentence in full, in the other language.
    const referenceSentence =
        guessDirection === "lang1to2"
            ? guessWord.lang1Sentence
            : guessWord.lang2Sentence;

    const [blankData, setBlankData] = useState(() => {
        if (!targetSentence) return null;
        const data = blankOutWord(
            targetSentence,
            testAllWords,
            alreadyTestedWords,
        );
        // Notify parent of the first blank word (setTimeout avoids setState during render)
        setTimeout(() => onBlankWordSelected?.(data.missingWord), 0);
        return data;
    });

    useEffect(() => {
        // Don't pick a new blank after answering, or the feedback would show
        // a different word than the one that was asked.
        if (testState !== undefined) return;
        if (targetSentence) {
            const data = blankOutWord(
                targetSentence,
                testAllWords,
                alreadyTestedWords,
            );
            setBlankData(data);
            onBlankWordSelected?.(data.missingWord);
        } else {
            setBlankData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetSentence, guessWord.id, testAllWords, alreadyTestedWords]);

    if (!blankData || !targetSentence) {
        return null; // no sentence data for this word
    }

    const send = () => {
        const guessNorm = guess.trim().toLowerCase();
        const expectedNorm = blankData.missingWord.toLowerCase();
        if (!guessNorm) return;
        const exact = guessNorm === expectedNorm;
        const isTypo =
            !exact &&
            allowTypos === true &&
            stringSimilarity(guessNorm, expectedNorm) >= 0.8;
        onSendAnswer(
            exact || isTypo,
            blankData.missingWord,
            targetSentence,
            isTypo,
        );
    };

    const revealed = testState === TestState.CheckedAnswer;
    const feedback = buildFeedback(
        testState,
        blankData.missingWord,
        revealed ? "" : guess,
    );
    // Keep the learner's own writing in the gap; the right word is in the panel.
    const gapText = revealed ? blankData.missingWord : guess;
    const [before, after] = blankData.blankedSentence.split("_____");

    return (
        <>
            <QuestionCard label="Sentence">
                <ModeLabel>
                    Fill the gap{targetLanguageName ? ` in ${targetLanguageName}` : ""}
                </ModeLabel>
                {referenceSentence && (
                    <Box
                        sx={(theme) => ({
                            width: "100%",
                            px: 1.75,
                            py: 1.5,
                            borderRadius: 3,
                            bgcolor:
                                theme.palette.mode === "dark"
                                    ? alpha.slate10
                                    : colors.slate50,
                        })}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                fontWeight: 600,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                            }}
                        >
                            {referenceLanguageName || "Reference"}
                        </Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                            {referenceSentence}
                        </Typography>
                    </Box>
                )}
                <Typography
                    component="p"
                    sx={{ m: 0, fontSize: "1.375rem", lineHeight: 1.6, fontWeight: 600 }}
                >
                    {before}
                    <Box
                        component="span"
                        aria-label={gapText ? `gap: ${gapText}` : "gap"}
                        sx={(theme) => {
                            const tone = feedback
                                ? toneStyle(feedback.tone, theme)
                                : undefined;
                            return {
                                display: "inline-block",
                                minWidth: 76,
                                px: 0.75,
                                borderBottom: `2.5px dashed ${tone ? tone.line : theme.palette.primary.main}`,
                                color: tone ? tone.ink : "primary.main",
                            };
                        }}
                    >
                        {gapText || "\u00a0"}
                    </Box>
                    {after}
                </Typography>
                <Hint hint={guessWord.hint} />
            </QuestionCard>
            <AnswerPanel
                feedback={feedback}
                onDontKnow={onDontKnow}
                onContinue={onContinue}
                autoAdvanceMs={revealed ? undefined : autoAdvanceMs}
            >
                <TypedAnswerField
                    id="sentence-answer"
                    label={`Missing word${targetLanguageName ? ` (${targetLanguageName})` : ""}`}
                    value={guess}
                    onChange={setGuess}
                    onSubmit={send}
                />
            </AnswerPanel>
        </>
    );
};
