"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLatestCaseEvent, getUserCases, isPendingApproval } from "@/data/user-cases";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
import type { UnifiedCase } from "@/data/unified-case";

const date = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(`${value}T00:00:00`));
type Filter = "all" | "pending" | "attention" | "upcoming" | "recent";
const labels: Record<Filter, string> = {
  all: "All",
  pending: "Pending for approval",
  attention: "Attention",
  upcoming: "Upcoming",
  recent: "Recently Updated"
};

function parseFilter(value: string | null): Filter {
  return value === "pending" || value === "attention" || value === "upcoming" || value === "recent" ? value : "all";
}

export default function MyCasesList() {
  const search = useSearchParams();
  const [cases, setCases] = useState<UnifiedCase[]>([]);
  const [filter, setFilter] = useState<Filter>(() => parseFilter(search.get("tab")));
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const refresh = () => { setCases(getUserCases()); setRole(getMockRole()); };
    refresh();
    window.addEventListener("nyaya-demo-case-updated", refresh);
    window.addEventListener("nyaya-mock-session", refresh);
    return () => {
      window.removeEventListener("nyaya-demo-case-updated", refresh);
      window.removeEventListener("nyaya-mock-session", refresh);
    };
  }, []);

  useEffect(() => {
    setFilter(parseFilter(search.get("tab")));
  }, [search]);

  const pendingCount = cases.filter(isPendingApproval).length;
  const items = useMemo(() => cases.filter((caseData) => {
    const haystack = `${caseData.title} ${caseData.id} ${caseData.caseType} ${caseData.court.name} ${caseData.transactionId ?? ""}`.toLowerCase();
    const attention = caseData.actionsRequired.some((item) => item.status === "open" || item.status === "requested" || item.status === "issued" || item.status === "assigned" || item.status === "attempted" || item.status === "clarification-requested");
    if (!haystack.includes(query.toLowerCase())) return false;
    if (filter === "attention") return attention;
    if (filter === "pending") return isPendingApproval(caseData);
    return true;
  }).sort((a, b) => {
    if (filter === "upcoming") return a.nextHearing.date.localeCompare(b.nextHearing.date);
    if (filter === "recent" || filter === "pending") return (getLatestCaseEvent(b)?.occurredAt ?? "").localeCompare(getLatestCaseEvent(a)?.occurredAt ?? "");
    return 0;
  }), [cases, filter, query]);

  return (
    <main className="wrap cases-page">
      <p className="kicker">{role ? `${roleConfig[role].workspace} demo data` : "Demo workspace · demo data"}</p>
      <h1>My cases</h1>
      <p>Cases you are following or working on. Filings started from File a fresh case appear under Pending for approval until the local registry accepts them.</p>
      <div className="case-list-controls">
        <label>Search cases<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, ID, type, court or transaction ID" /></label>
        <div role="group" aria-label="Filter cases">
          {(["all", "pending", "attention", "upcoming", "recent"] as Filter[]).map((value) => (
            <button aria-pressed={filter === value} className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>
              {value === "pending" ? `${labels[value]} (${pendingCount})` : labels[value]}
            </button>
          ))}
        </div>
      </div>
      <p className="case-filter-summary">
        {filter === "pending" ? `${items.length} filing${items.length === 1 ? "" : "s"} pending for approval` : filter === "attention" ? `${items.length} cases need attention` : `${items.length} cases`}
      </p>
      {items.length === 0 ? (
        <div className="case-empty">
          <b>{filter === "pending" ? "No filings are waiting for approval." : "No cases match this view."}</b>
          <p>{filter === "pending" ? "Cases you file from File a fresh case will appear here with their transaction ID." : "Try another filter or search term."}</p>
          {filter === "pending" && <Link className="filing-continue" href="/file-a-case">File a fresh case →</Link>}
        </div>
      ) : (
        <div className="case-table" role="list">
          {items.map((caseData) => {
            const pending = isPendingApproval(caseData);
            return (
              <Link href={`/cases/${caseData.id}`} key={caseData.id} role="listitem">
                <div>
                  <b>{caseData.title}</b>
                  <small>{caseData.caseType} · <code>{caseData.id}</code>{caseData.transactionId ? ` · ${caseData.transactionId}` : ""}</small>
                  {pending && <em className="pending-pill">Pending for approval</em>}
                </div>
                <p><span>Court</span>{caseData.court.name}<small>{caseData.court.establishment}</small></p>
                <p><span>Stage</span>{pending ? "Pending for approval" : caseData.stage.current}</p>
                <p><span>Next activity</span>{date(caseData.nextHearing.date)}<small>{caseData.nextHearing.time}</small></p>
                <p className={caseData.actionsRequired.some((item) => item.status === "open" || item.status === "requested" || item.status === "issued" || item.status === "assigned" || item.status === "attempted" || item.status === "clarification-requested") ? "has-attention" : ""}><span>Attention</span>{pending ? "Registry review" : caseData.actionsRequired.filter((item) => item.status === "open" || item.status === "requested" || item.status === "issued" || item.status === "assigned" || item.status === "attempted" || item.status === "clarification-requested").length || "None"}</p>
                <p><span>Updated</span>{date(getLatestCaseEvent(caseData)?.occurredAt ?? caseData.status.updatedAt)}</p>
                <i aria-hidden="true">→</i>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
