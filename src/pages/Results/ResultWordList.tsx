import { Box, Checkbox, Typography } from "@mui/material";
import { TestWord } from "../Testing/types";
import { formatOutcome, wordOutcome } from "./resultsSummary";
import { hairline } from "./styles";

import { OutcomeBar } from "./OutcomeBar";

interface ResultWordListProps {
  words: TestWord[];
  selected: ReadonlySet<number>;
  onToggle: (id: number) => void;
  /** "detailed" shows the answer breakdown and bar (mistakes); "compact" one line. */
  density: "detailed" | "compact";
}

/** Tickable word rows; ticked words are the ones a retest will use. */
export const ResultWordList = ({
  words,
  selected,
  onToggle,
  density,
}: ResultWordListProps) => (
  <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
    {words.map((w) => {
      const o = wordOutcome(w);
      const detailed = density === "detailed";
      const checkboxId = `retest-${w.id}`;
      return (
        <Box
          component="li"
          key={w.id}
          sx={(theme) => ({
            "&:not(:last-of-type)": { borderBottom: hairline(theme) },
          })}
        >
          <Box
            component="label"
            htmlFor={checkboxId}
            sx={{
              display: "grid",
              gridTemplateColumns: "44px minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: 1,
              minHeight: detailed ? 64 : 48,
              py: 0.5,
              pr: "14px",
              pl: "2px",
              cursor: "pointer",
            }}
          >
            <Checkbox
              id={checkboxId}
              checked={selected.has(w.id)}
              onChange={() => onToggle(w.id)}
              inputProps={{ "aria-label": `Retest ${w.lang1Word}` }}
            />
            <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
              {detailed ? (
                <>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, overflowWrap: "anywhere" }}>
                    {w.lang1Word}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", overflowWrap: "anywhere" }}>
                    {w.lang2Word}
                    {w.hint && (
                      <Box component="span" sx={{ ml: 0.75, fontStyle: "italic", color: "primary.dark" }}>
                        ({w.hint})
                      </Box>
                    )}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {formatOutcome(o)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {w.lang1Word}
                  </Box>
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {" · "}
                    {w.lang2Word}
                  </Box>
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {o.accuracy}%
              </Typography>
              {detailed && <OutcomeBar right={o.right} notRight={o.wrong + o.didntKnow} />}
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
);
