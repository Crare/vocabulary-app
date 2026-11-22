import { Box, ButtonBase, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { HistoryGroup, relativeDay, summariseGroup } from "./historyStats";
import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";

interface HistoryListItemProps {
  group: HistoryGroup;
  onOpen: () => void;
  /** Desktop: this list's detail is showing beside the list. */
  selected?: boolean;
  /** Desktop: tighter card without the chevron. */
  compact?: boolean;
}

/** One word list in History: its latest score, change and score line. */
export const HistoryListItem = ({
  group,
  onOpen,
  selected,
  compact,
}: HistoryListItemProps) => {
  const { latest, change, series } = summariseGroup(group.entries);
  const count = group.entries.length;
  const meta = `${count} test${count !== 1 ? "s" : ""} · last ${relativeDay(group.entries[0].date)}`;

  return (
    <ButtonBase
      onClick={onOpen}
      aria-current={selected ? "true" : undefined}
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: compact
          ? "minmax(0, 1fr) auto"
          : "minmax(0, 1fr) auto 20px",
        gap: 1.5,
        alignItems: "center",
        textAlign: "left",
        p: compact ? "12px 14px" : "14px 10px 14px 16px",
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: selected ? 2 : 1,
        borderColor: selected ? "primary.main" : "divider",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}
      >
        <Typography
          fontWeight={700}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {group.setName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {meta}
        </Typography>
        {!compact && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}
          >
            <Typography
              fontSize={24}
              fontWeight={700}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {latest}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              latest
            </Typography>
            {change !== null && <TrendBadge change={change} />}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        {series.length > 1 ? (
          <Sparkline
            values={series}
            width={compact ? 72 : 96}
            height={compact ? 28 : 40}
          />
        ) : (
          !compact && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ width: 96, textAlign: "right" }}
            >
              1 test so far
            </Typography>
          )
        )}
        {compact && (
          <Typography
            fontSize={18}
            fontWeight={700}
            sx={{
              width: 48,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {latest}%
          </Typography>
        )}
      </Box>

      {!compact && <ChevronRightIcon color="primary" aria-hidden />}
    </ButtonBase>
  );
};
