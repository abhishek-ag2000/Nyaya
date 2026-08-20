"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CaseHistoryRow, UnifiedCase } from "@/data/unified-case";
import {
  compressCaseHistory,
  formatJourneyRange,
  formatOverviewDate,
  formatOverviewDayMonth,
  getCaseHistoryNewestFirst,
  metaOrDash,
  shortenActName,
} from "@/lib/case-overview";

function displayPerson(name: string) {
  return name.replace(/\s*\((?:synthetic|prototype)\)\s*/gi, "").replace(/\s+/g, " ").trim();
}

export default function CaseOverview({
  caseData,
  onOpenTimeline,
  onOpenOrders,
}: {
  caseData: UnifiedCase;
  onOpenTimeline: () => void;
  onOpenOrders: () => void;
}) {
  const historyNewest = useMemo(() => getCaseHistoryNewestFirst(caseData), [caseData]);
  const journey = useMemo(() => compressCaseHistory(historyNewest), [historyNewest]);
  const orderDocs = (caseData.documents ?? []).filter(
    (document) => document.category === "Order" || (caseData.orders ?? []).includes(document.id)
  );

  return (
    <div className="overview-stack case-overview">
      <CaseJourney groups={journey} onOpenTimeline={onOpenTimeline} />
      <RecentProceedings rows={historyNewest.slice(0, 3)} onOpenTimeline={onOpenTimeline} />
      <OrdersSummary caseId={caseData.id} orders={orderDocs} onOpenOrders={onOpenOrders} />
      <OverviewPeople caseData={caseData} />
      <CaseDetails caseData={caseData} />
    </div>
  );
}

function OverviewPeople({ caseData }: { caseData: UnifiedCase }) {
  const people = [
    ...caseData.parties.petitioners.map((name, index) => ({
      key: `petitioner-${name}`,
      role: "Petitioner",
      name: displayPerson(name),
      avatar: `case-avatar citizen-avatar portrait-${(index % 2) + 1}`,
    })),
    ...caseData.advocates.petitioner.map((name, index) => ({
      key: `pet-adv-${name}`,
      role: "Petitioner advocate",
      name: displayPerson(name),
      avatar: `case-avatar lawyer-avatar portrait-${(index % 2) + 1}`,
    })),
    ...caseData.parties.respondents.map((name, index) => ({
      key: `respondent-${name}`,
      role: "Respondent",
      name: displayPerson(name),
      avatar: `case-avatar citizen-avatar portrait-${(index % 2) + 2}`,
    })),
    ...caseData.advocates.respondent.map((name, index) => ({
      key: `res-adv-${name}`,
      role: "Respondent advocate",
      name: displayPerson(name),
      avatar: `case-avatar lawyer-avatar portrait-${(index % 2) + 2}`,
    })),
    {
      key: "judge",
      role: "Presiding judge",
      name: displayPerson(caseData.court.judge),
      avatar: "case-avatar judge-avatar portrait-1",
    },
  ];

  return (
    <section className="overview-section overview-people" aria-label="People connected to this case">
      <h2 className="overview-section-title">People</h2>
      <ul className="overview-people-list">
        {people.map((person) => (
          <li key={person.key}>
            <span className={person.avatar} role="img" aria-label={person.role} />
            <span className="person-meta">
              <b>{person.role}</b>
              {person.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CaseJourney({
  groups,
  onOpenTimeline,
}: {
  groups: ReturnType<typeof compressCaseHistory>;
  onOpenTimeline: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!groups.length) return null;
  const lastIndex = groups.length - 1;

  return (
    <section className="overview-section case-journey">
      <div className="overview-section-head">
        <h2 className="overview-section-title">
          Case Journey
          <span className="overview-info" title="Based on recorded case history">
            ⓘ
            <span className="visually-hidden"> Based on recorded case history</span>
          </span>
        </h2>
        <button type="button" className="text-action" onClick={onOpenTimeline}>
          View full journey →
        </button>
      </div>
      <ol className="case-journey-rail">
        {groups.map((group, index) => {
          const key = `${group.purpose}-${group.from}`;
          const open = expanded === key;
          const isCurrent = index === lastIndex;
          return (
            <li key={key} className={isCurrent ? "is-current" : undefined}>
              <div className="case-journey-step">
                <b>{group.purpose}</b>
                <span>
                  {group.count > 1 ? formatJourneyRange(group.from, group.to) : formatOverviewDayMonth(group.from)}
                </span>
                {group.count > 1 && (
                  <button type="button" className="text-action journey-listings" onClick={() => setExpanded(open ? null : key)}>
                    {group.count} listings{open ? " · hide" : ""}
                  </button>
                )}
                {isCurrent && <em>Current</em>}
                {open && (
                  <ul className="case-journey-dates">
                    {group.dates.map((date) => (
                      <li key={date}>{formatOverviewDate(date)}</li>
                    ))}
                  </ul>
                )}
              </div>
              {index < lastIndex && (
                <span className="case-journey-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function RecentProceedings({ rows, onOpenTimeline }: { rows: CaseHistoryRow[]; onOpenTimeline: () => void }) {
  if (!rows.length) return null;
  return (
    <section className="overview-section recent-proceedings">
      <div className="overview-section-head">
        <h2 className="overview-section-title">Recent Proceedings</h2>
        <button type="button" className="text-action" onClick={onOpenTimeline}>
          View complete history →
        </button>
      </div>
      <ul className="recent-proceedings-list">
        {rows.map((row) => (
          <li key={`${row.businessDate}-${row.purpose}`}>
            <time dateTime={row.businessDate}>{formatOverviewDate(row.businessDate)}</time>
            <b>{row.purpose}</b>
            <span>{row.nextHearingDate ? `Next ${formatOverviewDayMonth(row.nextHearingDate)}` : ""}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OrdersSummary({
  caseId,
  orders,
  onOpenOrders,
}: {
  caseId: string;
  orders: UnifiedCase["documents"];
  onOpenOrders: () => void;
}) {
  if (!orders.length) return null;
  const latest = [...orders].sort((a, b) => b.date.localeCompare(a.date))[0];
  const label = latest.processing?.classification ?? (latest.category === "Order" ? "Court Order" : latest.category);
  return (
    <section className="overview-section overview-orders">
      <div className="overview-section-head">
        <h2 className="overview-section-title">
          Orders &amp; Judgments
          {orders.length > 1 ? <span className="overview-count">{orders.length} orders</span> : null}
        </h2>
        <button type="button" className="text-action" onClick={onOpenOrders}>
          View all orders →
        </button>
      </div>
      <div className="overview-order-row">
        <time dateTime={latest.date}>{formatOverviewDate(latest.date)}</time>
        <b>{label}</b>
        <Link className="text-action" href={`/cases/${caseId}/documents/${latest.id}`}>
          View Order
        </Link>
      </div>
    </section>
  );
}

function CaseDetails({ caseData }: { caseData: UnifiedCase }) {
  const [showFull, setShowFull] = useState(false);
  const registration = metaOrDash(caseData.identity?.registrationNumber);
  const cnr = metaOrDash(caseData.identity?.cnr);

  return (
    <section className="overview-section overview-case-details">
      <h2 className="overview-section-title">Case Details</h2>
      <div className="overview-details-grid">
        <div>
          <span className="eyebrow">Case</span>
          <p>
            {caseData.caseType}
            {registration !== "—" ? ` · ${registration}` : ""}
          </p>
          {cnr !== "—" && (
            <p className="overview-cnr">
              CNR <code>{cnr}</code>
            </p>
          )}
        </div>
        <div>
          <span className="eyebrow">Court</span>
          <p>{caseData.court.name}</p>
          <p className="overview-muted">
            {caseData.court.establishment} · {caseData.court.courtroom}
          </p>
        </div>
        {caseData.provisions?.length ? (
          <div>
            <span className="eyebrow">Law</span>
            {caseData.provisions.map((item) => (
              <p key={item.act}>
                {shortenActName(item.act)}
                {" · "}
                {item.sections.map((section) => `Section ${section}`).join(", ")}
              </p>
            ))}
          </div>
        ) : null}
        <div>
          <span className="eyebrow">Filed</span>
          <p>
            {formatOverviewDate(caseData.dates?.filingDate)}
            {caseData.dates?.registrationDate
              ? ` · Registered ${formatOverviewDate(caseData.dates.registrationDate)}`
              : ""}
          </p>
        </div>
      </div>

      {showFull && (
        <dl className="overview-full-meta">
          <div>
            <dt>Filing number</dt>
            <dd>{metaOrDash(caseData.identity?.filingNumber)}</dd>
          </div>
          <div>
            <dt>Filing date</dt>
            <dd>{formatOverviewDate(caseData.dates?.filingDate)}</dd>
          </div>
          <div>
            <dt>Registration number</dt>
            <dd>{registration}</dd>
          </div>
          <div>
            <dt>Registration date</dt>
            <dd>{formatOverviewDate(caseData.dates?.registrationDate)}</dd>
          </div>
          <div>
            <dt>e-Filing number</dt>
            <dd>{metaOrDash(caseData.identity?.eFilingNumber)}</dd>
          </div>
          <div>
            <dt>e-Filing date</dt>
            <dd>{formatOverviewDate(caseData.identity?.eFilingDate)}</dd>
          </div>
          <div>
            <dt>First hearing</dt>
            <dd>{formatOverviewDate(caseData.dates?.firstHearingDate)}</dd>
          </div>
          <div>
            <dt>Presiding judge</dt>
            <dd>{caseData.court.judge}</dd>
          </div>
          <div>
            <dt>District / State</dt>
            <dd>
              {caseData.court.district}, {caseData.court.state}
            </dd>
          </div>
        </dl>
      )}

      <button type="button" className="text-action" onClick={() => setShowFull((value) => !value)}>
        {showFull ? "Hide full case details" : "View full case details →"}
      </button>
    </section>
  );
}
