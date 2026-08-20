import type { Hearing } from "@/data/hearings";
import type { Role } from "@/data/roles";
import HearingCard from "@/components/hearings/HearingCard";

export default function HearingList({
  hearings,
  role,
  dense = false,
  empty,
  onJudgeAction,
}: {
  hearings: Hearing[];
  role: Role | null;
  dense?: boolean;
  empty?: string;
  onJudgeAction?: (hearing: Hearing, action: "start" | "resume" | "end" | "adjourn") => void;
}) {
  if (!hearings.length) {
    return <p className="calm-empty">{empty ?? "No hearings in this list."}</p>;
  }
  return (
    <div className={dense ? "hearing-list is-dense" : "hearing-list"}>
      {hearings.map((hearing) => (
        <HearingCard
          key={hearing.id}
          hearing={hearing}
          role={role}
          dense={dense}
          onJudgeAction={onJudgeAction}
        />
      ))}
    </div>
  );
}
