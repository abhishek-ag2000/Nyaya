import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import type { UnifiedCase } from "@/data/unified-case";

export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export function CaseStatusBadge({ label }: { label: string }) {
  return <span className="filing-status">{label}</span>;
}

export function IdentityVerifiedBadge() {
  return <span className="identity-verified"><BadgeCheck aria-hidden="true" /> Identity Verified</span>;
}

export function ProfileChips({ items, label }: { items: string[]; label: string }) {
  return <ul className="profile-chips" aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export type LinkedCaseItem = {
  id: string;
  title: string;
  caseType: string;
  status: string;
  nextHearing: string;
  role?: string;
};

export function toLinkedCaseItems(caseIds: string[], cases: UnifiedCase[], roles?: Record<string, string>): LinkedCaseItem[] {
  return caseIds.flatMap((id) => {
    const match = cases.find((item) => item.id === id);
    if (!match) return [];
    return [{
      id: match.id,
      title: match.title,
      caseType: match.caseType,
      status: match.status.label,
      nextHearing: match.nextHearing.date,
      role: roles?.[match.id]
    }];
  }).sort((a, b) => a.nextHearing.localeCompare(b.nextHearing) || a.title.localeCompare(b.title));
}

export function LinkedCasesList({ items, empty, roleLabel }: { items: LinkedCaseItem[]; empty: string; roleLabel?: boolean }) {
  if (!items.length) return <p className="empty-state">{empty}</p>;
  return <div className="linked-case-list">{items.map((item) => <Link className="linked-case-card" href={`/cases/${item.id}`} key={item.id}>
    <div>
      {roleLabel && item.role && <span className="counsel-role">{item.role}</span>}
      <b>{item.title}</b>
      <p><code>{item.id}</code> · {item.caseType}</p>
    </div>
    <div className="linked-case-meta">
      <CaseStatusBadge label={item.status} />
      <time dateTime={item.nextHearing}>Next hearing {dateLabel(item.nextHearing)}</time>
      <span>Open case →</span>
    </div>
  </Link>)}</div>;
}
