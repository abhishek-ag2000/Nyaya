"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileSearch, Gavel, ListChecks, MapPin, Scale, ScrollText, Search, UsersRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { caseTypeGroups, finderAdvocates, finderJudges, type FinderPerson } from "@/data/find-case-fixture";
import { getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";

type Mode = "cnr" | "status" | "advocate" | "judge" | "orders" | "cause-list" | "caveat";
type Disposition = "pending" | "disposed" | "both";
const modes: { id: Mode; label: string; icon: typeof Search }[] = [
  { id: "cnr", label: "CNR / Case ID", icon: Search },
  { id: "status", label: "Case Status", icon: FileSearch },
  { id: "advocate", label: "Advocate", icon: UsersRound },
  { id: "judge", label: "Judge", icon: Scale },
  { id: "orders", label: "Court Orders", icon: Gavel },
  { id: "cause-list", label: "Cause List", icon: ListChecks },
  { id: "caveat", label: "Caveat Search", icon: ScrollText },
];
const copy: Record<Mode, [string, string]> = {
  cnr: ["Find by CNR or Case ID", "Enter an exact bundled case ID after selecting its court context."],
  status: ["Search case status", "Narrow local case records by party, case type, registration year, and status."],
  advocate: ["Find cases by advocate", "Choose a fictional advocate to see only their linked local matters."],
  judge: ["Find cases by judge", "Choose a fictional presiding judge to see their local court context."],
  orders: ["Find court orders", "See records that contain an illustrative order document."],
  "cause-list": ["Find a cause list", "Choose the site court, then open the daily cause list for that court."],
  caveat: ["Caveat search", "Check whether this site bundles a fictional caveat result for the selected court."],
};
const unique = (items: string[]) => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
const dispositionFor = (item: UnifiedCase): Exclude<Disposition, "both"> => item.id === "NYA-MH-DEMO-03318" ? "disposed" : "pending";

export default function FindCasePage() {
  const router = useRouter();
  const requested = useSearchParams().get("mode") as Mode | null;
  const mode = modes.some((item) => item.id === requested) ? requested as Mode : "cnr";
  const cases = useMemo(() => getUserCases(), []);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [court, setCourt] = useState("");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [caseType, setCaseType] = useState("");
  const [disposition, setDisposition] = useState<Disposition>("both");
  const [person, setPerson] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<UnifiedCase[] | null>(null);
  const states = unique(cases.map((item) => item.court.state));
  const districts = unique(cases.filter((item) => !state || item.court.state === state).map((item) => item.court.district));
  const courts = unique(cases.filter((item) => (!state || item.court.state === state) && (!district || item.court.district === district)).map((item) => item.court.establishment));
  const people = mode === "advocate" ? finderAdvocates : finderJudges;
  const [title, description] = copy[mode];
  const locationReady = Boolean(state && district && court);
  const locationError = error && !locationReady;
  const searchError = error && locationReady;

  function clearResults() { setError(""); setResults(null); }
  function selectMode(next: Mode) {
    setQuery(""); setYear(""); setCaseType(""); setPerson(""); setError(""); setResults(null);
    router.push(`/find-case?mode=${next}`);
  }
  function resetSearch() {
    setQuery(""); setYear(""); setCaseType(""); setDisposition("both"); setPerson(""); setError(""); setResults(null);
  }
  function resetLocation() {
    setState(""); setDistrict(""); setCourt(""); setError(""); setResults(null);
  }
  function locationCases() {
    return cases.filter((item) => item.court.state === state && item.court.district === district && item.court.establishment === court);
  }
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state || !district || !court) { setError("Select a State, District, and Court Complex before searching this."); setResults(null); return; }
    if (mode === "cause-list") {
      const search = new URLSearchParams({ state, district, court });
      router.push(`/cause-list?${search.toString()}`);
      return;
    }
    if (mode === "cnr" && !query.trim()) { setError("Enter a CNR or Case ID."); setResults(null); return; }
    if ((mode === "advocate" || mode === "judge") && !person) { setError(`Choose a ${mode} from the list.`); setResults(null); return; }
    if (year && !/^20\d{2}$/.test(year)) { setError("Enter a four-digit registration year between 2000 and 2099."); setResults(null); return; }
    let matched = locationCases();
    if (mode === "cnr") matched = matched.filter((item) => item.id.toLowerCase() === query.trim().toLowerCase());
    if (mode === "status") matched = matched.filter((item) => {
      const searchable = `${item.id} ${item.title} ${item.transactionId ?? ""} ${item.parties.petitioners.join(" ")} ${item.parties.respondents.join(" ")} ${item.advocates.petitioner.join(" ")} ${item.advocates.respondent.join(" ")}`.toLowerCase();
      return (!query.trim() || searchable.includes(query.trim().toLowerCase())) && (!year || item.nextHearing.date.startsWith(year)) && (!caseType || item.caseType === caseType) && (disposition === "both" || dispositionFor(item) === disposition);
    });
    if (mode === "advocate" || mode === "judge") matched = matched.filter((item) => people.find((entry) => entry.name === person)?.caseIds.includes(item.id));
    if (mode === "orders") matched = matched.filter((item) => item.orders.length > 0 || item.documents.some((document) => document.category === "Order"));
    if (mode === "caveat") matched = [];
    setError(""); setResults(matched);
  }

  return (
    <main className="find-case-page">
      <header className="finder-hero">
        <div className="wrap">
          <p className="kicker">Find my case </p>
          <h1>A clearer local case search.</h1>
          <p>Choose a demonstration court context first, then search only the bundled fictional records. Nyaya does not connect to a live court system.</p>
        </div>
      </header>
      <div className="wrap find-case-body">
        <form className="finder-form-layout" onSubmit={handleSearch} noValidate>
          <fieldset className="finder-location finder-context">
            <legend className="sr-only">Select court context, required for every search</legend>
            <div className="finder-context-head">
              <span className="find-menu-icon" aria-hidden="true"><MapPin /></span>
              <div>
                <h2>Select court context</h2>
                <p className="eyebrow">required for every search</p>
              </div>
            </div>
            <div className="finder-field-row finder-location-row">
              <label>State
                <select value={state} onChange={(event) => { setState(event.target.value); setDistrict(""); setCourt(""); clearResults(); }}>
                  <option value="">Select state</option>
                  {states.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>District
                <select disabled={!state} value={district} onChange={(event) => { setDistrict(event.target.value); setCourt(""); clearResults(); }}>
                  <option value="">Select district</option>
                  {districts.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>Court Complex
                <select disabled={!district} value={court} onChange={(event) => { setCourt(event.target.value); clearResults(); }}>
                  <option value="">Select court complex</option>
                  {courts.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            {locationReady ? (
              <p className="finder-context-ready">Ready to search in <b>{court}</b> · {district}, {state}.</p>
            ) : (
              <p className="finder-context-hint">Choose all three fields, then use a search tab below.</p>
            )}
            {locationError && <p className="finder-error" aria-live="polite">{error}</p>}
            {(state || district || court) && <button className="finder-reset" type="button" onClick={resetLocation}>Clear court context</button>}
          </fieldset>

          <section className="finder-workspace" aria-labelledby="finder-title">
            <nav className="finder-tabs" aria-label="Search type" role="tablist">
              {modes.map((item) => {
                const Icon = item.icon;
                const selected = item.id === mode;
                return (
                  <button
                    aria-controls="finder-search-panel"
                    aria-selected={selected}
                    className={selected ? "active" : ""}
                    id={`finder-tab-${item.id}`}
                    key={item.id}
                    onClick={() => selectMode(item.id)}
                    role="tab"
                    type="button"
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="finder-criteria" id="finder-search-panel" role="tabpanel" aria-labelledby={`finder-tab-${mode}`}>
              <div className="finder-panel-title">
                <span className="find-menu-icon" aria-hidden="true"><Search /></span>
                <div>
                  <h2 id="finder-title">{title}</h2>
                  <p>{description}</p>
                </div>
              </div>
              {mode === "cnr" && (
                <label>CNR or Case ID
                  <input autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. NYA-WB-DEMO-04821" />
                </label>
              )}
              {mode === "status" && (
                <>
                  <label>Party name or case number
                    <input autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a bundled name or case ID" />
                  </label>
                  <div className="finder-field-row finder-status-row">
                    <label>Registration Year
                      <input inputMode="numeric" maxLength={4} value={year} onChange={(event) => setYear(event.target.value.replace(/[^0-9]/g, ""))} placeholder="Enter year" />
                    </label>
                    <label>Case type
                      <select value={caseType} onChange={(event) => setCaseType(event.target.value)}>
                        <option value="">All case types</option>
                        {caseTypeGroups.map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.options.map((item) => <option key={item}>{item}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </label>
                  </div>
                  <fieldset className="finder-disposition">
                    <legend>Case status</legend>
                    {(["pending", "disposed", "both"] as Disposition[]).map((item) => (
                      <label key={item}>
                        <input checked={disposition === item} name="disposition" onChange={() => setDisposition(item)} type="radio" />
                        <span>{item[0].toUpperCase() + item.slice(1)}</span>
                      </label>
                    ))}
                  </fieldset>
                </>
              )}
              {(mode === "advocate" || mode === "judge") && (
                <PersonPicker label={mode === "advocate" ? "Advocate name" : "Judge name"} people={people} value={person} onChange={setPerson} />
              )}
              {mode === "orders" && <p className="finder-note">Only bundled records with an illustrative order document will appear.</p>}
              {mode === "cause-list" && <p className="finder-note">Search opens the Daily Cause List for the selected court. Listings are illustrative, not live court data.</p>}
              {mode === "caveat" && <p className="finder-note">No caveat records are bundled. The search will clearly confirm the empty state.</p>}
              {searchError && <p className="finder-error" aria-live="polite">{error}</p>}
              <div className="finder-actions">
                <button className="login" type="submit">{mode === "cause-list" ? "Open daily cause list" : "Search local records"} <span aria-hidden="true">→</span></button>
                <button className="finder-reset" type="button" onClick={resetSearch}>Reset search</button>
              </div>
            </div>
          </section>
        </form>
        {results !== null && <Results mode={mode} results={results} />}
        <aside className="finder-help">
          <b>How search works</b>
          <p>All search fields use bundled fictional data. No live database, CAPTCHA, identity system, or external API is used.</p>
          <ul>
            <li>Case IDs and people are entries.</li>
            <li>Results open only local Nyaya case workspaces.</li>
            <li>“Pending” and “Disposed” are illustrative search labels, not court status records.</li>
          </ul>
        </aside>
        <Link className="back-link" href="/">← Back to Nyaya home</Link>
      </div>
    </main>
  );
}

function PersonPicker({ label, people, value, onChange }: { label: string; people: FinderPerson[]; value: string; onChange: (value: string) => void }) {
  return (
    <label>{label}
      <select className="finder-person-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select {label.toLowerCase()}</option>
        {people.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
      </select>
      <small>All names are fictional and shown only for this site.</small>
    </label>
  );
}

function Results({ mode, results }: { mode: Mode; results: UnifiedCase[] }) {
  if (!results.length) {
    return (
      <section className="finder-results" aria-live="polite">
        <p className="eyebrow">0 local results</p>
        <h2>{mode === "caveat" ? "No fictional caveat record is bundled." : "No cases matched this search."}</h2>
        <p>Try another court context or adjust the search fields. Nyaya did not query a live court system.</p>
      </section>
    );
  }
  return (
    <section className="finder-results" aria-live="polite">
      <p className="eyebrow">{results.length} local result{results.length === 1 ? "" : "s"}</p>
      <h2>Matching case records</h2>
      <div className="finder-result-list">
        {results.map((item) => (
          <Link href={`/cases/${item.id}`} key={item.id}>
            <div>
              <span className="demo-pill">demo</span>
              <h3>{item.title}</h3>
              <p><code>{item.id}</code> · {item.caseType}</p>
            </div>
            <div className="finder-result-meta">
              <span>{item.court.name}</span>
              <small>{item.court.judge}</small>
              <b>Open case →</b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
