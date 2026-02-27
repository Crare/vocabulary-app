import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { HistoryEntry } from "../Testing/types";
import { calculateTotalScore } from "../Results/resultUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProgressChart } from "../../components/ProgressChart";
import { WordScoreChart } from "../../components/WordScoreChart";
import { WordResultsTable } from "../../components/WordResultsTable";
import { TestSummaryChips } from "../../components/TestSummaryChips";
import { SentenceTrainingResults } from "../../components/SentenceTrainingResults";
import { alpha } from "../../colors";

interface HistoryGroupDetailProps {
  setName: string;
  entries: HistoryEntry[];
  onBack: () => void;
  onDeleteEntry: (id: string) => void;
  onDeleteGroup: (setName: string) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const HistoryGroupDetail = ({
  setName,
  entries,
  onBack,
  onDeleteEntry,
  onDeleteGroup,
}: HistoryGroupDetailProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          size="small"
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={700} sx={{ flex: 1 }}>
          {setName}
        </Typography>
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => onDeleteGroup(setName)}
        >
          Delete all
        </Button>
      </Box>

      {entries.length >= 2 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" mb={1}>
            Progress
          </Typography>
          <ProgressChart entries={entries} />
        </Box>
      )}

      <Typography variant="h6" mb={1}>
        Tests ({entries.length})
      </Typography>

      {entries.map((entry) => (
        <EntryAccordion
          key={entry.id}
          entry={entry}
          onDelete={() => onDeleteEntry(entry.id)}
        />
      ))}
    </Box>
  );
};

/** Individual test entry accordion — charts render lazily on first expand */
const EntryAccordion = ({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete: () => void;
}) => {
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <Accordion
      disableGutters
      elevation={0}
      onChange={(_e, expanded) => {
        if (expanded) setHasOpened(true);
      }}
      sx={(theme) => ({
        border: 1,
        borderColor:
          theme.palette.mode === "dark" ? alpha.slate25 : alpha.primary15,
        borderRadius: "8px !important",
        mb: 1,
        "&:before": { display: "none" },
      })}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            width: "100%",
            pr: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flex: 1, minWidth: 100 }}
          >
            {formatDate(entry.date)}
          </Typography>
          <TestSummaryChips
            wordResults={entry.wordResults}
            timeTaken={entry.timeTaken}
            score={calculateTotalScore(entry.wordResults)}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {hasOpened ? (
          <>
            <WordScoreChart wordResults={entry.wordResults} />
            <WordResultsTable
              wordResults={entry.wordResults}
              variant="history"
            />
            <SentenceTrainingResults wordResults={entry.wordResults} compact />
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete entry
            </Button>
          </>
        ) : null}
      </AccordionDetails>
    </Accordion>
  );
};
