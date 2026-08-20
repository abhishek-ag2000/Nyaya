"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { DirectoryPagination, directoryPageItems } from "@/components/directory/DirectoryPagination";
import { syntheticAdvocates } from "@/data/synthetic-advocates";

const unique = (items: string[]) => Array.from(new Set(items));

export default function AdvocateDirectory() {
  const [state, setState] = useState("All states");
  const [district, setDistrict] = useState("All districts");
  const [court, setCourt] = useState("All courts");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const states = unique(syntheticAdvocates.map((item) => item.state));
  const districts = unique(syntheticAdvocates.filter((item) => state === "All states" || item.state === state).map((item) => item.district));
  const courts = unique(syntheticAdvocates.filter((item) =>
    (state === "All states" || item.state === state) &&
    (district === "All districts" || item.district === district)
  ).map((item) => item.court));

  const items = useMemo(() => syntheticAdvocates.filter((item) =>
    (state === "All states" || item.state === state) &&
    (district === "All districts" || item.district === district) &&
    (court === "All courts" || item.court === court) &&
    `${item.displayName} ${item.name} ${item.practiceAreas.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [state, district, court, query]);
  const pageItems = directoryPageItems(items, page);

  useEffect(() => { setPage(1); }, [state, district, court, query]);

  return <main className="wrap advocate-directory">
    <p className="kicker">Lawyers directory · demo data</p>
    <h1>Lawyers directory</h1>
    <p>Browse fictional professional profiles by location, court, and practice area, then explore linked cases.</p>

    <section className="directory-disclosure"><b>Directory</b><span>Every name, registration label, review status, professional detail, and linked case is fictional. This is not an official bar or advocate directory.</span></section>

    <section className="directory-controls" aria-label="Lawyers directory filters">
      <label>State<select value={state} onChange={(event) => { setState(event.target.value); setDistrict("All districts"); setCourt("All courts"); }}><option>All states</option>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>District<select value={district} onChange={(event) => { setDistrict(event.target.value); setCourt("All courts"); }}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Court<select value={court} onChange={(event) => setCourt(event.target.value)}><option>All courts</option>{courts.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Search lawyer or practice area<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or practice area" /></label>
    </section>

    <section className="directory-context">
      <div><span>Selected context</span><b>{district === "All districts" ? "All listed districts" : district}</b></div>
      <div><span>Courts represented</span><b>{unique(items.map((item) => item.court)).length} <small>illustrative</small></b></div>
      <div><span>Professional profiles</span><b>{items.length} <small>listed</small></b></div>
      <div><span>Review complete</span><b>{items.filter((item) => item.documentReview.includes("complete")).length} <small>illustrative</small></b></div>
    </section>

    <div className="advocate-cards">{pageItems.map((item, index) => <article key={`${item.id}-${index}`}>
      <span className="demo-pill">Professional profile</span>
      <div className={`profile-portrait lawyer-portrait portrait-${Number(item.id.match(/\d+$/)?.[0] || index + 1)}`} role="img" aria-label={`Portrait for ${item.displayName}`} />
      <h2>{item.displayName}</h2>
      <p className="advocate-practice">{item.practiceAreas.join(" · ")}</p>
      <dl>
        <div><dt>District / court</dt><dd><MapPin aria-hidden="true" /> {item.district} · {item.court}</dd></div>
        <div><dt>Registration</dt><dd>{item.registrationStatus}</dd></div>
        <div><dt>Document review</dt><dd>{item.documentReview}</dd></div>
        <div><dt>Linked cases</dt><dd>{item.caseIds.length} linked case{item.caseIds.length === 1 ? "" : "s"}</dd></div>
      </dl>
      <Link className="directory-profile-link" href={`/advocate-directory/${item.id}`}>View public profile →</Link>
    </article>)}</div>
    {items.length > 0 && <DirectoryPagination page={page} onPage={setPage} noun="lawyer profiles" />}
    {!items.length && <p className="empty-state">No fictional profiles match this filter combination.</p>}
  </main>;
}
