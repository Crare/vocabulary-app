export interface WordSet {
  name: string;
  language1?: string;
  language2?: string;
  words: WordInSet[];
  sentences?: WordInSet[];
}

export interface WordInSet {
  lang1: string;
  lang2: string;
  /** Optional clarification shown with the question; never part of the answer. */
  hint?: string;
}
