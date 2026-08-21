"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { findCaseDefaults } from "@/data/find-case-fixture";
import { getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";

const date = (v: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${v}T00:00:00`));
const todayIso = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const unique = (items: string[]) => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
const extras = [
  { title: "Demo Traders v. Demo Industries", type: "Civil", time: "10:30 AM", item: 1 },
  { title: "Demo Housing v. Demo Residents", type: "Criminal", time: "10:45 AM", item: 4 },
  { title: "Demo Goods v. Sample Logistics", type: "Civil", time: "11:00 AM", item: 8 },
];

function useCases() {
  const [cases, setCases] = useState<UnifiedCase[]>([]);
  useEffect(() => {
    const refresh = () => setCases(getUserCases());
    refresh();
    window.addEventListener("nyaya-demo-case-updated", refresh);
    return () => window.removeEventListener("nyaya-demo-case-updated", refresh);
  }, []);
  return cases;
}

export function CauseList() {
  const router = useRouter();
  const params = useSearchParams();
  const cases = useCases();
  const [state, setState] = useState(params.get("state") ?? findCaseDefaults.state);
  const [district, setDistrict] = useState(params.get("district") ?? findCaseDefaults.district);
  const [court, setCourt] = useState(params.get("court") ?? findCaseDefaults.court);
  const [hearingDate, setHearingDate] = useState(params.get("date") || todayIso());
  const [list, setList] = useState<"daily" | "supplementary">(params.get("list") === "supplementary" ? "supplementary" : "daily");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(true);

  useEffect(() => {
    const nextState = params.get("state") ?? findCaseDefaults.state;
    const nextDistrict = params.get("district") ?? findCaseDefaults.district;
    const nextCourt = params.get("court") ?? findCaseDefaults.court;
    const nextDate = params.get("date");
    setState(nextState);
    setDistrict(nextDistrict);
    setCourt(nextCourt);
    if (nextDate) setHearingDate(nextDate);
    setList(params.get("list") === "supplementary" ? "supplementary" : "daily");
    setSubmitted(Boolean(nextState && nextDistrict && nextCourt));
  }, [params]);

  const states = unique(cases.map((item) => item.court.state));
  const districts = unique(cases.filter((item) => !state || item.court.state === state).map((item) => item.court.district));
  const courts = unique(cases.filter((item) => (!state || item.court.state === state) && (!district || item.court.district === district)).map((item) => item.court.establishment));

  function syncUrl(next: { state: string; district: string; court: string; date: string; list: "daily" | "supplementary" }) {
    const search = new URLSearchParams();
    if (next.state) search.set("state", next.state);
    if (next.district) search.set("district", next.district);
    if (next.court) search.set("court", next.court);
    if (next.date) search.set("date", next.date);
    if (next.list !== "daily") search.set("list", next.list);
    const queryString = search.toString();
    router.replace(queryString ? `/cause-list?${queryString}` : "/cause-list", { scroll: false });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state || !district || !court) {
      setError("Select a State, District, and Court Complex to view this daily cause list.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
    syncUrl({ state, district, court, date: hearingDate, list });
  }

  const matters = useMemo(() => {
    if (!submitted) return [];
    return cases.filter((item) =>
      item.court.state === state &&
      item.court.district === district &&
      item.court.establishment === court &&
      `${item.title} ${item.id}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [cases, court, district, query, state, submitted]);

  const grouped = useMemo(() => {
    const rooms = new Map<string, UnifiedCase[]>();
    for (const item of matters) {
      const room = item.court.courtroom || item.court.name;
      rooms.set(room, [...(rooms.get(room) ?? []), item]);
    }
    return Array.from(rooms.entries());
  }, [matters]);

  const extraRows = submitted && list === "supplementary"
    ? extras.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <main className="wrap operations-page">
      <p className="kicker">Daily cause list · illustrative data</p>
      <h1>Daily cause list</h1>
      <p>Select a state, district and court complex to see the listed matters for that court.</p>
      <form className="cause-list-form" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Select court</legend>
          <div className="cause-list-fields">
            <label>State
              <select value={state} onChange={(event) => { setState(event.target.value); setDistrict(""); setCourt(""); setSubmitted(false); setError(""); }}>
                <option value="">Select state</option>
                {states.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>District
              <select disabled={!state} value={district} onChange={(event) => { setDistrict(event.target.value); setCourt(""); setSubmitted(false); setError(""); }}>
                <option value="">Select district</option>
                {districts.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>Court Complex
              <select disabled={!district} value={court} onChange={(event) => { setCourt(event.target.value); setSubmitted(false); setError(""); }}>
                <option value="">Select court complex</option>
                {courts.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>Date
              <input type="date" value={hearingDate} onChange={(event) => setHearingDate(event.target.value)} />
            </label>
          </div>
          <div className="ops-controls cause-list-type">
            <div role="group" aria-label="List type">
              <button type="button" className={list === "daily" ? "active" : ""} onClick={() => setList("daily")}>Daily</button>
              <button type="button" className={list === "supplementary" ? "active" : ""} onClick={() => setList("supplementary")}>Supplementary</button>
            </div>
            <label>Search matters
              <input aria-label="Search cause list" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Case title or ID" />
            </label>
          </div>
          {error && <p className="finder-error" aria-live="polite">{error}</p>}
          <div className="cause-list-actions">
            <button className="login" type="submit">View cause list <span aria-hidden="true">→</span></button>
            {(state || district || court) && (
              <button className="finder-reset" type="button" onClick={() => {
                const next = { state: findCaseDefaults.state, district: findCaseDefaults.district, court: findCaseDefaults.court, date: todayIso(), list: "daily" as const };
                setState(next.state);
                setDistrict(next.district);
                setCourt(next.court);
                setHearingDate(next.date);
                setList(next.list);
                setQuery("");
                setError("");
                setSubmitted(true);
                syncUrl(next);
              }}>
                Reset selection
              </button>
            )}
          </div>
        </fieldset>
      </form>
      {!submitted && <p className="cause-date">Choose all three location fields, then view the listing for that court.</p>}
      {submitted && (
        <>
          <p className="cause-date">{list === "daily" ? "Daily" : "Supplementary"} list · {date(hearingDate)} · {court} · {district}, {state}</p>
          {!matters.length && !extraRows.length ? (
            <p className="empty-state">No matters are listed for this court and date.</p>
          ) : grouped.length ? grouped.map(([room, roomCases], groupIndex) => (
            <section className="cause-court" key={room}>
              <header>
                <div>
                  <span>{room}</span>
                  <h2>{roomCases[0]?.court.name ?? court}</h2>
                </div>
                <p>{roomCases[0]?.court.judge ?? "Presiding judge"}</p>
              </header>
              {groupIndex === 0 && extraRows.map((item) => (
                <div className="cause-row" key={item.title}>
                  <b>{item.item}</b>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.type} · {item.time}</p>
                  </div>
                  <span>Listed</span>
                </div>
              ))}
              {roomCases.map((caseData, index) => (
                <div className="cause-row your-matter" key={caseData.id}>
                  <b>{12 + index * 5}</b>
                  <div>
                    <span>★ Your matter</span>
                    <h3>{caseData.title}</h3>
                    <p>{caseData.stage.current} · {caseData.nextHearing.time}</p>
                  </div>
                  <Link href={`/cases/${caseData.id}`}>Open case →</Link>
                </div>
              ))}
            </section>
          )) : (
            <section className="cause-court">
              <header>
                <div>
                  <span>Listed court</span>
                  <h2>{court}</h2>
                </div>
                <p>{district}, {state}</p>
              </header>
              {extraRows.map((item) => (
                <div className="cause-row" key={item.title}>
                  <b>{item.item}</b>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.type} · {item.time}</p>
                  </div>
                  <span>Listed</span>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

type Defect = { id: string; caseId: string; title: string; caseTitle: string; submitted: string; status: string; issues: string[]; href: string };
function defects(cases: UnifiedCase[]): Defect[] { const main = cases[0]; const filing = main?.filings.find((item) => item.id === "filing-submission"); const result: Defect[] = filing && filing.status === "Needs Attention" ? [{ id: filing.id, caseId: main.id, title: filing.title, caseTitle: main.title, submitted: filing.date, status: filing.status, issues: ["Court fee / valuation statement not detected", "Annexure numbering incomplete"], href: `/cases/${main.id}/filings/${filing.id}/readiness` }] : []; return [...result, { id: "tier-b-execution", caseId: "NYA-DEMO-EXE-00714", title: "Execution Application", caseTitle: "Demo Finance Ltd. v. R. Sen", submitted: "2026-08-18", status: "Needs Attention", issues: ["Affidavit not detected"], href: "/cases/NYA-DEMO-EXE-00714" }]; }
export function FilingDefects() { const cases = useCases(); const items = defects(cases); return <main className="wrap operations-page"><p className="kicker">Filing readiness · demo data</p><h1>Filing readiness</h1><p>Filings that need review before the next procedural step.</p><p className="quiet-summary">{items.length} filings need attention</p><section className="defect-list">{items.map((item) => <article key={item.id}><div><span className="defect-status">{item.status}</span><h2>{item.title}</h2><p>{item.caseTitle}</p><small>Filed: {date(item.submitted)}</small><ul>{item.issues.map((issue) => <li key={issue}>⚠ {issue}</li>)}</ul></div><Link href={item.href}>Review filing →</Link></article>)}</section></main>; }
export function RegistryDefects() { const cases = useCases(); const initial = defects(cases).map((item, index) => ({...item, status: index ? "Resubmitted" : item.status})); const [items, setItems] = useState(initial); useEffect(() => setItems(defects(cases).map((item, index) => ({...item, status: index ? "Resubmitted" : item.status}))), [cases]); return <main className="wrap operations-page registry-page"><p className="kicker">Registry workspace · demo data</p><h1>Registry scrutiny</h1><p>Filing defects and resubmissions.</p><div className="registry-summary"><span>New filings <b>12</b></span><span>Needs attention <b>{items.filter((i) => i.status === "Needs Attention").length}</b></span><span>Resubmitted <b>{items.filter((i) => i.status === "Resubmitted").length}</b></span><span>Ready <b>8</b></span></div><div className="registry-table" role="table"><div role="row" className="registry-head"><span>Filing</span><span>Case</span><span>Submitted</span><span>Issues</span><span>Status</span><span /></div>{items.map((item) => <div role="row" key={item.id}><span><b>{item.title}</b></span><span>{item.caseTitle}</span><span>{date(item.submitted)}</span><span>{item.issues.length} issue{item.issues.length > 1 ? "s" : ""}</span><span>{item.status}</span><button onClick={() => setItems(items.map((current) => current.id === item.id ? {...current, status: "Reviewed"} : current))} disabled={item.status === "Reviewed"}>{item.status === "Reviewed" ? "Reviewed" : "Mark reviewed"}</button></div>)}</div></main>; }
