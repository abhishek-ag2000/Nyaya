"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  formatHearingDateLong,
  formatHearingDateShort,
  getCaseHearingsTimeline,
  type Hearing,
} from "@/data/hearings";
import type { Role } from "@/data/roles";
import type { UnifiedCase } from "@/data/unified-case";
import HearingCard from "@/components/hearings/HearingCard";
import HearingPreviewVideo from "@/components/hearings/HearingPreviewVideo";

export default function CaseHearingsPanel({
  caseData,
  role,
}: {
  caseData: UnifiedCase;
  role: Role | null;
}) {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    const refresh = () => setHearings(getCaseHearingsTimeline(caseData.id, caseData));
    refresh();
    window.addEventListener("nyaya-hearing-updated", refresh);
    return () => window.removeEventListener("nyaya-hearing-updated", refresh);
  }, [caseData]);

  const dates = useMemo(() => {
    const unique = Array.from(new Set(hearings.map((item) => item.hearingDate)));
    return unique.sort((a, b) => b.localeCompare(a));
  }, [hearings]);

  const filtered = useMemo(() => {
    if (dateFilter === "all") return hearings;
    return hearings.filter((item) => item.hearingDate === dateFilter);
  }, [dateFilter, hearings]);

  const groups = useMemo(() => {
    const map = new Map<string, Hearing[]>();
    for (const hearing of filtered) {
      map.set(hearing.hearingDate, [...(map.get(hearing.hearingDate) ?? []), hearing]);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <section className="case-panel case-hearings-panel">
      <div className="tab-heading">
        <div>
          <span className="eyebrow">Hearings</span>
          <h2 className="tab-section-title">Hearings on this case</h2>
        </div>
        <Link className="text-action" href="/hearings">
          Open Hearings board →
        </Link>
      </div>
      <p className="case-hearings-intro">
        Listed dates for this matter. Each row includes a demo hearing preview. Select a date to filter the list.
      </p>

      {dates.length > 0 && (
        <div className="case-hearings-dates" role="group" aria-label="Filter by hearing date">
          <button
            type="button"
            className={dateFilter === "all" ? "active" : ""}
            aria-pressed={dateFilter === "all"}
            onClick={() => setDateFilter("all")}
          >
            All
          </button>
          {dates.map((date) => (
            <button
              key={date}
              type="button"
              className={dateFilter === date ? "active" : ""}
              aria-pressed={dateFilter === date}
              onClick={() => setDateFilter(date)}
            >
              {formatHearingDateShort(date)}
            </button>
          ))}
        </div>
      )}

      {!groups.length ? (
        <p className="empty-state">No hearings are listed for this case yet.</p>
      ) : (
        <div className="case-hearings-groups">
          {groups.map(([date, items]) => (
            <section key={date} className="case-hearings-group" aria-label={formatHearingDateLong(date)}>
              <h3>{formatHearingDateLong(date)}</h3>
              <div className="case-hearings-rows">
                {items.map((hearing) => (
                  <HearingCard
                    key={hearing.id}
                    hearing={hearing}
                    role={role}
                    preview={<HearingPreviewVideo hearing={hearing} role={role} />}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
