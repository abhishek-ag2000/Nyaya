import {
  findStageDescription,
  getProceduralMap,
  isCategoryOnlyTerm,
  normalizeStageText,
  type ProceduralMap,
  type ProceduralStage,
  type StageConfidence
} from "@/data/procedural-stages";
import type { CaseHistoryRow, UnifiedCase } from "@/data/unified-case";

const GENERIC_LISTING_PURPOSES = new Set([
  "listed hearing",
  "listed",
  "further hearing",
  "for hearing",
  "hearing scheduled",
  "next date",
  "date given",
  "awaiting orders",
  "order awaited",
  "adjourned"
]);

export type ProceduralStageResolution = {
  map: ProceduralMap;
  currentStage: ProceduralStage | null;
  currentStageIndex: number;
  nextStage: ProceduralStage | null;
  confidence: StageConfidence | null;
  nextStageConfidence: StageConfidence;
  matchedFrom: string | null;
  completedStageIds: string[];
  latestCourtActivity: { date: string; purpose: string; judge: string } | null;
  nextHearing: { date: string; purpose: string };
  purposeIsGeneric: boolean;
  history: CaseHistoryRow[];
};

type StageMatch = { stage: ProceduralStage; index: number; score: number };

function tokens(value: string) {
  const stop = new Set(["the", "of", "to", "for", "a", "an", "and", "or", "in", "on", "if", "any", "where", "applicable", "other"]);
  return normalizeStageText(value).split(" ").filter((token) => token.length > 1 && !stop.has(token));
}

function scoreAgainstStage(text: string, stage: ProceduralStage): number {
  const needle = normalizeStageText(text);
  if (!needle) return 0;
  const title = normalizeStageText(stage.title);
  if (needle === title) return 100;
  const aliases = (stage.aliases ?? []).map(normalizeStageText).filter(Boolean);
  if (aliases.includes(needle)) return 92;
  const aliasHit = aliases.find((alias) => alias.length > 3 && (needle.includes(alias) || alias.includes(needle)));
  if (aliasHit) return 80 + Math.min(10, aliasHit.split(" ").length);
  if (needle.length > 5 && (title.includes(needle) || needle.includes(title))) return 72;
  const needleTokens = tokens(text);
  const titleTokens = tokens(stage.title);
  if (!needleTokens.length || !titleTokens.length) return 0;
  const overlap = needleTokens.filter((token) => titleTokens.includes(token));
  if (titleTokens.every((token) => needleTokens.includes(token))) return 68;
  if (overlap.length >= Math.max(2, Math.ceil(titleTokens.length * 0.6))) return 60;
  return 0;
}

function matchStage(text: string, map: ProceduralMap): StageMatch | null {
  if (!text.trim()) return null;
  if (isCategoryOnlyTerm(text)) {
    const needle = normalizeStageText(text);
    const exact = map.stages.findIndex((stage) => normalizeStageText(stage.title) === needle);
    if (exact < 0) return null;
    return { stage: map.stages[exact], index: exact, score: 100 };
  }
  let best: StageMatch | null = null;
  map.stages.forEach((stage, index) => {
    const score = scoreAgainstStage(text, stage);
    if (score < 60) return;
    if (!best || score > best.score || (score === best.score && index > best.index)) best = { stage, index, score };
  });
  return best;
}

export function isGenericListingPurpose(text: string, map: ProceduralMap) {
  const needle = normalizeStageText(text);
  if (!needle) return true;
  if (GENERIC_LISTING_PURPOSES.has(needle)) return true;
  if (needle === "hearing" && !map.stages.some((stage) => normalizeStageText(stage.title) === "hearing")) return true;
  if (needle === "for orders" && !map.stages.some((stage) => normalizeStageText(stage.title) === "order")) return true;
  return false;
}

export function dedupeCaseHistory(rows: CaseHistoryRow[]): CaseHistoryRow[] {
  const seen = new Set<string>();
  const unique: CaseHistoryRow[] = [];
  for (const row of rows) {
    const key = [row.judge, row.businessDate, row.nextHearingDate, row.purpose].map((value) => normalizeStageText(value)).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  return unique;
}

function courtHistory(caseData: UnifiedCase): CaseHistoryRow[] {
  if (caseData.caseHistory?.length) return dedupeCaseHistory(caseData.caseHistory);
  return [{
    judge: caseData.court.judge,
    businessDate: caseData.status.updatedAt,
    nextHearingDate: caseData.nextHearing.date,
    purpose: caseData.nextHearing.purpose
  }];
}

function historyNewestFirst(history: CaseHistoryRow[]) {
  return [...history].sort((a, b) => b.businessDate.localeCompare(a.businessDate) || b.purpose.localeCompare(a.purpose));
}

function completedStageIds(map: ProceduralMap, currentIndex: number, history: CaseHistoryRow[]) {
  if (currentIndex < 0) return [];
  const matched = new Set<string>();
  for (const row of history) {
    const hit = isGenericListingPurpose(row.purpose, map) ? null : matchStage(row.purpose, map);
    if (hit && hit.index < currentIndex) matched.add(hit.stage.id);
  }
  return map.stages.flatMap((stage, index) => {
    if (index >= currentIndex) return [];
    if (stage.optional && !matched.has(stage.id)) return [];
    return [stage.id];
  });
}

export function resolveProceduralStage(caseData: UnifiedCase): ProceduralStageResolution {
  const map = getProceduralMap({ categoryId: caseData.categoryId, caseType: caseData.caseType, caseCategory: caseData.caseCategory, subtype: caseData.subtypeId });
  const history = courtHistory(caseData);
  const chronological = historyNewestFirst(history);
  const latestRow = chronological[0];
  const purposeIsGeneric = isGenericListingPurpose(caseData.nextHearing.purpose, map);
  const signals: { text: string; source: string; confirmed: boolean }[] = [];

  for (const row of chronological) {
    signals.push({ text: row.purpose, source: `case history · ${row.businessDate} · ${row.purpose}`, confirmed: !isGenericListingPurpose(row.purpose, map) });
  }
  signals.push({ text: caseData.nextHearing.purpose, source: `next hearing purpose · ${caseData.nextHearing.purpose}`, confirmed: !purposeIsGeneric });
  signals.push({ text: caseData.status.label, source: `case status · ${caseData.status.label}`, confirmed: !isGenericListingPurpose(caseData.status.label, map) });
  signals.push({ text: caseData.stage.current, source: `recorded stage · ${caseData.stage.current}`, confirmed: false });
  for (const document of caseData.documents.filter((item) => item.category === "Order" || caseData.orders.includes(item.id))) {
    signals.push({ text: document.title, source: `order · ${document.title}`, confirmed: true });
  }
  for (const event of [...caseData.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))) {
    signals.push({ text: event.title, source: `event · ${event.title}`, confirmed: false });
  }

  let current: StageMatch | null = null;
  let matchedFrom: string | null = null;
  let confidence: StageConfidence | null = null;
  for (const signal of signals) {
    if (isGenericListingPurpose(signal.text, map)) continue;
    const hit = matchStage(signal.text, map);
    if (!hit) continue;
    current = hit;
    matchedFrom = signal.source;
    confidence = signal.confirmed ? "COURT_CONFIRMED" : "INFERRED_FROM_HISTORY";
    break;
  }

  const currentStageIndex = current?.index ?? -1;
  const currentStage = current?.stage ?? null;
  const nextStage = currentStageIndex >= 0 ? map.stages[currentStageIndex + 1] ?? null : null;
  const nextPurposeMatch = nextStage && !purposeIsGeneric ? matchStage(caseData.nextHearing.purpose, map) : null;
  const nextStageConfidence: StageConfidence = nextPurposeMatch && nextPurposeMatch.stage.id === nextStage?.id ? "COURT_CONFIRMED" : "PROCEDURAL_GUIDANCE";

  return {
    map,
    currentStage,
    currentStageIndex,
    nextStage,
    confidence,
    nextStageConfidence,
    matchedFrom,
    completedStageIds: completedStageIds(map, currentStageIndex, history),
    latestCourtActivity: latestRow ? { date: latestRow.businessDate, purpose: latestRow.purpose, judge: latestRow.judge } : { date: caseData.status.updatedAt, purpose: caseData.status.label, judge: caseData.court.judge },
    nextHearing: { date: caseData.nextHearing.date, purpose: caseData.nextHearing.purpose },
    purposeIsGeneric,
    history
  };
}

export function stageDescription(stage: ProceduralStage | string) {
  return typeof stage === "string" ? findStageDescription(stage) : stage.description;
}
