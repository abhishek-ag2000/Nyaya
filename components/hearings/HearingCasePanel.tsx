import Link from "next/link";
import { X } from "lucide-react";
import type { Hearing } from "@/data/hearings";
import { formatHearingDateShort } from "@/data/hearings";
import type { UnifiedCase } from "@/data/unified-case";

export default function HearingCasePanel({
  hearing,
  caseData,
  open,
  onClose,
}: {
  hearing: Hearing;
  caseData?: UnifiedCase;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const parties = hearing.caseTitle.includes(" v. ")
    ? hearing.caseTitle.split(" v. ")
    : [hearing.caseTitle];

  return (
    <aside className="hearing-case-panel" aria-label="Case details">
      <header>
        <h2>Case Details</h2>
        <button type="button" aria-label="Close case details" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
      </header>
      <code>{hearing.caseNumber}</code>
      <p className="hearing-case-parties">
        {parties[0]}
        {parties[1] && (
          <>
            <br />
            <em>v.</em>
            <br />
            {parties[1]}
          </>
        )}
      </p>
      <dl>
        <div>
          <dt>Court</dt>
          <dd>
            {hearing.courtName}
            {hearing.courtNumber ? ` No. ${hearing.courtNumber}` : ""}
          </dd>
        </div>
        <div>
          <dt>Current Stage</dt>
          <dd>{hearing.proceduralStage ?? caseData?.stage.current ?? "—"}</dd>
        </div>
        <div>
          <dt>Purpose of Hearing</dt>
          <dd>{hearing.purpose ?? "—"}</dd>
        </div>
        <div>
          <dt>Previous Hearing</dt>
          <dd>{hearing.previousHearingDate ? formatHearingDateShort(hearing.previousHearingDate) : "Not recorded"}</dd>
        </div>
        <div>
          <dt>Current Hearing</dt>
          <dd>{formatHearingDateShort(hearing.hearingDate)}{hearing.hearingTime ? ` · ${hearing.hearingTime}` : ""}</dd>
        </div>
        <div>
          <dt>Next Hearing</dt>
          <dd>
            {hearing.nextHearingDate
              ? formatHearingDateShort(hearing.nextHearingDate)
              : caseData?.nextHearing.date
                ? formatHearingDateShort(caseData.nextHearing.date)
                : "Not yet assigned"}
          </dd>
        </div>
      </dl>
      <Link className="login" href={`/cases/${hearing.caseId}`}>
        Open Full Case
      </Link>
    </aside>
  );
}
