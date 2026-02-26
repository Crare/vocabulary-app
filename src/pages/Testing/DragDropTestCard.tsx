import { useCallback, useRef, useState } from "react";
import { Box, Button, Card, Chip, Typography } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckIcon from "@mui/icons-material/Check";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { TestWord } from "./types";
import { GuessDirection, getDisplayWord, getExpectedAnswer } from "./testLogic";
import { shuffle } from "../../util/helpers";
import { colors, alpha } from "../../colors";

/** Maximum words to show in a single drag-and-drop round. */
export const DRAG_DROP_BATCH_SIZE = 4;

export interface DragDropResult {
    word: TestWord;
    correct: boolean;
}

interface DragDropTestCardProps {
    words: TestWord[];
    guessDirection: GuessDirection;
    targetLanguageName?: string;
    onComplete: (results: DragDropResult[]) => void;
}

export const DragDropTestCard = ({
    words,
    guessDirection,
    targetLanguageName,
    onComplete,
}: DragDropTestCardProps) => {
    // Left column: display words (fixed)
    const displayWords = words.map((w) => getDisplayWord(w, guessDirection));

    // Expected correct answers for each row
    const expectedAnswers = words.map((w) =>
        getExpectedAnswer(w, guessDirection),
    );

    // Right column: answer words, shuffled on mount
    const [answers, setAnswers] = useState<string[]>(() => {
        const shuffled = [...expectedAnswers];
        // Shuffle until at least one position differs from correct
        do {
            shuffle(shuffled);
        } while (
            shuffled.length > 1 &&
            shuffled.every((a, i) => a === expectedAnswers[i])
        );
        return shuffled;
    });

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [correctMap, setCorrectMap] = useState<boolean[]>([]);
    const dragIndexRef = useRef<number | null>(null);

    const swapAnswers = useCallback((i: number, j: number) => {
        setAnswers((prev) => {
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
        });
    }, []);

    // Click-to-swap: tap one answer, then another to swap them (works on mobile)
    const handleClick = (index: number) => {
        if (checked) return;
        if (selectedIndex === null) {
            setSelectedIndex(index);
        } else if (selectedIndex === index) {
            setSelectedIndex(null);
        } else {
            swapAnswers(selectedIndex, index);
            setSelectedIndex(null);
        }
    };

    // HTML5 Drag-and-Drop handlers (desktop)
    const handleDragStart = (index: number) => {
        dragIndexRef.current = index;
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        const from = dragIndexRef.current;
        if (from !== null && from !== index) {
            swapAnswers(from, index);
        }
        dragIndexRef.current = null;
        setSelectedIndex(null);
    };

    const checkAnswers = () => {
        const results: DragDropResult[] = words.map((word, i) => ({
            word,
            correct: answers[i] === expectedAnswers[i],
        }));
        setCorrectMap(results.map((r) => r.correct));
        setChecked(true);
        // Show results briefly, then call onComplete
        setTimeout(() => onComplete(results), 2500);
    };

    const allCorrect = checked && correctMap.every(Boolean);
    const correctCount = correctMap.filter(Boolean).length;

    return (
        <Card sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
                <Chip
                    icon={<SwapVertIcon />}
                    label="Match the correct pairs"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1, color: "text.secondary" }}
                />
                {targetLanguageName && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5, fontSize: "0.8rem" }}
                    >
                        Answer in:{" "}
                        <strong style={{ fontWeight: 600 }}>
                            {targetLanguageName}
                        </strong>
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5, fontSize: "0.75rem" }}
                >
                    Drag and drop or click two items on the right to swap them
                </Typography>
            </Box>

            {/* Column labels */}
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    mb: 1,
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ flex: 1, textAlign: "center" }}
                >
                    Question
                </Typography>
                <Box sx={{ width: "1.2rem", flexShrink: 0 }} />
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    sx={{ flex: 1, textAlign: "center" }}
                >
                    ↕ Drag to reorder
                </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {displayWords.map((display, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                        }}
                    >
                        {/* Left side — fixed question word */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: alpha.primary04,
                                border: "1.5px solid",
                                borderColor: "divider",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="body1" fontWeight={600}>
                                {display}
                            </Typography>
                        </Box>

                        {/* Arrow */}
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontSize: "1.2rem",
                                userSelect: "none",
                                flexShrink: 0,
                            }}
                        >
                            ↔
                        </Typography>

                        {/* Right side — draggable / clickable answer */}
                        <Box
                            draggable={!checked}
                            onDragStart={() => handleDragStart(i)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(i)}
                            onClick={() => handleClick(i)}
                            sx={{
                                flex: 1,
                                p: 1.5,
                                borderRadius: 2,
                                textAlign: "center",
                                cursor: checked ? "default" : "grab",
                                userSelect: "none",
                                transition: "all 0.2s ease",
                                border: "2px solid",
                                borderColor: checked
                                    ? correctMap[i]
                                        ? colors.emerald500
                                        : colors.red500
                                    : selectedIndex === i
                                      ? colors.indigo600
                                      : colors.indigo300,
                                bgcolor: checked
                                    ? correctMap[i]
                                        ? alpha.success10
                                        : alpha.error10
                                    : selectedIndex === i
                                      ? alpha.primary10
                                      : alpha.primary04,
                                boxShadow: checked
                                    ? "none"
                                    : selectedIndex === i
                                      ? "0 2px 8px rgba(79,70,229,0.25)"
                                      : "0 1px 4px rgba(0,0,0,0.1)",
                                "&:hover": !checked
                                    ? {
                                          borderColor: colors.indigo400,
                                          bgcolor: alpha.primary10,
                                          boxShadow:
                                              "0 2px 8px rgba(79,70,229,0.2)",
                                      }
                                    : undefined,
                                "&:active": !checked
                                    ? { cursor: "grabbing" }
                                    : undefined,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.5,
                            }}
                        >
                            {!checked && (
                                <DragIndicatorIcon
                                    sx={{
                                        fontSize: 18,
                                        color: "text.secondary",
                                        opacity: 0.6,
                                    }}
                                />
                            )}
                            <Typography variant="body1" fontWeight={600}>
                                {answers[i]}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            {!checked && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={checkAnswers}
                        size="large"
                    >
                        Check Answers
                    </Button>
                </Box>
            )}

            {checked && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography
                        variant="body1"
                        fontWeight={600}
                        color={allCorrect ? "success.main" : "error.main"}
                    >
                        {allCorrect
                            ? "All correct! 🎉"
                            : `${correctCount} / ${correctMap.length} correct`}
                    </Typography>
                </Box>
            )}
        </Card>
    );
};
