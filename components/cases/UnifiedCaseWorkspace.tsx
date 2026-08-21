"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ChevronRight, Download, FileText, Gavel, Paperclip, Printer, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { loadDemoCase } from "@/data/demo-case-store";
import type { CaseAction, CaseEvent, UnifiedCase } from "@/data/unified-case";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
import CaseHearingsPanel from "@/components/cases/CaseHearingsPanel";
import CaseHeaderStatus from "@/components/cases/CaseHeaderStatus";
import CaseOverview from "@/components/cases/CaseOverview";
import CasePrintRecord from "@/components/cases/CasePrintRecord";
import CaseStatusTracker from "@/components/cases/CaseStatusTracker";
import { downloadCasePdf } from "@/lib/case-export";

const workspaceTabs = ["Overview", "Status", "Timeline", "Hearings", "Filed documents", "Orders"] as const;
type Tab = (typeof workspaceTabs)[number];
const tabAliases: Record<string, Tab> = { filings: "Filed documents", documents: "Filed documents", applications: "Filed documents", "filed documents": "Filed documents", hearings: "Hearings", orders: "Orders" };
const priorityRank = { high: 0, medium: 1, low: 2 } as const;

function resolveWorkspaceTab(requestedTab: string | null): Tab | undefined {
  const requested = requestedTab?.replace(/\+/g, " ").replace(/-/g, " ").toLowerCase() ?? "";
  if (!requested) return undefined;
  return workspaceTabs.find((item) => item.toLowerCase() === requested) ?? tabAliases[requested];
}

function dateLabel(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`)); }
function causeListHref(court: UnifiedCase["court"]) { return `/cause-list?${new URLSearchParams({ state: court.state, district: court.district, court: court.establishment }).toString()}`; }
function typeIcon(type: CaseEvent["type"]) { return type === "order-added" ? <Gavel /> : type === "document-uploaded" ? <Paperclip /> : type.includes("filing") ? <FileText /> : <CheckCircle2 />; }
function actionHref(caseId: string, action: CaseAction) { return action.relatedDocumentId ? `/cases/${caseId}/documents/${action.relatedDocumentId}` : action.relatedFilingId ? `/cases/${caseId}/filings/${action.relatedFilingId}` : `/cases/${caseId}`; }
function chronologicalEvents(caseData: UnifiedCase) { return [...caseData.events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id)); }

type FiledRow = { id: string; title: string; type: string; date: string; by: string; status: string; href: string };
function filedDocumentRows(caseData: UnifiedCase): FiledRow[] {
  const documents = caseData.documents ?? [];
  const filings = caseData.filings ?? [];
  const filingByDoc = new Map(filings.flatMap((filing) => (filing.documentIds ?? []).map((id) => [id, filing] as const)));
  const rows: FiledRow[] = documents.map((document) => {
    const filing = filingByDoc.get(document.id);
    return {
      id: document.id,
      title: document.title,
      type: document.category,
      date: document.date,
      by: document.addedBy,
      status: filing?.status ?? document.processing?.classification ?? document.category,
      href: `/cases/${caseData.id}/documents/${document.id}`
    };
  });
  for (const filing of filings) {
    if ((filing.documentIds ?? []).some((id) => documents.some((document) => document.id === id))) continue;
    rows.push({
      id: filing.id,
      title: filing.title,
      type: filing.filingType,
      date: filing.date,
      by: filing.filedBy,
      status: filing.status,
      href: `/cases/${caseData.id}/filings/${filing.id}`
    });
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export default function UnifiedCaseWorkspace({ caseData: initialCase }: { caseData: UnifiedCase }) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(() => resolveWorkspaceTab(requestedTab) ?? "Overview");
  const [search, setSearch] = useState("");
  const [caseData, setCaseData] = useState(initialCase);
  const [role, setRole] = useState<Role | null>(null);
  const reduceMotion = useReducedMotion();
  const tabsRef = useRef<HTMLElement>(null);
  const highlightedDocumentId = searchParams.get("newDocument");
  useEffect(() => { const refresh = () => setRole(getMockRole()); refresh(); window.addEventListener("nyaya-mock-session", refresh); return () => window.removeEventListener("nyaya-mock-session", refresh); }, []);
  useEffect(() => {
    setCaseData(loadDemoCase(initialCase.id, initialCase));
    const match = resolveWorkspaceTab(requestedTab);
    if (match) setTab(match);
  }, [initialCase, requestedTab]);
  useEffect(() => {
    const active = tabsRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    active?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest", inline: "nearest" });
  }, [tab, reduceMotion]);
  const openActions = useMemo(() => caseData.actionsRequired.filter((action) => action.status === "open" || action.status === "requested" || action.status === "issued" || action.status === "assigned" || action.status === "attempted" || action.status === "clarification-requested").sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]), [caseData.actionsRequired]);
  const showPracticeActions = role === "advocate";
  const filedRows = useMemo(() => filedDocumentRows(caseData).filter((row) => row.title.toLowerCase().includes(search.toLowerCase()) || row.type.toLowerCase().includes(search.toLowerCase()) || row.status.toLowerCase().includes(search.toLowerCase())), [caseData, search]);
  const orderDocuments = useMemo(
    () => (caseData.documents ?? []).filter((document) => document.category === "Order" || (caseData.orders ?? []).includes(document.id)),
    [caseData.documents, caseData.orders]
  );
  // Keep enter opacity at 1 — signed-in workspace rail layout shifts can interrupt Framer enter
  // animations and leave Filed documents / Orders stuck invisible if they start at opacity 0.
  const panel = {
    initial: reduceMotion ? false : { opacity: 1, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? undefined : { opacity: 0, y: -4 },
    transition: { duration: 0.16 },
  };
  const currentAction = showPracticeActions ? openActions[0] : undefined;

  return <div className="unified-case">
    <BackLink href={role ? roleConfig[role].home : "/my-nyaya"}>{role ? roleConfig[role].workspace : "My Nyaya"}</BackLink>
    <header className="unified-case-header">
      <div className="unified-case-identity">
        {caseData.demo && <span className="demo-pill">Demo case</span>}
        <h1>{caseData.title}</h1>
        <p className="case-meta-line">
          <span>{caseData.caseType}</span>
          <code>{caseData.id}</code>
        </p>
        <p className="court-label">{caseData.court.name} · {caseData.court.establishment}</p>
        <div className="case-export-toolbar" aria-label="Print and download">
          <button type="button" className="doc-toolbar-btn" onClick={() => window.print()}>
            <Printer aria-hidden="true" /> Print
          </button>
          <button type="button" className="doc-toolbar-btn" onClick={() => downloadCasePdf(caseData)}>
            <Download aria-hidden="true" /> Download PDF
          </button>
        </div>
      </div>
      <CaseHeaderStatus caseData={caseData} role={role} onOpenHearings={() => setTab("Hearings")} />
    </header>
    {showPracticeActions && (currentAction ? <section className="case-attention" aria-label="Action required">
      <AlertTriangle aria-hidden="true" /><div><span>{openActions.length} item{openActions.length === 1 ? "" : "s"} need{openActions.length === 1 ? "s" : ""} your attention</span><b>{currentAction.title}</b><p>{currentAction.description}{currentAction.dueDate ? ` Due ${dateLabel(currentAction.dueDate)}.` : ""}</p></div>
      <Link href={actionHref(caseData.id, currentAction)}>Review item <ChevronRight aria-hidden="true" /></Link>
    </section> : <section className="case-attention clear" aria-label="No immediate action required"><CheckCircle2 aria-hidden="true" /><div><b>No immediate action required</b><p>There are no open actions in this case record.</p></div></section>)}
    <nav ref={tabsRef} className="unified-tabs" aria-label="Case workspace sections" role="tablist">{workspaceTabs.map((item) => <button aria-controls="case-workspace-panel" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)} role="tab" type="button">{item}</button>)}</nav>
    <div className="case-shell"><main aria-label={`${tab} for ${caseData.shortTitle}`} id="case-workspace-panel" role="tabpanel"><AnimatePresence mode="wait">
      {tab === "Overview" && <motion.div key="overview" {...panel}><Overview caseData={caseData} onOpenTimeline={() => setTab("Timeline")} onOpenOrders={() => setTab("Orders")} /></motion.div>}
      {tab === "Status" && <motion.div key="status" {...panel}><CaseStatusTracker caseData={caseData} onCaseChange={setCaseData} /></motion.div>}
      {tab === "Timeline" && <motion.div key="timeline" {...panel}><Timeline caseData={caseData} /></motion.div>}
      {tab === "Hearings" && <motion.div key="hearings" {...panel}><CaseHearingsPanel caseData={caseData} role={role} /></motion.div>}
      {tab === "Filed documents" && <motion.div key="filed-documents" {...panel}><FiledDocuments caseData={caseData} rows={filedRows} search={search} setSearch={setSearch} highlightedDocumentId={highlightedDocumentId} role={role} /></motion.div>}
      {tab === "Orders" && <motion.div key="orders" {...panel}><RecordList eyebrow="Orders" heading="Court orders" empty="No orders are recorded on this case yet." items={orderDocuments.map((document) => ({ id: document.id, href: `/cases/${caseData.id}/documents/${document.id}`, status: document.processing?.classification ?? "Order", title: document.title, detail: `${dateLabel(document.date)} · ${document.pages} pages · ${document.addedBy}` }))} /></motion.div>}
    </AnimatePresence></main><ActionRail caseId={caseData.id} caseData={caseData} action={currentAction} /></div>
    <CasePrintRecord caseData={caseData} />
    {highlightedDocumentId && caseData.documents.some((document) => document.id === highlightedDocumentId) && <div className="case-toast" role="status"><CheckCircle2 aria-hidden="true" /><span><b>Document added to case</b>{caseData.documents.find((document) => document.id === highlightedDocumentId)?.title} is now available in this case record.</span></div>}
  </div>;
}

function Overview({
  caseData,
  onOpenTimeline,
  onOpenOrders,
}: {
  caseData: UnifiedCase;
  onOpenTimeline: () => void;
  onOpenOrders: () => void;
}) {
  return (
    <CaseOverview
      caseData={caseData}
      onOpenTimeline={onOpenTimeline}
      onOpenOrders={onOpenOrders}
    />
  );
}

function Timeline({ caseData }: { caseData: UnifiedCase }) {
  const events = chronologicalEvents(caseData);
  return <section className="case-panel"><span className="eyebrow">Timeline</span><h2 className="tab-section-title">Case events</h2>{events.length ? <div className="timeline-spine">{events.map((event) => <article key={event.id}><time dateTime={event.occurredAt}>{dateLabel(event.occurredAt)}</time><i aria-hidden="true">{typeIcon(event.type)}</i><div><span>{event.type.replaceAll("-", " ")}</span><h3>{event.title}</h3><p>{event.description}</p>{event.details?.previousDate && event.details.newDate && <p className="event-date-change"><b>{dateLabel(event.details.previousDate)}</b><span>↓</span><b>{dateLabel(event.details.newDate)}</b></p>}{event.plainLanguage && <p className="event-meaning"><b>What this means</b>{event.plainLanguage}</p>}<small className="event-source">Source · {event.sourceSystem?.label ?? (event.source?.type === "filing" ? "filing Workflow" : "court Record")}</small>{event.source?.id && (event.source.type === "document" || event.source.type === "order") && <Link href={`/cases/${caseData.id}/documents/${event.source.id}`}>View document →</Link>}{event.source?.id && event.source.type === "filing" && <Link href={`/cases/${caseData.id}/filings/${event.source.id}`}>View filing →</Link>}</div></article>)}</div> : <p className="empty-state">No timeline events are recorded on this case yet.</p>}</section>;
}

function FiledDocuments({ caseData, rows, search, setSearch, highlightedDocumentId, role }: { caseData: UnifiedCase; rows: FiledRow[]; search: string; setSearch: (value: string) => void; highlightedDocumentId: string | null; role: Role | null }) {
  const highlightedRef = useRef<HTMLTableRowElement | null>(null);
  const canUpload = role === "advocate";
  useEffect(() => { highlightedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [highlightedDocumentId]);
  return (
    <section className="case-panel">
      <div className="tab-heading">
        <div><span className="eyebrow">Filed documents</span><h2>Filed documents</h2></div>
        {canUpload ? <Link className="small-action" href={`/cases/${caseData.id}/documents/upload`}><Upload aria-hidden="true" /> Upload document</Link> : null}
      </div>
      <div className="document-controls">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search filed documents" aria-label="Search filed documents" />
      </div>
      {rows.length ? (
        <div className="filed-docs-wrap">
          <table className="filed-docs-table">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Type</th>
                <th scope="col">Date</th>
                <th scope="col">Filed by</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className={row.id === highlightedDocumentId ? "is-highlighted" : undefined} key={row.id} ref={row.id === highlightedDocumentId ? highlightedRef : undefined}>
                  <th scope="row"><Link href={row.href}>{row.title}</Link></th>
                  <td>{row.type}</td>
                  <td><time dateTime={row.date}>{dateLabel(row.date)}</time></td>
                  <td>{row.by}</td>
                  <td><span className="filing-status">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">No filed documents match this view.</p>
      )}
    </section>
  );
}

function RecordList({ eyebrow, heading, empty, items }: { eyebrow: string; heading: string; empty: string; items: Array<{ id: string; href: string; status: string; title: string; detail: string }> }) {
  return <section className="case-panel"><span className="eyebrow">{eyebrow}</span><h2 className="tab-section-title">{heading}</h2>{items.length ? <div className="filing-list">{items.map((item) => <Link aria-label={`View ${item.title}`} href={item.href} key={item.id}><div><span className="filing-status">{item.status}</span><h3>{item.title}</h3><p>{item.detail}</p></div><ChevronRight aria-hidden="true" /></Link>)}</div> : <p className="empty-state">{empty}</p>}</section>;
}

function ActionRail({ caseId, caseData, action }: { caseId: string; caseData: UnifiedCase; action?: CaseAction }) {
  const actions = [
    { label: "Request Certified Copy", href: "/certified-copy" },
    { label: "View Cause List", href: causeListHref(caseData.court) },
    { label: "Create Reminder", href: `/cases/${caseId}/reminder` }
  ];
  return <aside className="unified-action-rail" aria-label="What you can do">
    <section className="rail-actions">
      <h2 className="rail-heading">What you can do</h2>
      <button type="button" onClick={() => window.print()}>Print case <ChevronRight aria-hidden="true" /></button>
      <button type="button" onClick={() => downloadCasePdf(caseData)}>Download PDF <ChevronRight aria-hidden="true" /></button>
      {actions.map((item) => <Link href={item.href} key={item.label}>{item.label} <ChevronRight aria-hidden="true" /></Link>)}
    </section>
    <section><span className="eyebrow">Case at a glance</span><p><b>Case type</b>{caseData.caseType}</p><p><b>Court</b>{caseData.court.name}</p><p><b>Presiding judge</b>{caseData.court.judge}</p><p><b>Current stage</b>{caseData.stage.current}</p><p><b>Next date</b>{dateLabel(caseData.nextHearing.date)}</p><p><b>Last updated</b>{dateLabel(caseData.status.updatedAt)}</p></section>
    {action?.dueDate && <section><span className="eyebrow">Important dates</span><p><b>Document review</b>{dateLabel(action.dueDate)}</p></section>}
  </aside>;
}
