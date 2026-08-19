"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileSearch, Gavel, ListChecks, Scale, ScrollText, Search, UsersRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { caseTypeGroups, finderAdvocates, finderJudges, type FinderPerson } from "@/data/find-case-fixture";
import { getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";

type Mode = "cnr" | "status" | "advocate" | "judge" | "orders" | "cause-list" | "caveat";
type Disposition = "pending" | "disposed" | "both";
const modes: { id: Mode; label: string; icon: typeof Search }[] = [
  { id: "cnr", label: "CNR / Case ID", icon: Search }, { id: "status", label: "Case Status", icon: FileSearch },
  { id: "advocate", label: "Advocate", icon: UsersRound }, { id: "judge", label: "Judge", icon: Scale },
  { id: "orders", label: "Court Orders", icon: Gavel }, { id: "cause-list", label: "Cause List", icon: ListChecks }, { id: "caveat", label: "Caveat Search", icon: ScrollText }
];
const copy: Record<Mode, [string, string]> = {
  cnr: ["Find by CNR or Case ID", "Enter an exact bundled synthetic case ID after selecting its prototype court context."],
  status: ["Search case status", "Narrow local synthetic case records by party, case type, registration year, and status."],
  advocate: ["Find cases by advocate", "Choose a fictional advocate to see only their linked local prototype matters."],
  judge: ["Find cases by judge", "Choose a fictional presiding judge to see their local prototype court context."],
  orders: ["Find court orders", "See synthetic records that contain an illustrative order document."],
  "cause-list": ["Find a cause list", "Browse locally bundled, illustrative listings for the selected prototype court."],
  caveat: ["Caveat search", "Check whether this prototype bundles a fictional caveat result for the selected court."],
};
const unique = (items: string[]) => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
const dispositionFor = (item: UnifiedCase): Exclude<Disposition, "both"> => item.id === "NYA-MH-DEMO-03318" ? "disposed" : "pending";

export default function FindCasePage() {
  const router = useRouter();
  const requested = useSearchParams().get("mode") as Mode | null;
  const mode = modes.some((item) => item.id === requested) ? requested as Mode : "cnr";
  const cases = useMemo(() => getUserCases(), []);
  const [state, setState] = useState(""); const [district, setDistrict] = useState(""); const [court, setCourt] = useState("");
  const [query, setQuery] = useState(""); const [year, setYear] = useState(""); const [caseType, setCaseType] = useState("");
  const [disposition, setDisposition] = useState<Disposition>("both"); const [person, setPerson] = useState("");
  const [error, setError] = useState(""); const [results, setResults] = useState<UnifiedCase[] | null>(null);
  const states = unique(cases.map((item) => item.court.state));
  const districts = unique(cases.filter((item) => !state || item.court.state === state).map((item) => item.court.district));
  const courts = unique(cases.filter((item) => (!state || item.court.state === state) && (!district || item.court.district === district)).map((item) => item.court.establishment));
  const people = mode === "advocate" ? finderAdvocates : finderJudges;
  const [title, description] = copy[mode];
  function selectMode(next: Mode) { setQuery(""); setYear(""); setCaseType(""); setPerson(""); setError(""); setResults(null); router.push(`/find-case?mode=${next}`); }
  function reset() { setState(""); setDistrict(""); setCourt(""); setQuery(""); setYear(""); setCaseType(""); setDisposition("both"); setPerson(""); setError(""); setResults(null); }
  function locationCases() { return cases.filter((item) => item.court.state === state && item.court.district === district && item.court.establishment === court); }
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state || !district || !court) { setError("Select a State, District, and Court Complex before searching this synthetic prototype."); setResults(null); return; }
    if (mode === "cnr" && !query.trim()) { setError("Enter a synthetic CNR or Case ID."); setResults(null); return; }
    if ((mode === "advocate" || mode === "judge") && !person) { setError(`Choose a synthetic ${mode} from the list.`); setResults(null); return; }
    if (year && !/^20\d{2}$/.test(year)) { setError("Enter a four-digit registration year between 2000 and 2099."); setResults(null); return; }
    let matched = locationCases();
    if (mode === "cnr") matched = matched.filter((item) => item.id.toLowerCase() === query.trim().toLowerCase());
    if (mode === "status") matched = matched.filter((item) => {
      const searchable = `${item.id} ${item.title} ${item.parties.petitioners.join(" ")} ${item.parties.respondents.join(" ")} ${item.advocates.petitioner.join(" ")} ${item.advocates.respondent.join(" ")}`.toLowerCase();
      return (!query.trim() || searchable.includes(query.trim().toLowerCase())) && (!year || item.nextHearing.date.startsWith(year)) && (!caseType || item.caseType === caseType) && (disposition === "both" || dispositionFor(item) === disposition);
    });
    if (mode === "advocate" || mode === "judge") matched = matched.filter((item) => people.find((entry) => entry.name === person)?.caseIds.includes(item.id));
    if (mode === "orders") matched = matched.filter((item) => item.orders.length > 0 || item.documents.some((document) => document.category === "Order"));
    if (mode === "caveat") matched = [];
    setError(""); setResults(matched);
  }
  return <main className="wrap find-case-page">
    <div className="finder-hero"><p className="kicker">Find my case · synthetic prototype</p><h1>A clearer local case search.</h1><p>Choose a prototype court context first, then search only the bundled fictional records. Nyaya does not connect to a live court system.</p></div>
    <nav className="finder-tabs" aria-label="Find case options">{modes.map((item) => { const Icon = item.icon; return <button aria-current={item.id === mode ? "page" : undefined} className={item.id === mode ? "active" : ""} key={item.id} onClick={() => selectMode(item.id)} type="button"><Icon aria-hidden="true" /><span>{item.label}</span></button>; })}</nav>
    <section className="finder-workspace" aria-labelledby="finder-title">
      <div className="finder-panel-title"><span className="find-menu-icon"><Search aria-hidden="true" /></span><div><span className="eyebrow">{modes.find((item) => item.id === mode)?.label}</span><h2 id="finder-title">{title}</h2><p>{description}</p></div></div>
      <form onSubmit={handleSearch} noValidate>
        <fieldset className="finder-location"><legend>1. Select prototype court context <small>required for every search</small></legend><div className="finder-field-row finder-location-row">
          <label>State<select value={state} onChange={(event) => { setState(event.target.value); setDistrict(""); setCourt(""); }}><option value="">Select state</option>{states.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>District<select disabled={!state} value={district} onChange={(event) => { setDistrict(event.target.value); setCourt(""); }}><option value="">Select district</option>{districts.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Court Complex<select disabled={!district} value={court} onChange={(event) => setCourt(event.target.value)}><option value="">Select court complex</option>{courts.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div></fieldset>
        <fieldset className="finder-criteria"><legend>2. Search local prototype records</legend>
          {mode === "cnr" && <label>CNR or Case ID<input autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. NYA-WB-DEMO-04821" /></label>}
          {mode === "status" && <><label>Party name or case number<input autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a bundled synthetic name or case ID" /></label><div className="finder-field-row finder-status-row"><label>Registration Year<input inputMode="numeric" maxLength={4} value={year} onChange={(event) => setYear(event.target.value.replace(/[^0-9]/g, ""))} placeholder="Enter year" /></label><label>Case type<select value={caseType} onChange={(event) => setCaseType(event.target.value)}><option value="">All case types</option>{caseTypeGroups.map((group) => <optgroup key={group.label} label={group.label}>{group.options.map((item) => <option key={item}>{item}</option>)}</optgroup>)}</select></label></div><fieldset className="finder-disposition"><legend>Case status</legend>{(["pending", "disposed", "both"] as Disposition[]).map((item) => <label key={item}><input checked={disposition === item} name="disposition" onChange={() => setDisposition(item)} type="radio" /><span>{item[0].toUpperCase() + item.slice(1)}</span></label>)}</fieldset></>}
          {(mode === "advocate" || mode === "judge") && <PersonPicker label={mode === "advocate" ? "Advocate name" : "Judge name"} people={people} value={person} onChange={setPerson} />}
          {mode === "orders" && <p className="finder-note">Only bundled synthetic records with an illustrative order document will appear.</p>}
          {mode === "cause-list" && <p className="finder-note">The result list is an illustrative local listing, not a court cause list.</p>}
          {mode === "caveat" && <p className="finder-note">No caveat records are bundled. The search will clearly confirm the empty prototype state.</p>}
          {error && <p className="finder-error" aria-live="polite">{error}</p>}
          <div className="finder-actions"><button className="login" type="submit">Search local records <span aria-hidden="true">→</span></button><button className="finder-reset" type="button" onClick={reset}>Reset</button></div>
        </fieldset>
      </form>
    </section>
    {results !== null && <Results mode={mode} results={results} />}
    <aside className="finder-help"><b>How this prototype search works</b><p>All search fields use bundled fictional data. No live database, CAPTCHA, identity system, or external API is used.</p><ul><li>Case IDs and people are synthetic prototype entries.</li><li>Results open only local Nyaya case workspaces.</li><li>“Pending” and “Disposed” are illustrative search labels, not court status records.</li></ul></aside>
    <Link className="back-link" href="/">← Back to Nyaya home</Link>
  </main>;
}
function PersonPicker({ label, people, value, onChange }: { label: string; people: FinderPerson[]; value: string; onChange: (value: string) => void }) { return <label>{label}<select className="finder-person-select" value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select {label.toLowerCase()}</option>{people.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select><small>All names are fictional and shown only for this prototype.</small></label>; }
function Results({ mode, results }: { mode: Mode; results: UnifiedCase[] }) { if (!results.length) return <section className="finder-results" aria-live="polite"><p className="eyebrow">0 local results</p><h2>{mode === "caveat" ? "No fictional caveat record is bundled." : "No synthetic cases matched this search."}</h2><p>Try another prototype court context or adjust the search fields. Nyaya did not query a live court system.</p></section>; return <section className="finder-results" aria-live="polite"><p className="eyebrow">{results.length} local result{results.length === 1 ? "" : "s"}</p><h2>Matching synthetic case records</h2><div className="finder-result-list">{results.map((item) => <Link href={`/cases/${item.id}`} key={item.id}><div><span className="demo-pill">synthetic / prototype</span><h3>{item.title}</h3><p><code>{item.id}</code> · {item.caseType}</p></div><div className="finder-result-meta"><span>{item.court.name}</span><small>{item.court.judge}</small><b>Open case →</b></div></Link>)}</div></section>; }
