import type { Hearing } from "@/data/hearings";
import { getJudgeDemoCourtNumber, groupHearingsByStatus } from "@/data/hearings";
import type { Role } from "@/data/roles";

export default function HearingSummary({
  hearings,
  role,
}: {
  hearings: Hearing[];
  role: Role | null;
}) {
  const groups = groupHearingsByStatus(hearings);
  const remaining = groups.upcoming.length + groups.adjourned.length;

  if (role === "judge") {
    return (
      <section className="hearing-summary judge-summary" aria-label="Court board summary">
        <div>
          <span>Court No. {getJudgeDemoCourtNumber()}</span>
          <b>Presiding Judge</b>
          <p>{hearings.length} Listed Matters</p>
        </div>
        <div>
          <span>Completed</span>
          <b>{groups.completed.length}</b>
        </div>
        <div>
          <span>In Progress</span>
          <b>{groups.live.length}</b>
        </div>
        <div>
          <span>Remaining</span>
          <b>{remaining}</b>
        </div>
      </section>
    );
  }

  if (role === "advocate" || role === "registry" || role === "stenographer" || role === "police") {
    return (
      <section className="hearing-summary advocate-summary" aria-label="Today’s board summary">
        <div>
          <span>Today’s Matters</span>
          <b>{hearings.length}</b>
        </div>
        <div>
          <span>Live Now</span>
          <b>{groups.live.length}</b>
        </div>
        <div>
          <span>Upcoming</span>
          <b>{groups.upcoming.length}</b>
        </div>
        <div>
          <span>Completed</span>
          <b>{groups.completed.length}</b>
        </div>
      </section>
    );
  }

  return (
    <section className="hearing-summary citizen-summary" aria-label="Hearing summary">
      <div>
        <span>Listed today</span>
        <b>{hearings.length}</b>
      </div>
      <div>
        <span>Live</span>
        <b>{groups.live.length}</b>
      </div>
      <div>
        <span>Upcoming</span>
        <b>{groups.upcoming.length}</b>
      </div>
    </section>
  );
}
