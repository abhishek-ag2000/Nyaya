"use client";

import { useEffect, useMemo, useState } from "react";
import type { Hearing } from "@/data/hearings";
import { getHearingById } from "@/data/hearings";
import { getMockRole } from "@/data/mock-session";
import type { Role } from "@/data/roles";
import { getUnifiedCase } from "@/data/unified-case";
import { readOnlyDemoCases } from "@/data/user-cases";
import { canJoinHearing, getHearingExperience } from "@/lib/hearing-access";
import { BackLink } from "@/components/BackLink";
import HearingCasePanel from "@/components/hearings/HearingCasePanel";
import HearingControls from "@/components/hearings/HearingControls";
import HearingHeader from "@/components/hearings/HearingHeader";
import HearingVideo from "@/components/hearings/HearingVideo";
import ParticipantPanel from "@/components/hearings/ParticipantPanel";

export default function HearingRoom({ hearing: initialHearing }: { hearing: Hearing }) {
  const [role, setRole] = useState<Role | null>(null);
  const [hearing, setHearing] = useState(initialHearing);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showCase, setShowCase] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setRole(getMockRole());
      setHearing(getHearingById(initialHearing.id) ?? initialHearing);
    };
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    window.addEventListener("nyaya-hearing-updated", refresh);
    return () => {
      window.removeEventListener("nyaya-mock-session", refresh);
      window.removeEventListener("nyaya-hearing-updated", refresh);
    };
  }, [initialHearing]);

  const experience = useMemo(() => getHearingExperience(hearing), [hearing]);
  const canJoin = canJoinHearing(role, hearing);
  const caseData =
    getUnifiedCase(hearing.caseId) ??
    readOnlyDemoCases.find((item) => item.id.toLowerCase() === hearing.caseId.toLowerCase());

  return (
    <main className="hearing-room">
      <div className="hearing-room-top">
        <BackLink href="/hearings">Hearings</BackLink>
        <HearingHeader hearing={hearing} />
      </div>
      <div className={`hearing-room-body${showParticipants || showCase ? " has-side" : ""}`}>
        <div className="hearing-room-main">
          <HearingVideo hearing={hearing} experience={experience} canJoin={canJoin} />
          <HearingControls
            hearing={hearing}
            role={role}
            onOpenParticipants={() => {
              setShowParticipants(true);
              setShowCase(false);
            }}
            onOpenCase={() => {
              setShowCase(true);
              setShowParticipants(false);
            }}
          />
        </div>
        {(showParticipants || showCase) && (
          <aside className="hearing-room-side">
            {showParticipants && !showCase && <ParticipantPanel hearing={hearing} />}
            <HearingCasePanel
              hearing={hearing}
              caseData={caseData}
              open={showCase}
              onClose={() => setShowCase(false)}
            />
            {showParticipants && !showCase && (
              <button type="button" className="hearing-side-close" onClick={() => setShowParticipants(false)}>
                Hide panel
              </button>
            )}
          </aside>
        )}
      </div>
    </main>
  );
}
