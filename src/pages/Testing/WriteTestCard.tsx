import { Box, Button, Card, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { GuessWordTitle } from "./GuessWordTitle";
import { TestOption, TestState, TestWord } from "./types";
import { GuessDirection } from "./testLogic";
import { useEffect, useRef, useState } from "react";

interface WriteTestCardProps {
    testState: TestState | undefined;
    guessWord: TestWord;
    testOption: TestOption;
    onSendAnswer: (value: string) => void;
    guessDirection?: GuessDirection;
    targetLanguageName?: string;
}

export const WriteTestCard = (props: WriteTestCardProps) => {
    const {
        guessWord,
        testOption,
        testState,
        onSendAnswer,
        guessDirection = "lang1to2",
        targetLanguageName,
    } = props;

    const [guessAnswer, setGuessAnswer] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const checkEnterForSendAnswer = (e: React.KeyboardEvent) => {
        if (e.code === "Enter" && guessAnswer) {
            onSendAnswer(guessAnswer);
        }
    };

    const sendAnswer = () => (guessAnswer ? onSendAnswer(guessAnswer) : null);

    useEffect(() => {
        if (testState === TestState.Success || testState === TestState.Failed) {
            setGuessAnswer("");
        }
        if (testState === undefined) {
            // Small delay to ensure the input is enabled before focusing
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [testState]);

    return (
        <Card sx={{ p: 3 }}>
            <GuessWordTitle
                guessWord={guessWord}
                testOption={testOption}
                guessDirection={guessDirection}
                targetLanguageName={targetLanguageName}
            />
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
                    value={guessAnswer}
                    onChange={(e) => setGuessAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    disabled={testState !== undefined}
                    onKeyUp={checkEnterForSendAnswer}
                    size="small"
                    fullWidth
                    autoFocus
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
                />
                <Button
                    variant="contained"
                    onClick={sendAnswer}
                    disabled={testState !== undefined}
                    endIcon={<SendIcon />}
                    sx={{ whiteSpace: "nowrap", px: 3 }}
                >
                    Send
                </Button>
            </Box>
        </Card>
    );
};
