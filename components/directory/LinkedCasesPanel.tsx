"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CaseStatusBadge, dateLabel, type LinkedCaseItem } from "@/components/directory/PublicProfileShared";
import Link from "next/link";

export function LinkedCasesPanel({
  items,
  empty,
  roleLabel,
}: {
  items: LinkedCaseItem[];
  empty: string;
  roleLabel?: boolean;
}) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (!needle) return true;
      return [item.id, item.title, item.caseType, item.status, item.role, dateLabel(item.nextHearing)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    const byDate = new Map<string, LinkedCaseItem[]>();
    for (const item of filtered) {
      const list = byDate.get(item.nextHearing) ?? [];
      list.push(item);
      byDate.set(item.nextHearing, list);
    }
    return Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items, query]);

  return (
    <>
      <div className="linked-case-heading">
        <div>
          <span className="eyebrow">Public case record</span>
          <h2>Linked cases</h2>
          <p>Matters on the public record, grouped by next-hearing date.</p>
        </div>
        <form className="linked-case-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="linked-case-query">Search cases</label>
          <div>
            <Search aria-hidden="true" />
            <input
              id="linked-case-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Case number, title, type or date"
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
      {!items.length && <p className="empty-state">{empty}</p>}
      {items.length > 0 && !groups.length && <p className="empty-state">No linked cases match this search.</p>}
      {groups.map(([date, cases]) => (
        <section className="linked-case-group" key={date}>
          <h3><time dateTime={date}>{dateLabel(date)}</time> <small>{cases.length} matter{cases.length === 1 ? "" : "s"}</small></h3>
          <div className="linked-case-list">
            {cases.map((item) => (
              <Link className="linked-case-card" href={`/cases/${item.id}`} key={item.id}>
                <div>
                  {roleLabel && item.role && <span className="counsel-role">{item.role}</span>}
                  <b>{item.title}</b>
                  <p><code>{item.id}</code> · {item.caseType}</p>
                </div>
                <div className="linked-case-meta">
                  <CaseStatusBadge label={item.status} />
                  <time dateTime={item.nextHearing}>Next hearing {dateLabel(item.nextHearing)}</time>
                  <span>Open case →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
