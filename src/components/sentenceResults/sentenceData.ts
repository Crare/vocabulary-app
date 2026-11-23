import { TestWord } from "../../pages/Testing/types";


export interface SentenceRow {
    id: number;
    word: string;
    testedWord: string;
    sentence: string;
    correct: boolean;
}

export function buildSentenceData(wordResults: TestWord[]): SentenceRow[] {
    const data: SentenceRow[] = [];
    let id = 0;
    for (const w of wordResults) {
        if (w.sentenceResults) {
            for (const sr of w.sentenceResults) {
                data.push({
                    id: id++,
                    word: `${w.lang1Word} / ${w.lang2Word}`,
                    testedWord: sr.testedWord,
                    sentence: sr.sentence,
                    correct: sr.correct,
                });
            }
        }
    }
    return data;
}

/** Per-word stats across all sentence attempts */
export interface WordStats {
    total: number;
    correct: number;
    failed: number;
}
