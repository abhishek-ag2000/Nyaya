"use client";

import { useMemo, useState } from "react";
import { Gavel, MapPin } from "lucide-react";
import { syntheticJudges } from "@/data/synthetic-judges";

const unique = (items: string[]) => Array.from(new Set(items));

export default function JudgesDirectory() {
  const [state, setState] = useState("All states");
  const [district, setDistrict] = useState("All districts");
  const [court, setCourt] = useState("All courts");
  const [query, setQuery] = useState("");
  const states = unique(syntheticJudges.map((item) => item.state));
  const districts = unique(syntheticJudges.filter((item) => state === "All states" || item.state === state).map((item) => item.district));
  const courts = unique(syntheticJudges.filter((item) => (state === "All states" || item.state === state) && (district === "All districts" || item.district === district)).map((item) => item.court));
  const items = useMemo(() => syntheticJudges.filter((item) =>
    (state === "All states" || item.state === state) &&
    (district === "All districts" || item.district === district) &&
    (court === "All courts" || item.court === court) &&
    `${item.name} ${item.designation} ${item.jurisdiction.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [state, district, court, query]);

  return <main className="wrap advocate-directory judges-directory">
    <p className="kicker">Court information · synthetic prototype data</p>
    <h1>Judges directory</h1>
    <p>Explore fictional judicial assignments by state, district, court, designation, and jurisdiction.</p>
    <section className="directory-disclosure"><b>Prototype directory</b><span>Every name, assignment, courtroom, jurisdiction, and sitting time on this page is fictional. This is not an official judicial directory.</span></section>
    <section className="directory-controls" aria-label="Judges directory filters">
      <label>State<select value={state} onChange={(event) => { setState(event.target.value); setDistrict("All districts"); setCourt("All courts"); }}><option>All states</option>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>District<select value={district} onChange={(event) => { setDistrict(event.target.value); setCourt("All courts"); }}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Court<select value={court} onChange={(event) => setCourt(event.target.value)}><option>All courts</option>{courts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Search judge or jurisdiction<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, designation or jurisdiction" /></label>
    </section>
    <section className="directory-context"><div><span>Selected context</span><b>{district === "All districts" ? "All listed districts" : district}</b></div><div><span>Courts represented</span><b>{unique(items.map((item) => item.court)).length} <small>illustrative</small></b></div><div><span>Judicial profiles</span><b>{items.length} <small>synthetic</small></b></div><div><span>Jurisdictions shown</span><b>{unique(items.flatMap((item) => item.jurisdiction)).length} <small>illustrative</small></b></div></section>
    <div className="advocate-cards judge-cards">{items.map((item) => <article key={item.id}><span className="demo-pill">synthetic judicial profile</span><div className="judge-card-icon"><Gavel aria-hidden="true" /></div><h2>{item.name}</h2><p className="advocate-practice">{item.designation}</p><dl><div><dt>District / court</dt><dd><MapPin aria-hidden="true" /> {item.district} · {item.court}</dd></div><div><dt>Jurisdiction</dt><dd>{item.jurisdiction.join(" · ")}</dd></div><div><dt>Courtroom</dt><dd>{item.courtroom}</dd></div><div><dt>Illustrative sitting</dt><dd>{item.sitting}</dd></div></dl></article>)}</div>
    {!items.length && <p className="empty-state">No fictional judicial profiles match this filter combination.</p>}
  </main>;
}
