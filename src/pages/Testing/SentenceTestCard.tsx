import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Chip, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { TestState, TestWord } from "./types";
import { GuessDirection } from "./testLogic";
import { randomIntFromInterval } from "../../util/helpers";
import { colors, alpha } from "../../colors";

interface SentenceTestCardProps {
    testState: TestState | undefined;
    guessWord: TestWord;
    guessDirection: GuessDirection;
    targetLanguageName?: string;
    /** Words already tested in sentence tests for this guessWord */
    alreadyTestedWords?: string[];
    /** When true, prefer blanking untested words first */
    testAllWords?: boolean;
    onSendAnswer: (
        correct: boolean,
        testedWord: string,
        sentence: string,
    ) => void;
    /** Called when the blank word is selected, so parent can use it for "Reveal answer" */
    onBlankWordSelected?: (word: string) => void;
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

export const SentenceTestCard = ({
    testState,
    guessWord,
    guessDirection,
    targetLanguageName,
    alreadyTestedWords,
    testAllWords,
    onSendAnswer,
    onBlankWordSelected,
}: SentenceTestCardProps) => {
    const [guess, setGuess] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // The sentence to test: the TARGET language sentence (the one with the blank)
    const targetSentence =
        guessDirection === "lang1to2"
            ? guessWord.lang2Sentence
            : guessWord.lang1Sentence;

    // The reference sentence: shown in full in the other language
    const referenceSentence =
        guessDirection === "lang1to2"
            ? guessWord.lang1Sentence
            : guessWord.lang2Sentence;

    // Compute blank once per guessWord change
    const [blankData, setBlankData] = useState(() => {
        if (!targetSentence) return null;
        const data = blankOutWord(
            targetSentence,
            testAllWords,
            alreadyTestedWords,
        );
        // Notify parent of initial blank word (setTimeout to avoid setState-during-render)
        setTimeout(() => onBlankWordSelected?.(data.missingWord), 0);
        return data;
    });

    useEffect(() => {
        // Don't recalculate the blanked word after an answer has been submitted,
        // otherwise the randomly-chosen blank word changes and the "correct answer"
        // feedback shows the wrong word.
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
    }, [
        targetSentence,
        guessWord.id,
        testAllWords,
        alreadyTestedWords,
        testState,
    ]);

    useEffect(() => {
        if (testState === TestState.Success || testState === TestState.Failed) {
            setGuess("");
        }
        if (testState === undefined) {
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [testState]);

    const handleKeyUp = (e: React.KeyboardEvent) => {
        if (e.code === "Enter" && guess && blankData && targetSentence) {
            const correct =
                guess.trim().toLowerCase() ===
                blankData.missingWord.toLowerCase();
            onSendAnswer(correct, blankData.missingWord, targetSentence);
        }
    };

    const handleSend = () => {
        if (guess && blankData && targetSentence) {
            const correct =
                guess.trim().toLowerCase() ===
                blankData.missingWord.toLowerCase();
            onSendAnswer(correct, blankData.missingWord, targetSentence);
        }
    };

    if (!blankData || !targetSentence) {
        return null; // no sentence data for this word
    }

    const referenceLangName =
        guessDirection === "lang1to2" ? "source" : "source";

    return (
        <Card sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Chip
                    icon={<ShortTextIcon />}
                    label="Fill in the missing word"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, color: "text.secondary" }}
                />
                {targetLanguageName && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1.5, fontSize: "0.8rem" }}
                    >
                        Answer in:{" "}
                        <strong style={{ fontWeight: 600 }}>
                            {targetLanguageName}
                        </strong>
                    </Typography>
                )}
            </Box>

            {/* Reference sentence (full, other language) */}
            {referenceSentence && (
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha.primary04,
                        border: "1.5px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                    >
                        Reference
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                        {referenceSentence}
                    </Typography>
                </Box>
            )}

            {/* Target sentence with blank */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                        "& span": {
                            color: colors.indigo400,
                            borderBottom: `2px dashed ${colors.indigo400}`,
                            px: 1,
                        },
                    }}
                    dangerouslySetInnerHTML={{
                        __html: blankData.blankedSentence.replace(
                            "_____",
                            "<span>_____</span>",
                        ),
                    }}
                />
            </Box>

            {/* Answer input */}
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    maxWidth: 420,
                    mx: "auto",
                }}
            >
                <TextField
                    inputRef={inputRef}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type the missing word..."
                    disabled={testState !== undefined}
                    onKeyUp={handleKeyUp}
                    size="small"
                    fullWidth
                    autoFocus
                    aria-label="Type the missing word from the sentence"
                    sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={testState !== undefined}
                    endIcon={<SendIcon />}
                    sx={{ whiteSpace: "nowrap", px: 3 }}
                >
                    Send
                </Button>
            </Box>

            {/* Show result feedback */}
            {testState === TestState.Success && (
                <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={600}
                    role="status"
                    aria-live="assertive"
                    sx={{ textAlign: "center", mt: 2 }}
                >
                    ✓ Correct! The word was: {blankData.missingWord}
                </Typography>
            )}
            {testState === TestState.Failed && (
                <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={600}
                    role="status"
                    aria-live="assertive"
                    sx={{ textAlign: "center", mt: 2 }}
                >
                    ✗ Incorrect! Correct answer: {blankData.missingWord}
                </Typography>
            )}
        </Card>
    );
};
