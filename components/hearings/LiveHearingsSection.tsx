import Link from "next/link";
import type { Hearing } from "@/data/hearings";
import type { Role } from "@/data/roles";
import { canJoinHearing } from "@/lib/hearing-access";
import HearingStatusBadge from "@/components/hearings/HearingStatusBadge";
import VirtualHearingBadge from "@/components/hearings/VirtualHearingBadge";

export default function LiveHearingsSection({
  hearings,
  role,
}: {
  hearings: Hearing[];
  role: Role | null;
}) {
  if (!hearings.length) {
    return (
      <section className="live-hearings-section is-empty" aria-label="Live hearings">
        <h2>Live Now</h2>
        <p>No hearings are live at present.</p>
      </section>
    );
  }

  return (
    <section className="live-hearings-section" aria-label="Live hearings">
      <h2>Live Now</h2>
      <div className="live-hearings-grid">
        {hearings.map((hearing) => {
          const canJoin = canJoinHearing(role, hearing);
          const restricted = hearing.access === "RESTRICTED" && !canJoin;
          return (
            <article className="live-hearing-hero" key={hearing.id}>
              <header>
                <HearingStatusBadge status={hearing.status} />
                <VirtualHearingBadge hearing={hearing} role={role} />
              </header>
              {hearing.courtNumber && <p className="hearing-court-line">Court No. {hearing.courtNumber}</p>}
              <code>{hearing.caseNumber}</code>
              <h3>
                {hearing.caseTitle.includes(" v. ")
                  ? hearing.caseTitle.split(" v. ").map((part, index, all) => (
                      <span key={`${part}-${index}`}>
                        {part}
                        {index < all.length - 1 && (
                          <>
                            <br />
                            <em>v.</em>
                            <br />
                          </>
                        )}
                      </span>
                    ))
                  : hearing.caseTitle}
              </h3>
              <p className="hearing-purpose">{hearing.purpose ?? hearing.proceduralStage}</p>
              {hearing.isDemo && <span className="demo-pill">Demo Hearing</span>}
              {restricted ? (
                <p className="hearing-restricted">Virtual proceeding restricted</p>
              ) : (
                <Link className="hearing-primary-action" href={`/hearings/${hearing.id}`}>
                  {role === "citizen" ? "Watch Live" : role === "judge" ? "Open Hearing" : "Watch Live Hearing"}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
