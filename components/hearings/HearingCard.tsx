import Link from "next/link";
import type { ReactNode } from "react";
import type { Hearing } from "@/data/hearings";
import { formatHearingDateShort } from "@/data/hearings";
import type { Role } from "@/data/roles";
import { canJoinHearing, canViewHearing, getHearingExperience, joinActionLabel } from "@/lib/hearing-access";
import HearingStatusBadge from "@/components/hearings/HearingStatusBadge";
import VirtualHearingBadge from "@/components/hearings/VirtualHearingBadge";

export default function HearingCard({
  hearing,
  role,
  dense = false,
  onJudgeAction,
  preview,
}: {
  hearing: Hearing;
  role: Role | null;
  dense?: boolean;
  onJudgeAction?: (hearing: Hearing, action: "start" | "resume" | "end" | "adjourn") => void;
  preview?: ReactNode;
}) {
  const joinLabel = joinActionLabel(role, hearing);
  const experience = getHearingExperience(hearing);
  const canJoin = canJoinHearing(role, hearing);
  const restricted = hearing.access === "RESTRICTED" && !canJoin;
  const href = `/hearings/${hearing.id}`;
  const showWatch =
    joinLabel &&
    canJoin &&
    (hearing.status === "LIVE" || experience.experience === "DEMO_STREAM" || experience.experience === "EXTERNAL_MEETING");

  if (dense) {
    return (
      <article className="hearing-row">
        <div className="hearing-row-meta">
          {hearing.hearingTime && <time>{hearing.hearingTime}</time>}
          {hearing.itemNumber != null && <b>Item {hearing.itemNumber}</b>}
        </div>
        <div>
          <code className="hearing-row-case">{hearing.caseNumber}</code>
          <h3>{hearing.caseTitle}</h3>
          <p>
            {hearing.purpose ?? hearing.proceduralStage}
            {" · "}
            <HearingStatusBadge status={hearing.status} />
          </p>
        </div>
        <div className="hearing-row-actions">
          {role === "judge" && onJudgeAction && hearing.status !== "COMPLETED" && hearing.status !== "CANCELLED" && hearing.status !== "LIVE" && (
            <button type="button" onClick={() => onJudgeAction(hearing, hearing.status === "ADJOURNED" ? "resume" : "start")}>
              {hearing.status === "ADJOURNED" ? "Resume" : "Start"}
            </button>
          )}
          {showWatch && experience.experience === "EXTERNAL_MEETING" && (
            <a href={experience.joinUrl} target="_blank" rel="noreferrer">{joinLabel}</a>
          )}
          {showWatch && experience.experience !== "EXTERNAL_MEETING" && (
            <Link href={href}>{joinLabel}</Link>
          )}
          {!showWatch && canViewHearing(role, hearing) && (
            <Link href={href}>Open →</Link>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={`hearing-card${hearing.status === "LIVE" ? " is-live" : ""}${preview ? " has-preview" : ""}`}>
      <div className="hearing-card-main">
        <header>
          <HearingStatusBadge status={hearing.status} />
          <VirtualHearingBadge hearing={hearing} role={role} />
        </header>
        {hearing.itemNumber != null && <p className="hearing-item">Item No. {hearing.itemNumber}</p>}
        <code className="hearing-case-number">{hearing.caseNumber}</code>
        <h3>{hearing.caseTitle}</h3>
        <p className="hearing-court">
          {hearing.judgeName ? `${hearing.judgeName} · ` : ""}
          {hearing.courtNumber ? `Court No. ${hearing.courtNumber}` : hearing.courtName}
        </p>
        {(hearing.purpose || hearing.proceduralStage) && (
          <p className="hearing-purpose">{(hearing.purpose ?? hearing.proceduralStage)?.toUpperCase()}</p>
        )}
        <p className="hearing-when">
          {formatHearingDateShort(hearing.hearingDate)}
          {hearing.hearingTime ? ` · ${hearing.hearingTime}` : hearing.itemNumber != null ? ` · Item No. ${hearing.itemNumber}` : ""}
        </p>
        {hearing.isDemo && <span className="demo-pill hearing-demo-pill">Demo Hearing</span>}
        {restricted && <p className="hearing-restricted">Virtual proceeding restricted</p>}
        <footer className="hearing-card-actions">
          {role === "advocate" && (
            <Link href={`/cases/${hearing.caseId}?tab=Orders`}>View Orders</Link>
          )}
          {role === "judge" && onJudgeAction && hearing.status !== "COMPLETED" && hearing.status !== "CANCELLED" && (
            <>
              {hearing.status !== "LIVE" && (
                <button type="button" onClick={() => onJudgeAction(hearing, hearing.status === "ADJOURNED" ? "resume" : "start")}>
                  {hearing.status === "ADJOURNED" ? "Resume Hearing" : "Start Hearing"}
                </button>
              )}
              {hearing.status === "LIVE" && (
                <button type="button" onClick={() => onJudgeAction(hearing, "end")}>End Hearing</button>
              )}
              {hearing.status !== "ADJOURNED" && (
                <button type="button" className="is-quiet" onClick={() => onJudgeAction(hearing, "adjourn")}>Mark Adjourned</button>
              )}
            </>
          )}
          {showWatch && experience.experience === "EXTERNAL_MEETING" && (
            <a href={experience.joinUrl} target="_blank" rel="noreferrer">{joinLabel}</a>
          )}
          {showWatch && experience.experience !== "EXTERNAL_MEETING" && (
            <Link className="hearing-primary-action" href={href}>{joinLabel}</Link>
          )}
          {!showWatch && joinLabel && canViewHearing(role, hearing) && (
            <Link href={href}>{joinLabel}</Link>
          )}
          {role === "judge" && (
            <Link href={`/cases/${hearing.caseId}`}>Open Matter</Link>
          )}
        </footer>
      </div>
      {preview ? <div className="hearing-card-preview">{preview}</div> : null}
    </article>
  );
}
