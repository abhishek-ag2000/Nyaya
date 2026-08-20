import type { Hearing } from "@/data/hearings";
import HearingStatusBadge from "@/components/hearings/HearingStatusBadge";

export default function HearingHeader({ hearing }: { hearing: Hearing }) {
  return (
    <header className="hearing-room-header">
      <div>
        <p className="hearing-room-court">
          {hearing.courtName}
          {hearing.courtNumber ? ` — Court No. ${hearing.courtNumber}` : ""}
        </p>
        <code>{hearing.caseNumber}</code>
        <h1>{hearing.caseTitle}</h1>
        {hearing.itemNumber != null && <p className="hearing-item">Item No. {hearing.itemNumber}</p>}
        <p className="hearing-purpose-line">Purpose: {hearing.purpose ?? hearing.proceduralStage ?? "Listed matter"}</p>
      </div>
      <div className="hearing-room-status">
        <HearingStatusBadge status={hearing.status} />
        {hearing.isDemo && <span className="demo-pill">Demo Hearing</span>}
      </div>
    </header>
  );
}
