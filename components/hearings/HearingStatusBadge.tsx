import type { HearingStatus } from "@/data/hearings";

const labels: Record<HearingStatus, string> = {
  LIVE: "LIVE",
  UPCOMING: "Upcoming",
  WAITING: "Waiting",
  COMPLETED: "Completed",
  ADJOURNED: "Adjourned",
  CANCELLED: "Cancelled",
};

export default function HearingStatusBadge({ status }: { status: HearingStatus }) {
  const live = status === "LIVE";
  return (
    <span className={`hearing-status-badge status-${status.toLowerCase()}`} data-live={live || undefined}>
      {live && <i aria-hidden="true" />}
      {labels[status]}
    </span>
  );
}
