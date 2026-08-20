import { getProceduralMap } from "@/data/procedural-stages";
import { demoUnifiedCase, type CaseDocument, type CaseEvent, type CaseEventType, type CaseNotification, type DocumentIntakeResult, type UnifiedCase } from "@/data/unified-case";

const storageKey = (caseId: string) => `nyaya-demo-case:${caseId}`;
const filedIndexKey = "nyaya-demo-filed-ids";
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const eventNotificationType: Partial<Record<CaseEventType, CaseNotification["type"]>> = { "document-uploaded": "document", "filing-needs-attention": "action", "filing-ready": "filing", "hearing-rescheduled": "hearing", "order-added": "order" };

export type ConfirmedIntake = { id: string; title: string; category: CaseDocument["category"]; subtype?: string; date: string; pages: number; addedBy: string; source: "upload"; intake: DocumentIntakeResult };

function persist(caseData: UnifiedCase) { if (typeof window !== "undefined") { window.localStorage.setItem(storageKey(caseData.id), JSON.stringify(caseData)); window.dispatchEvent(new Event("nyaya-demo-case-updated")); } return caseData; }
function readStore(caseId: string) {
  if (typeof window === "undefined") return undefined;
  try { const stored = window.localStorage.getItem(storageKey(caseId)); return stored ? JSON.parse(stored) as UnifiedCase : undefined; } catch { return undefined; }
}
function filedIds() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(filedIndexKey) ?? "[]") as string[]; } catch { return []; }
}
function rememberFiledId(caseId: string) {
  if (typeof window === "undefined") return;
  const ids = filedIds().includes(caseId) ? filedIds() : [...filedIds(), caseId];
  window.localStorage.setItem(filedIndexKey, JSON.stringify(ids));
}
/** Fill optional eCourts Overview fields when an older persisted demo case lacks them. */
function withOverviewSeed(caseData: UnifiedCase, seed: UnifiedCase = demoUnifiedCase): UnifiedCase {
  if (caseData.id.toLowerCase() !== seed.id.toLowerCase()) return caseData;
  return {
    ...caseData,
    identity: caseData.identity ?? seed.identity,
    dates: caseData.dates ?? seed.dates,
    provisions: caseData.provisions ?? seed.provisions,
    caseHistory: caseData.caseHistory?.length ? caseData.caseHistory : seed.caseHistory,
    status: {
      ...caseData.status,
      natureOfDisposal: caseData.status.natureOfDisposal ?? seed.status.natureOfDisposal,
    },
  };
}

/** Older localStorage records may omit array fields — keep tab views from crashing. */
function normalizeCaseRecord(caseData: UnifiedCase): UnifiedCase {
  return {
    ...caseData,
    documents: caseData.documents ?? [],
    filings: caseData.filings ?? [],
    orders: caseData.orders ?? [],
    events: caseData.events ?? [],
    notifications: caseData.notifications ?? [],
    actionsRequired: caseData.actionsRequired ?? [],
  };
}

export function loadDemoCase(caseId: string, fallback: UnifiedCase = demoUnifiedCase): UnifiedCase {
  return withOverviewSeed(normalizeCaseRecord(readStore(caseId) ?? fallback), fallback);
}
export function loadCaseRecord(caseId: string, fallback?: UnifiedCase) {
  const record =
    readStore(caseId) ?? fallback ?? (caseId.toLowerCase() === demoUnifiedCase.id.toLowerCase() ? demoUnifiedCase : undefined);
  return record ? withOverviewSeed(normalizeCaseRecord(record)) : undefined;
}
export function listFiledCases(): UnifiedCase[] {
  return filedIds().map((id) => readStore(id)).filter((item): item is UnifiedCase => Boolean(item));
}
export function createFiledDemoCase(caseData: UnifiedCase) {
  rememberFiledId(caseData.id);
  return persist(caseData);
}
export function advanceCaseStage(caseId: string, fallback?: UnifiedCase) {
  const current = clone(loadCaseRecord(caseId, fallback));
  if (!current) return current;
  const procedural = getProceduralMap({ categoryId: current.categoryId, caseType: current.caseType, caseCategory: current.caseCategory, subtype: current.subtypeId });
  const map = procedural.stages.map((stage) => stage.title);
  const index = current.stageIndex ?? Math.max(0, map.indexOf(current.stage.current));
  if (index < 0 || index >= map.length - 1) return persist({ ...current, stageMap: map, stageIndex: Math.max(0, index) });
  const nextIndex = index + 1;
  const next = procedural.stages[nextIndex];
  const nextStage = next.title;
  const today = new Date().toISOString().slice(0, 10);
  const nextDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const event: CaseEvent = { id: `event-stage-${nextIndex}-${today}`, caseId, type: "status-changed", occurredAt: today, title: `Stage: ${nextStage}`, description: "The case moved to the next illustrative procedural stage.", plainLanguage: next.description, source: { type: "case" }, visibility: "case-users" };
  return persist(appendCaseEvent({
    ...current,
    stageMap: map,
    stageIndex: nextIndex,
    stage: { current: nextStage, completedStages: map.slice(0, nextIndex), upcomingStages: map.slice(nextIndex + 1) },
    status: { ...current.status, label: nextStage, updatedAt: today, plainLanguage: next.description },
    nextHearing: { ...current.nextHearing, date: nextDate, purpose: nextStage },
    caseHistory: [...(current.caseHistory ?? []), { judge: current.court.judge, businessDate: today, nextHearingDate: nextDate, purpose: nextStage }],
  }, event));
}
export function resetDemoCase(caseId: string): UnifiedCase { if (typeof window !== "undefined") { window.localStorage.removeItem(storageKey(caseId)); window.dispatchEvent(new Event("nyaya-demo-case-updated")); } return clone(demoUnifiedCase); }
export function resetNyayaDemo(): UnifiedCase { if (typeof window !== "undefined") { Object.keys(window.localStorage).filter((key) => key.startsWith("nyaya-demo-")).forEach((key) => window.localStorage.removeItem(key)); window.dispatchEvent(new Event("nyaya-demo-case-updated")); } return clone(demoUnifiedCase); }
export function getRecentCaseEvents(caseData: UnifiedCase, count = 4) { return [...caseData.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, count); }
export function getUnreadNotifications(caseData: UnifiedCase) { return caseData.notifications.filter((notification) => !notification.read); }
export function getOpenCaseActions(caseData: UnifiedCase) { return caseData.actionsRequired.filter((action) => action.status === "open"); }
export function getUpcomingHearings(caseData: UnifiedCase) { return [caseData.nextHearing]; }
/** A small reusable projection so the UI never maintains a second timeline source. */
export function eventToTimeline(event: CaseEvent) { return { id: event.id, date: event.occurredAt, kind: event.type, title: event.title, description: event.description, plainLanguage: event.plainLanguage, source: event.source, details: event.details }; }
export function createNotificationForEvent(event: CaseEvent): CaseNotification | null { const type = eventNotificationType[event.type]; if (!type) return null; const href = event.source?.type === "document" && event.source.id ? `/cases/${event.caseId}/documents/${event.source.id}` : event.source?.type === "filing" && event.source.id ? `/cases/${event.caseId}/filings/${event.source.id}` : `/cases/${event.caseId}`; return { id: `notification-${event.id}`, caseId: event.caseId, type, title: event.type === "hearing-rescheduled" ? "Hearing changed" : event.type === "order-added" ? "New order available" : event.title, message: event.plainLanguage ?? event.description, createdAt: event.occurredAt, read: false, priority: event.actionRequired?.required || event.type === "hearing-rescheduled" ? "important" : "normal", href, relatedEventId: event.id }; }
export function appendCaseEvent(caseData: UnifiedCase, event: CaseEvent) { const notification = createNotificationForEvent(event); return { ...caseData, events: [event, ...caseData.events], notifications: notification ? [notification, ...caseData.notifications] : caseData.notifications }; }
export function markNotificationRead(caseId: string, notificationId: string) { const current = clone(loadDemoCase(caseId)); return persist({ ...current, notifications: current.notifications.map((notification) => notification.id === notificationId ? { ...notification, read: true } : notification) }); }
export function markAllNotificationsRead(caseId: string) { const current = clone(loadDemoCase(caseId)); return persist({ ...current, notifications: current.notifications.map((notification) => ({ ...notification, read: true })) }); }

export function addDocumentToDemoCase(caseId: string, intake: ConfirmedIntake, fallback: UnifiedCase = demoUnifiedCase): UnifiedCase {
  const current = clone(loadDemoCase(caseId, fallback)); if (current.id !== caseId) return current;
  const document: CaseDocument = { id: intake.id, caseId, title: intake.title, category: intake.category, subtype: intake.subtype, date: intake.date, pages: intake.pages, addedBy: intake.addedBy, source: intake.source, extractedText: intake.intake.extractedText, extractedFields: intake.intake.extractedFields, processing: { status: intake.intake.warnings?.length ? "needs-review" : "processed", classification: intake.intake.documentType ?? intake.category, ocrComplete: true, aiAssisted: true }, warnings: intake.intake.warnings };
  const action = intake.intake.warnings?.length ? [{ id: `action-${intake.id}`, title: "Review document intake", description: `This uploaded document has ${intake.intake.warnings.length} item${intake.intake.warnings.length === 1 ? "" : "s"} that need review.`, status: "open" as const, priority: "high" as const, dueDate: current.nextHearing.date, relatedDocumentId: intake.id }] : [];
  const event: CaseEvent = { id: `event-${intake.id}`, caseId, type: "document-uploaded", occurredAt: intake.date, title: `${intake.title} added`, description: "A demo document was added to the case record.", plainLanguage: action.length ? "A new document is available and has items that need review." : "A new filing-related document is available for review.", source: { type: "document", id: intake.id }, actor: { role: "User", label: intake.addedBy }, actionRequired: action.length ? { required: true, actionId: action[0].id } : { required: false }, visibility: "case-users" };
  return persist({ ...appendCaseEvent({ ...current, documents: [document, ...current.documents], actionsRequired: [...action, ...current.actionsRequired] }, event) });
}

export function rescheduleDemoHearing(caseId: string) { const current = clone(loadDemoCase(caseId)); const previousDate = current.nextHearing.date; const newDate = "2026-08-30"; if (previousDate === newDate) return current; const event: CaseEvent = { id: `event-hearing-${newDate}`, caseId, type: "hearing-rescheduled", occurredAt: "2026-08-19", title: "Hearing rescheduled", description: "The scheduled hearing date was changed.", plainLanguage: "The scheduled court date has changed.", source: { type: "hearing" }, details: { previousDate, newDate }, visibility: "case-users" }; return persist(appendCaseEvent({ ...current, nextHearing: { ...current.nextHearing, date: newDate } }, event)); }
export function addDemoOrder(caseId: string) { const current = clone(loadDemoCase(caseId)); const id = "doc-demo-order-20260819"; if (current.documents.some((document) => document.id === id)) return current; const document: CaseDocument = { id, caseId, title: "Order dated 19 August 2026", date: "2026-08-19", category: "Order", pages: 4, addedBy: "Court record", source: "court", extractedText: "Order placeholder. No legal findings or directions are represented.", processing: { status: "processed", classification: "Court Order", ocrComplete: true }, warnings: [] }; const event: CaseEvent = { id: "event-demo-order-20260819", caseId, type: "order-added", occurredAt: "2026-08-19", title: "New court order added", description: "Order dated 19 August 2026 is now available in this case record.", plainLanguage: "A new court document is available for review.", source: { type: "order", id }, actor: { role: "Court", label: "Court record" }, visibility: "case-users" }; return persist(appendCaseEvent({ ...current, documents: [document, ...current.documents], orders: [id, ...current.orders] }, event)); }
export function flagDemoFilingNeedsAttention(caseId: string) { const current = clone(loadDemoCase(caseId)); const filingId = "filing-submission"; const actionId = "action-filing-attention"; if (current.events.some((event) => event.id === "event-filing-needs-attention")) return current; const action = { id: actionId, title: "Review filing information", description: "The filing needs a review before it can move to the next registry step.", status: "open" as const, priority: "high" as const, dueDate: current.nextHearing.date, relatedFilingId: filingId }; const event: CaseEvent = { id: "event-filing-needs-attention", caseId, type: "filing-needs-attention", occurredAt: "2026-08-19", title: "Filing needs attention", description: "A registry check flagged the respondent submission for review.", plainLanguage: "Please review the filing information before its next procedural step.", source: { type: "filing", id: filingId }, actionRequired: { required: true, actionId }, visibility: "case-users" }; return persist(appendCaseEvent({ ...current, filings: current.filings.map((filing) => filing.id === filingId ? { ...filing, status: "Needs Attention", statusDescription: "A registry check indicates that this filing needs review before it can be marked accepted.", statusUpdatedAt: "2026-08-19" } : filing), actionsRequired: [action, ...current.actionsRequired] }, event)); }
export function markDemoFilingReady(caseId: string) { const current = clone(loadDemoCase(caseId)); const filingId = "filing-submission"; if (current.events.some((event) => event.id === "event-filing-ready")) return current; const event: CaseEvent = { id: "event-filing-ready", caseId, type: "filing-ready", occurredAt: "2026-08-19", title: "Filing readiness completed", description: "All selected structural checks for the filing were completed.", plainLanguage: "The filing is ready for its next procedural step on this site.", source: { type: "filing", id: filingId }, visibility: "case-users" }; return persist(appendCaseEvent({ ...current, filings: current.filings.map((filing) => filing.id === filingId ? { ...filing, status: "Accepted", statusDescription: "Recorded as ready in the registry flow. This is not court or authority approval.", statusUpdatedAt: "2026-08-19" } : filing), actionsRequired: current.actionsRequired.map((action) => action.relatedFilingId === filingId ? { ...action, status: "completed" } : action) }, event)); }
