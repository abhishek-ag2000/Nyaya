"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { DirectoryPagination, directoryPageItems } from "@/components/directory/DirectoryPagination";
import { syntheticJudges } from "@/data/synthetic-judges";

const unique = (items: string[]) => Array.from(new Set(items));

export default function JudgesDirectory() {
  const [state, setState] = useState("All states");
  const [district, setDistrict] = useState("All districts");
  const [court, setCourt] = useState("All courts");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const states = unique(syntheticJudges.map((item) => item.state));
  const districts = unique(syntheticJudges.filter((item) => state === "All states" || item.state === state).map((item) => item.district));
  const courts = unique(syntheticJudges.filter((item) => (state === "All states" || item.state === state) && (district === "All districts" || item.district === district)).map((item) => item.court));
  const items = useMemo(() => syntheticJudges.filter((item) =>
    (state === "All states" || item.state === state) &&
    (district === "All districts" || item.district === district) &&
    (court === "All courts" || item.court === court) &&
    `${item.displayName} ${item.name} ${item.designation} ${item.jurisdiction.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [state, district, court, query]);
  const pageItems = directoryPageItems(items, page);

  useEffect(() => { setPage(1); }, [state, district, court, query]);

  return <main className="wrap advocate-directory judges-directory">
    <p className="kicker">Court information · demo data</p>
    <h1>Judges directory</h1>
    <p>Explore fictional judicial assignments by state, district, court, designation, and jurisdiction.</p>
    <section className="directory-controls" aria-label="Judges directory filters">
      <label>State<select value={state} onChange={(event) => { setState(event.target.value); setDistrict("All districts"); setCourt("All courts"); }}><option>All states</option>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>District<select value={district} onChange={(event) => { setDistrict(event.target.value); setCourt("All courts"); }}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Court<select value={court} onChange={(event) => setCourt(event.target.value)}><option>All courts</option>{courts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Search judge or jurisdiction<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, designation or jurisdiction" /></label>
    </section>
    <section className="directory-context"><div><span>Selected context</span><b>{district === "All districts" ? "All listed districts" : district}</b></div><div><span>Courts represented</span><b>{unique(items.map((item) => item.court)).length} <small>illustrative</small></b></div><div><span>Judicial profiles</span><b>{items.length} <small>listed</small></b></div><div><span>Jurisdictions shown</span><b>{unique(items.flatMap((item) => item.jurisdiction)).length} <small>illustrative</small></b></div></section>
    <div className="advocate-cards judge-cards">{pageItems.map((item, index) => <article key={`${item.id}-${index}`}><span className="demo-pill">Judicial profile</span><div className={`profile-portrait judge-portrait portrait-${Number(item.id.match(/\d+$/)?.[0] || index + 1)}`} role="img" aria-label={`Portrait for ${item.displayName}`} /><h2>{item.displayName}</h2><p className="advocate-practice">{item.designation}</p><dl><div><dt>District / court</dt><dd><MapPin aria-hidden="true" /> {item.district} · {item.court}</dd></div><div><dt>Jurisdiction</dt><dd>{item.jurisdiction.join(" · ")}</dd></div><div><dt>Courtroom</dt><dd>{item.courtroom}</dd></div><div><dt>Linked cases</dt><dd>{item.caseIds.length} linked case{item.caseIds.length === 1 ? "" : "s"}</dd></div></dl><Link className="directory-profile-link" href={`/judges-directory/${item.id}`}>View public profile →</Link></article>)}</div>
    {items.length > 0 && <DirectoryPagination page={page} onPage={setPage} noun="judicial profiles" />}
    {!items.length && <p className="empty-state">No fictional judicial profiles match this filter combination.</p>}
  </main>;
}
