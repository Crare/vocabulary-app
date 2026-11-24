

export interface CreditEntry {
  name: string;
  url: string;
  license: string;
  description: string;
}

export interface CreditGroup {
  title: string;
  entries: CreditEntry[];
}

const credit = (
  name: string,
  url: string,
  license: string,
  description: string,
): CreditEntry => ({ name, url, license, description });

export const creditGroups: CreditGroup[] = [
  {
    title: "Built with",
    entries: [
      credit("React", "https://react.dev/", "MIT", "Builds the user interface"),
      credit("Vite", "https://vite.dev/", "MIT", "Builds and serves the app"),
      credit(
        "TypeScript",
        "https://www.typescriptlang.org/",
        "Apache-2.0",
        "JavaScript with types",
      ),
    ],
  },
  {
    title: "Look and feel",
    entries: [
      credit(
        "MUI (Material UI)",
        "https://mui.com/",
        "MIT",
        "Buttons, dialogs and other components",
      ),
      credit(
        "MUI X Data Grid",
        "https://mui.com/x/react-data-grid/",
        "MIT",
        "Result tables",
      ),
      credit(
        "Material Icons",
        "https://mui.com/material-ui/material-icons/",
        "Apache-2.0",
        "Icons",
      ),
      credit("Emotion", "https://emotion.sh/", "MIT", "Styling engine behind MUI"),
      credit("Recharts", "https://recharts.org/", "MIT", "Progress and score charts"),
      credit(
        "Inter",
        "https://fonts.google.com/specimen/Inter",
        "OFL-1.1",
        "Typeface",
      ),
    ],
  },
  {
    title: "Sound, words and stats",
    entries: [
      credit(
        "Web Audio API",
        "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
        "Built in",
        "Sounds are made in the browser; no audio files",
      ),
      credit(
        "Built-in word lists",
        "https://github.com/Crare/vocabulary-app",
        "Project",
        "Word lists curated for this app",
      ),
      credit(
        "GoatCounter",
        "https://goatcounter.com/",
        "EUPL-1.2",
        "Privacy-friendly visit counts",
      ),
    ],
  },
];
