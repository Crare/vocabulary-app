import { Box, useMediaQuery, useTheme } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PartitionContext, TestSettings } from "../Testing/types";
import {
  markTemplateRequestUsed,
  pendingTemplateRequest,
  setTemplateParam,
  templates,
} from "../../wordsets/templates";
import { languageName } from "../../wordsets/languages";
import { createLogger } from "../../util/logger";
import { downloadWordSetFile } from "../../util/download";
import {
  hideTip,
  isTipHidden,
  loadPersistedSettings,
} from "../../util/wordListStorage";
import { QrCodeModal } from "../../components/QrCodeModal";
import {
  checkRows,
  countSentences,
  isBlankRow,
  isCompleteRow,
  makeRow,
  RowValues,
  toWordSet,
  updateRow,
} from "./wordRows";
import {
  EditorList,
  findUnchangedTemplate,
  listToLanguageSet,
  listToWordSet,
  listFromLanguageSet,
  listFromWordSet,
  NO_SENTENCES,
  useWordListEditor,
} from "./useWordListEditor";
import { buildTestStart, hasAnyTestType } from "./startTest";
import { useSavedLists } from "./useSavedLists";
import { parseWordSetFile } from "./wordSetFile";
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
import { TemplateSummary } from "./TemplateSummary";
import { ListActions } from "./ListActions";
import { Notice, NoticeSnackbar } from "./NoticeSnackbar";
import { TipBanner } from "./TipBanner";

const log = createLogger("settings");

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
  // A ?template= link applies to the first visit of this page load only.
  const [urlRequest] = useState(pendingTemplateRequest);
  const { list, setList, patch, setRows, addRow, deleteRow, swap } = useWordListEditor(
    urlRequest?.template ?? null,
  );
  const [showTip, setShowTip] = useState(() => !isTipHidden());
  const { savedSets, save, remove } = useSavedLists();
  const [sheetTab, setSheetTab] = useState<ListTab | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [split, setSplit] = useState<PartSplit>(1);
  // An unedited template opens compact; this shows the full editor anyway.
  const [showEditor, setShowEditor] = useState(false);
  // Test types are edited on the Settings page, which unmounts this view,
  // so reading them when this view mounts is always current.
  const [hasTestType] = useState(() =>
    hasAnyTestType(loadPersistedSettings().testType),
  );
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
  const compact = !showEditor && findUnchangedTemplate(list, templates) >= 0;

  /** Replaces the whole list, offering undo when words would be lost. */
  const replaceList = (next: EditorList, message?: string) => {
    const previous = list;
    setList(next);
    if (message) setNotice({ message, undo: () => setList(previous) });
  };

  const startTest = () => {
    if (blockedReason) return;
    const { settings, partition } = buildTestStart(
      listToLanguageSet(list, isCompleteRow),
      split,
      loadPersistedSettings(),
    );
    onStartTest(settings, partition);
  };

  const saveList = () => {
    // Half-filled rows are kept so nothing typed is lost.
    const set = listToLanguageSet(list, (r) => !isBlankRow(r));
    // Saving a named list again updates it; unnamed lists are always added.
    const replaced = save(set, !!list.name.trim());
    setNotice({
      message: replaced
        ? `Updated “${set.name}” in My lists`
        : `Saved “${set.name}” to My lists`,
    });
  };

  const chooseList = (tab: ListTab, index: number) => {
    if (tab === "templates") {
      replaceList(listFromWordSet(templates[index]));
      setShowEditor(false);
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
        const parsed = parseWordSetFile(text);
        if (!parsed) throw new Error("not a word set");
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

  const deleteRowWithUndo = (id: string) => {
    const previous = list.rows;
    deleteRow(id);
    setNotice({ message: "Word deleted", undo: () => setRows(() => previous) });
  };

  // Use a ?template= link once: drop ?autostart and start right away if set.
  useEffect(() => {
    if (!urlRequest) return;
    markTemplateRequestUsed();
    const url = new URL(window.location.href);
    url.searchParams.delete("autostart");
    window.history.replaceState({}, "", url.toString());
    if (urlRequest.autostart) startTest();
    // Runs once after mount so the test starts only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listActions = {
    onTemplates: () => setSheetTab("templates"),
    onMyLists: () => setSheetTab("saved"),
    onImport: () => fileInputRef.current?.click(),
  };

  const practise = (variant: "bar" | "card" | "plain") => (
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
        maxWidth: compact ? 560 : 1200,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: compact ? "minmax(0, 1fr)" : "minmax(0, 1fr) 300px",
        },
        gap: { xs: "14px", md: 3 },
        alignItems: "start",
        pb: { xs: compact ? 2 : "calc(190px + var(--bottom-nav-height, 0px))", md: 0 },
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
      {compact ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TemplateSummary
            name={list.name}
            lang1Name={list.lang1Name}
            lang2Name={list.lang2Name}
            wordCount={nonBlank.length}
            hintCount={nonBlank.filter((r) => r.hint.trim()).length}
            onShowWords={() => setShowEditor(true)}
            onChangeList={() => setSheetTab("templates")}
          />
          {practise("plain")}
        </Box>
      ) : (
        <>
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
              onSwap={swap}
              summary={summary}
              hasWords={nonBlank.length > 0}
              onSave={saveList}
              onDownload={() => downloadWordSetFile(listToWordSet(list))}
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
              onDelete={deleteRowWithUndo}
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
        </>
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
        onDeleteSaved={remove}
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
