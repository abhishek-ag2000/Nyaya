"use client";

import Link from "next/link";
import { DEMO_HEARING_DAY, getHearingsForCase, type Hearing } from "@/data/hearings";
import type { UnifiedCase } from "@/data/unified-case";
import type { Role } from "@/data/roles";
import { canJoinHearing } from "@/lib/hearing-access";
import {
  formatCaseDuration,
  formatOverviewDate,
  hasNextHearing,
  isDisposedCase,
} from "@/lib/case-overview";
import HearingStatusBadge from "@/components/hearings/HearingStatusBadge";

function causeListHref(court: UnifiedCase["court"]) {
  return `/cause-list?${new URLSearchParams({ state: court.state, district: court.district, court: court.establishment }).toString()}`;
}

function modeLabel(mode: UnifiedCase["nextHearing"]["mode"]) {
  if (mode === "virtual") return "Virtual Hearing";
  if (mode === "hybrid") return "Hybrid Hearing";
  return "Physical Hearing";
}

export default function CaseHeaderStatus({
  caseData,
  role,
  onOpenHearings,
}: {
  caseData: UnifiedCase;
  role: Role | null;
  onOpenHearings: () => void;
}) {
  const disposed = isDisposedCase(caseData);
  const todayHearing = getHearingsForCase(caseData.id).find((item) => item.hearingDate === DEMO_HEARING_DAY);
  const pendingLabel =
    caseData.dates?.filingDate && !disposed
      ? `Pending · ${formatCaseDuration(caseData.dates.filingDate)}`
      : null;

  if (disposed) {
    const finalOrder = [...caseData.documents]
      .filter((document) => document.category === "Order" || caseData.orders.includes(document.id))
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    return (
      <section className="header-stage header-status" aria-label="Case outcome">
        <p className="header-status-kicker">
          Disposed{caseData.status.natureOfDisposal ? ` — ${caseData.status.natureOfDisposal}` : ""}
        </p>
        <b className="header-status-title">{caseData.status.label}</b>
        <p className="header-status-line">
          Decision · {formatOverviewDate(caseData.dates?.decisionDate ?? caseData.status.updatedAt)}
        </p>
        {finalOrder && (
          <Link className="text-action" href={`/cases/${caseData.id}/documents/${finalOrder.id}`}>
            View Final Order
          </Link>
        )}
      </section>
    );
  }

  if (!hasNextHearing(caseData)) {
    return (
      <section className="header-stage header-status" aria-label="Current case status">
        <div className="header-status-head">
          <p className="header-status-kicker">Pending</p>
          {pendingLabel && <span className="header-pending-chip">{pendingLabel}</span>}
        </div>
        <b className="header-status-title">{caseData.stage.current}</b>
        <p className="header-status-meta">No next hearing date presently available.</p>
      </section>
    );
  }

  return (
    <section className="header-stage header-status" aria-label="Current case status">
      <div className="header-status-head">
        <p className="header-status-kicker">{caseData.status.label}</p>
        {pendingLabel && <span className="header-pending-chip">{pendingLabel}</span>}
      </div>
      <b className="header-status-title">{caseData.nextHearing.purpose}</b>
      <p className="header-status-when">
        {formatOverviewDate(caseData.nextHearing.date)} · {caseData.nextHearing.time}
      </p>
      <p className="header-status-venue">
        {caseData.court.courtroom} · {caseData.court.judge}
        <br />
        {caseData.court.name}
      </p>
      <span className="header-mode-badge">{modeLabel(caseData.nextHearing.mode)}</span>
      {todayHearing && <HeaderHearingCue hearing={todayHearing} role={role} />}
      <div className="header-status-actions">
        <button type="button" className="text-action" onClick={onOpenHearings}>
          View Hearing
        </button>
        <Link className="text-action" href={causeListHref(caseData.court)}>
          Cause List
        </Link>
      </div>
    </section>
  );
}

function HeaderHearingCue({ hearing, role }: { hearing: Hearing; role: Role | null }) {
  const canJoin = canJoinHearing(role, hearing);
  if (hearing.status === "LIVE") {
    return (
      <div className="case-hearing-live header-hearing-cue">
        <HearingStatusBadge status="LIVE" />
        <span>Hearing Live</span>
        {canJoin ? (
          <Link href={`/hearings/${hearing.id}`}>Open Hearing</Link>
        ) : (
          <span className="hearing-restricted">Virtual proceeding restricted</span>
        )}
      </div>
    );
  }
  if (hearing.mode === "VIRTUAL" || hearing.mode === "HYBRID") {
    return (
      <div className="case-hearing-live header-hearing-cue">
        <span>Virtual Hearing</span>
        <small>Today{hearing.hearingTime ? ` · ${hearing.hearingTime}` : ""}</small>
        {canJoin ? <Link href={`/hearings/${hearing.id}`}>Join Hearing</Link> : null}
      </div>
    );
  }
  return null;
}
