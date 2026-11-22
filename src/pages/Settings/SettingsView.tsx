import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LanguageSet, PartitionContext, TestSettings } from "../Testing/types";
import { WordSet } from "../../wordsets/types";
import {
  findTemplate,
  setTemplateParam,
  templates,
} from "../../wordsets/templates";
import { languageName } from "../../wordsets/languages";
import { createLogger } from "../../util/logger";
import { downloadWordSetFile } from "../../util/download";
import {
  hideTip,
  isTipHidden,
  loadLanguageSets,
  loadPersistedSettings,
  saveLanguageSets,
} from "../../util/wordListStorage";
import { QrCodeModal } from "../../components/QrCodeModal";
import {
  checkRows,
  countSentences,
  isBlankRow,
  isCompleteRow,
  makeRow,
  pickRows,
  removeRow,
  RowValues,
  WordRow,
  rowsToColumns,
  sentenceColumns,
  swapRows,
  toWordSet,
  updateRow,
} from "./wordRows";
import {
  EditorList,
  listFromLanguageSet,
  listFromWordSet,
  NO_SENTENCES,
  useWordListEditor,
} from "./useWordListEditor";
import { buildTestStart, hasAnyTestType } from "./startTest";
import { CurrentListCard } from "./CurrentListCard";
import { WordTable } from "./WordTable";
import { PasteListDialog } from "./PasteListDialog";
import { ListPickerSheet, ListTab } from "./ListPickerSheet";
import {
  plural,
  savedSummary,
  summarise,
  templateSummaries,
} from "./listSummary";
import { PartSplit, PractisePanel } from "./PractisePanel";
import { SentenceSection } from "./SentenceSection";
import { ListActions, Notice, NoticeSnackbar, TipBanner } from "./ListActions";

const log = createLogger("settings");

// Resolve ?template=<index|name> once at module load so the first render can
// use it synchronously.
const _params = new URLSearchParams(window.location.search);
const _urlTemplateIndex = findTemplate(_params.get("template"));
const _urlTemplate =
  _urlTemplateIndex >= 0 ? templates[_urlTemplateIndex] : null;
const _urlAutostart = _params.get("autostart") === "true";

interface SettingsViewProps {
  onStartTest: (settings: TestSettings, partition?: PartitionContext) => void;
  onOpenTestSettings?: () => void;
}

export const SettingsView = ({
  onStartTest,
  onOpenTestSettings,
}: SettingsViewProps) => {
  const isDesktop = useMediaQuery(useTheme().breakpoints.up("md"), {
    noSsr: true,
  });
  const { list, setList, patch, setRows } = useWordListEditor(_urlTemplate);
  const [showTip, setShowTip] = useState(() => !isTipHidden());
  const [savedSets, setSavedSets] = useState<LanguageSet[]>(loadLanguageSets);
  const [sheetTab, setSheetTab] = useState<ListTab | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [split, setSplit] = useState<PartSplit>(1);
  const [hasTestType, setHasTestType] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { complete, incomplete } = checkRows(list.rows);
  const blockedReason =
    complete.length === 0
      ? "Add at least one word pair to start."
      : incomplete.length > 0
        ? `${incomplete.length === 1 ? "Word" : "Words"} ${incomplete.join(", ")} ${incomplete.length === 1 ? "needs" : "need"} both languages.`
        : !hasTestType
          ? "Select at least one test type in Settings."
          : null;
  const nonBlank = list.rows.filter((r) => !isBlankRow(r));
  const summary = summarise(
    nonBlank.length,
    nonBlank.filter((r) => r.hint.trim()).length,
    countSentences(list.sentences),
  );
  const lang1Label = languageName(list.lang1Name) || "Language 1";
  const lang2Label = languageName(list.lang2Name) || "Language 2";

  /** Replaces the whole list, offering undo when words would be lost. */
  const replaceList = (next: EditorList, message?: string) => {
    const previous = list;
    setList(next);
    if (message) setNotice({ message, undo: () => setList(previous) });
  };

  /** The list as a `LanguageSet`, keeping only rows that pass `keep`. */
  const languageSet = (keep: (row: WordRow) => boolean): LanguageSet => {
    const picked = pickRows(list.rows, list.sentences, keep);
    return {
      name: list.name.trim() || "unnamed language set",
      ...rowsToColumns(picked.rows),
      language1Name: list.lang1Name || undefined,
      language2Name: list.lang2Name || undefined,
      ...sentenceColumns(picked.sentences),
    };
  };

  const startTest = () => {
    if (blockedReason) return;
    const { settings, partition } = buildTestStart(
      languageSet(isCompleteRow),
      split,
      loadPersistedSettings(),
    );
    onStartTest(settings, partition);
  };

  const currentWordSet = (): WordSet => {
    const picked = pickRows(list.rows, list.sentences, (r) => !isBlankRow(r));
    return toWordSet(
      list.name || "word-set",
      list.lang1Name,
      list.lang2Name,
      picked.rows,
      picked.sentences,
    );
  };

  const saveList = () => {
    // Half-filled rows are kept so nothing typed is lost.
    const set = languageSet((r) => !isBlankRow(r));
    // Saving a named list again updates it; unnamed lists are always added.
    const existing = list.name.trim()
      ? savedSets.findIndex((s) => s.name === set.name)
      : -1;
    const next =
      existing >= 0
        ? savedSets.map((s, i) => (i === existing ? set : s))
        : [...savedSets, set];
    setSavedSets(next);
    saveLanguageSets(next);
    log.info("set_saved", {
      name: set.name,
      wordCount: set.language1Words.length,
      replaced: existing >= 0,
    });
    setNotice({
      message:
        existing >= 0
          ? `Updated “${set.name}” in My lists`
          : `Saved “${set.name}” to My lists`,
    });
  };

  const chooseList = (tab: ListTab, index: number) => {
    if (tab === "templates") {
      replaceList(listFromWordSet(templates[index]));
      setTemplateParam(index);
    } else {
      replaceList(listFromLanguageSet(savedSets[index]));
      setTemplateParam(null);
    }
    log.info("list_selected", { source: tab, index });
    setSheetTab(null);
  };

  const downloadList = (tab: ListTab, index: number) => {
    const l =
      tab === "templates" ? null : listFromLanguageSet(savedSets[index]);
    const set = l
      ? toWordSet(l.name, l.lang1Name, l.lang2Name, l.rows, l.sentences)
      : templates[index];
    downloadWordSetFile(set);
    log.info("set_downloaded", { source: tab, name: set.name });
  };

  const deleteSaved = (index: number) => {
    const next = savedSets.filter((_, i) => i !== index);
    setSavedSets(next);
    saveLanguageSets(next);
    log.info("set_deleted", {
      name: savedSets[index]?.name,
      remainingSets: next.length,
    });
  };

  const handleImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // so the same file can be imported again
    if (!file) return;
    log.info("import_file_started", {
      fileName: file.name,
      fileSize: file.size,
    });
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as WordSet;
        const isPair = (w: unknown) => !!w && typeof w === "object";
        if (
          !parsed.name ||
          !Array.isArray(parsed.words) ||
          !parsed.words.every(isPair) ||
          (parsed.sentences !== undefined &&
            (!Array.isArray(parsed.sentences) ||
              !parsed.sentences.every(isPair)))
        )
          throw new Error("not a word set");
        replaceList(listFromWordSet(parsed), `Imported “${parsed.name}”`);
        setTemplateParam(null);
      })
      .catch(() => {
        log.error("import_parse_failed", { fileName: file.name });
        setNotice({
          message:
            "That file is not a word set. Choose a .json file downloaded from this app.",
        });
      });
  };

  const addPasted = (pasted: RowValues[], replace: boolean) => {
    const rows = pasted.map((r) => makeRow(r));
    if (replace) {
      replaceList(
        { ...list, rows, sentences: NO_SENTENCES },
        `Replaced the list with ${plural(rows.length, "word")}`,
      );
      setTemplateParam(null);
    } else {
      setRows((prev) => [...prev.filter((r) => !isBlankRow(r)), ...rows]);
      setNotice({ message: `Added ${plural(rows.length, "word")}` });
    }
    log.info("list_pasted", { rows: rows.length, replace });
    setPasteOpen(false);
  };

  const deleteRow = (id: string) => {
    const previous = list.rows;
    setRows((rows) => removeRow(rows, id));
    setNotice({ message: "Word deleted", undo: () => setRows(() => previous) });
  };

  const addRow = () => {
    const row = makeRow();
    setRows((rows) => [...rows, row]);
    return row.id;
  };

  // Clean ?autostart from the URL and start right away when it was set.
  useEffect(() => {
    if (!_urlTemplate) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("autostart");
    window.history.replaceState({}, "", url.toString());
    if (_urlAutostart) startTest();
    // Runs once after mount so the test starts only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Test types are edited on the Settings page; re-check when coming back.
  useEffect(() => {
    const check = () =>
      setHasTestType(hasAnyTestType(loadPersistedSettings().testType));
    check();
    window.addEventListener("focus", check);
    const interval = setInterval(check, 1000);
    return () => {
      window.removeEventListener("focus", check);
      clearInterval(interval);
    };
  }, []);

  const listActions = {
    onTemplates: () => setSheetTab("templates"),
    onMyLists: () => setSheetTab("saved"),
    onImport: () => fileInputRef.current?.click(),
  };

  const practise = (variant: "bar" | "card") => (
    <PractisePanel
      variant={variant}
      total={complete.length}
      split={split}
      onSplitChange={setSplit}
      onStart={startTest}
      blockedReason={blockedReason}
      onOpenTestSettings={onOpenTestSettings}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "minmax(0, 1fr) 300px",
        },
        gap: { xs: "14px", md: 3 },
        alignItems: "start",
        pb: { xs: "190px", md: 0 },
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={handleImportFile}
        aria-label="Import word set JSON file"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "14px", md: 2 },
          minWidth: 0,
        }}
      >
        {showTip && (
          <TipBanner
            onDismiss={() => {
              setShowTip(false);
              hideTip();
            }}
          />
        )}

        <CurrentListCard
          name={list.name}
          onNameChange={(name) => patch({ name })}
          lang1Name={list.lang1Name}
          lang2Name={list.lang2Name}
          onLang1Change={(lang1Name) => patch({ lang1Name })}
          onLang2Change={(lang2Name) => patch({ lang2Name })}
          onSwap={() =>
            setList((prev) => ({
              ...prev,
              lang1Name: prev.lang2Name,
              lang2Name: prev.lang1Name,
              rows: swapRows(prev.rows),
              sentences: {
                language1Sentences: prev.sentences.language2Sentences,
                language2Sentences: prev.sentences.language1Sentences,
              },
            }))
          }
          summary={summary}
          hasWords={nonBlank.length > 0}
          onSave={saveList}
          onDownload={() => downloadWordSetFile(currentWordSet())}
          onShareQr={() => setQrOpen(true)}
          onClear={() => {
            replaceList(
              { ...list, name: "", rows: [], sentences: NO_SENTENCES },
              "List cleared",
            );
            setTemplateParam(null);
          }}
        />

        {!isDesktop && <ListActions variant="tiles" {...listActions} />}

        <WordTable
          rows={list.rows}
          lang1Label={lang1Label}
          lang2Label={lang2Label}
          onUpdate={(id, changes) =>
            setRows((rows) => updateRow(rows, id, changes))
          }
          onDelete={deleteRow}
          onAdd={addRow}
          onPaste={() => setPasteOpen(true)}
        />

        <SentenceSection
          sentences={list.sentences}
          onChange={(sentences) => patch({ sentences })}
          lang1Label={lang1Label}
          lang2Label={lang2Label}
        />
      </Box>

      {isDesktop ? (
        <Box
          component="aside"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "sticky",
            top: 16,
          }}
        >
          {practise("card")}
          <ListActions
            variant="panel"
            {...listActions}
            onSave={saveList}
            canSave={nonBlank.length > 0}
          />
        </Box>
      ) : (
        practise("bar")
      )}

      <ListPickerSheet
        open={sheetTab !== null}
        tab={sheetTab ?? "templates"}
        onTabChange={setSheetTab}
        onClose={() => setSheetTab(null)}
        templates={templateSummaries}
        saved={savedSets.map(savedSummary)}
        currentName={list.name}
        onUse={chooseList}
        onDownload={downloadList}
        onDeleteSaved={deleteSaved}
      />
      <PasteListDialog
        open={pasteOpen}
        onClose={() => setPasteOpen(false)}
        lang1Label={list.lang1Name || "Language 1"}
        lang2Label={list.lang2Name || "Language 2"}
        hasRows={nonBlank.length > 0}
        onAppend={(rows) => addPasted(rows, false)}
        onReplace={(rows) => addPasted(rows, true)}
      />
      <QrCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={window.location.href}
      />
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
};
