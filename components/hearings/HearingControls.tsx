"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LogOut, MicOff, Users } from "lucide-react";
import type { Hearing } from "@/data/hearings";
import { setHearingLocalStatus } from "@/data/hearings";
import type { Role } from "@/data/roles";

export default function HearingControls({
  hearing,
  role,
  onOpenParticipants,
  onOpenCase,
}: {
  hearing: Hearing;
  role: Role | null;
  onOpenParticipants: () => void;
  onOpenCase: () => void;
}) {
  const router = useRouter();
  const leave = () => router.push("/hearings");

  return (
    <nav className="hearing-controls" aria-label="Hearing controls">
      {(role === "citizen" || role === "advocate" || !role) && (
        <button type="button" disabled title="Microphone is not used in this demo">
          <MicOff aria-hidden="true" /> Mute
        </button>
      )}
      <button type="button" onClick={onOpenParticipants}>
        <Users aria-hidden="true" /> Participants
      </button>
      <button type="button" onClick={onOpenCase}>
        <FileText aria-hidden="true" /> Case Details
      </button>
      {role === "advocate" && (
        <Link href={`/cases/${hearing.caseId}?tab=Filed+documents`}>
          <FileText aria-hidden="true" /> Case Documents
        </Link>
      )}
      {role === "judge" && (
        <>
          <button
            type="button"
            onClick={() => {
              setHearingLocalStatus(hearing.id, "COMPLETED");
              router.push("/hearings");
            }}
          >
            End Hearing
          </button>
          <Link href="/hearings">Next Matter</Link>
        </>
      )}
      <button type="button" className="hearing-leave" onClick={leave}>
        <LogOut aria-hidden="true" /> Leave
      </button>
    </nav>
  );
}
