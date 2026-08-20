import type { Hearing, HearingMode } from "@/data/hearings";
import { canJoinHearing, isVirtualCapable } from "@/lib/hearing-access";
import type { Role } from "@/data/roles";

const modeLabel: Record<HearingMode, string> = {
  PHYSICAL: "Physical Court",
  VIRTUAL: "Virtual Hearing",
  HYBRID: "Hybrid Hearing",
};

export default function VirtualHearingBadge({
  hearing,
  role,
  compact = false,
}: {
  hearing: Hearing;
  role?: Role | null;
  compact?: boolean;
}) {
  const restricted = hearing.access === "RESTRICTED" && !canJoinHearing(role ?? null, hearing);
  if (restricted && isVirtualCapable(hearing)) {
    return <span className="virtual-hearing-badge is-restricted">Virtual proceeding restricted</span>;
  }
  if (!compact && isVirtualCapable(hearing) && hearing.status !== "LIVE" && canJoinHearing(role ?? null, hearing)) {
    return <span className="virtual-hearing-badge is-available">Virtual Hearing Available</span>;
  }
  return (
    <span className={`virtual-hearing-badge mode-${hearing.mode.toLowerCase()}`}>
      {modeLabel[hearing.mode]}
    </span>
  );
}
