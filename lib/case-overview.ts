import type { CaseHistoryRow, UnifiedCase } from "@/data/unified-case";
import { dedupeCaseHistory, resolveProceduralStage } from "@/lib/resolve-procedural-stage";

export type CompressedHistoryGroup = {
  purpose: string;
  from: string;
  to: string;
  dates: string[];
  count: number;
  judge: string;
  nextHearingDate: string;
};

const DISPOSED_CODES = new Set(["disposed", "dismissed", "closed", "decided", "rejected", "allowed"]);

export function isDisposedCase(caseData: UnifiedCase) {
  if (caseData.dates?.decisionDate) return true;
  if (caseData.status.natureOfDisposal) return true;
  const code = caseData.status.code.toLowerCase();
  const label = caseData.status.label.toLowerCase();
  if (DISPOSED_CODES.has(code)) return true;
  return DISPOSED_CODES.has(label) || /\b(disposed|dismissed|decided|closed)\b/i.test(caseData.status.label);
}

export function getCaseHistoryChronological(caseData: UnifiedCase): CaseHistoryRow[] {
  const resolution = resolveProceduralStage(caseData);
  return dedupeCaseHistory(resolution.history).sort(
    (a, b) => a.businessDate.localeCompare(b.businessDate) || a.purpose.localeCompare(b.purpose)
  );
}

export function getCaseHistoryNewestFirst(caseData: UnifiedCase): CaseHistoryRow[] {
  return [...getCaseHistoryChronological(caseData)].reverse();
}

/** Compress consecutive identical purposes for Overview Case Journey. */
export function compressCaseHistory(rows: CaseHistoryRow[]): CompressedHistoryGroup[] {
  const chronological = [...rows].sort(
    (a, b) => a.businessDate.localeCompare(b.businessDate) || a.purpose.localeCompare(b.purpose)
  );
  const groups: CompressedHistoryGroup[] = [];
  for (const row of chronological) {
    const last = groups[groups.length - 1];
    if (last && last.purpose === row.purpose) {
      last.to = row.businessDate;
      last.dates.push(row.businessDate);
      last.count += 1;
      last.judge = row.judge;
      last.nextHearingDate = row.nextHearingDate;
      continue;
    }
    groups.push({
      purpose: row.purpose,
      from: row.businessDate,
      to: row.businessDate,
      dates: [row.businessDate],
      count: 1,
      judge: row.judge,
      nextHearingDate: row.nextHearingDate,
    });
  }
  return groups;
}

export function formatCaseDuration(fromIso: string, toIso = new Date().toISOString().slice(0, 10)) {
  const from = new Date(`${fromIso}T12:00:00`);
  const to = new Date(`${toIso}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return "—";
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years <= 0 && remMonths <= 0) return "Less than 1 month";
  if (years <= 0) return `${remMonths} month${remMonths === 1 ? "" : "s"}`;
  if (remMonths <= 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} year${years === 1 ? "" : "s"}, ${remMonths} month${remMonths === 1 ? "" : "s"}`;
}

export function formatOverviewDate(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

/** Compact day+month for journey nodes (e.g. 02 Aug). */
export function formatOverviewDayMonth(iso?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

export function formatJourneyRange(from: string, to: string) {
  if (from === to) return formatOverviewDayMonth(from);
  const fromDate = new Date(`${from}T12:00:00`);
  const toDate = new Date(`${to}T12:00:00`);
  if (fromDate.getMonth() === toDate.getMonth() && fromDate.getFullYear() === toDate.getFullYear()) {
    const day = new Intl.DateTimeFormat("en-IN", { day: "2-digit" });
    const month = new Intl.DateTimeFormat("en-IN", { month: "short" });
    return `${day.format(fromDate)}–${day.format(toDate)} ${month.format(toDate)}`;
  }
  return `${formatOverviewDayMonth(from)} – ${formatOverviewDayMonth(to)}`;
}

export function metaOrDash(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

export function hasNextHearing(caseData: UnifiedCase) {
  return Boolean(caseData.nextHearing?.date?.trim());
}

/** Short act label for Overview (e.g. BNSS, 2023). */
export function shortenActName(act: string) {
  if (/nagarik suraksha/i.test(act) || /\bBNSS\b/i.test(act)) return "BNSS, 2023";
  if (/bharatiya nyaya sanhita/i.test(act) || /\bBNS\b/i.test(act)) return "BNS, 2023";
  if (/code of criminal procedure|\bCrPC\b/i.test(act)) return "CrPC";
  return act.replace(/,\s*\d{4}$/, (m) => m).length > 42 ? act.slice(0, 40) + "…" : act;
}
