export interface Language {
    flag: string;
    name: string;
}

export const LANGUAGES: Language[] = [
    { flag: "🇬🇧", name: "English" },
    { flag: "🇺🇸", name: "English (US)" },
    { flag: "🇫🇮", name: "Finnish" },
    { flag: "🇸🇪", name: "Swedish" },
    { flag: "🇩🇪", name: "German" },
    { flag: "🇫🇷", name: "French" },
    { flag: "🇪🇸", name: "Spanish" },
    { flag: "🇵🇹", name: "Portuguese" },
    { flag: "🇮🇹", name: "Italian" },
    { flag: "🇳🇱", name: "Dutch" },
    { flag: "🇳🇴", name: "Norwegian" },
    { flag: "🇩🇰", name: "Danish" },
    { flag: "🇵🇱", name: "Polish" },
    { flag: "🇷🇺", name: "Russian" },
    { flag: "🇺🇦", name: "Ukrainian" },
    { flag: "🇯🇵", name: "Japanese" },
    { flag: "🇨🇳", name: "Chinese" },
    { flag: "🇰🇷", name: "Korean" },
    { flag: "🇸🇦", name: "Arabic" },
    { flag: "🇹🇷", name: "Turkish" },
    { flag: "🇮🇳", name: "Hindi" },
    { flag: "🇨🇿", name: "Czech" },
    { flag: "🇭🇺", name: "Hungarian" },
    { flag: "🇷🇴", name: "Romanian" },
    { flag: "🇬🇷", name: "Greek" },
    { flag: "🇮🇱", name: "Hebrew" },
    { flag: "🇻🇳", name: "Vietnamese" },
    { flag: "🇹🇭", name: "Thai" },
    { flag: "🇮🇩", name: "Indonesian" },
];

export const LANGUAGE_OPTIONS = LANGUAGES.map((l) => `${l.flag} ${l.name}`);
