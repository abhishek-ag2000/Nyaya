"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";
import { countOpenPendingActions, getPendingActionsForRole, getUpcomingItemsForUser, getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";
import Link from "next/link";
import PendingActionsTable from "@/components/workspaces/PendingActionsTable";

const date = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(`${value}T00:00:00`));
const copy: Record<Role, { question: string; queue: string; detail: string }> = {
  citizen: { question: "What is happening with my case and what should I do next?", queue: "Needs your attention", detail: "Plain-language updates and the next practical step in your case journey." },
  advocate: { question: "What needs your attention across your matters today?", queue: "Urgent practice actions", detail: "Prioritise filings, deadlines, hearings, and documents across your local matters." },
  judge: { question: "What matters are before you and are their records ready?", queue: "Court readiness", detail: "Illustrative docket and record-readiness context. Decisions remain with the court." },
  registry: { question: "What filings and court operations need processing?", queue: "Registry work queue", detail: "filing, scrutiny, and copy-request workflow states for demonstration only." },
  stenographer: { question: "Which proceedings and drafts are assigned for review?", queue: "Proceedings needing review", detail: "Drafting support is illustrative; people review and finalise all records." },
  police: { question: "Which investigation-linked court actions require attention?", queue: "Linked matter attention", detail: "Only authorised-workflow context is shown on this site." }
};

export default function RoleWorkspace({ requiredRole }: { requiredRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role | null | undefined>(undefined);
  const [cases, setCases] = useState<UnifiedCase[]>([]);
  useEffect(() => {
    const refresh = () => {
      setRole(getMockRole());
      setCases(getUserCases());
    };
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    window.addEventListener("nyaya-demo-case-updated", refresh);
    return () => {
      window.removeEventListener("nyaya-mock-session", refresh);
      window.removeEventListener("nyaya-demo-case-updated", refresh);
    };
  }, []);
  useEffect(() => {
    if (role === undefined) return;
    if (!role) {
      router.replace("/login");
      return;
    }
    if (role !== requiredRole) router.replace(roleHome(role));
  }, [role, requiredRole, router]);
  if (role === undefined || role !== requiredRole) {
    return <main className="wrap workspace-loading">Loading workspace…</main>;
  }
  return <Workspace role={role} cases={cases} />;
}

function Workspace({ role, cases }: { role: Role; cases: UnifiedCase[] }) {
  const config = roleConfig[role], details = copy[role];
  const pending = getPendingActionsForRole(role, cases);
  const openPending = countOpenPendingActions(role, cases);
  const upcoming = getUpcomingItemsForUser(cases);
  return (
    <main className="wrap role-workspace">
      <div className="workspace-main">
        <header className="workspace-header">
          <p className="kicker">{config.workspace}</p>
          <h1>{config.workspace}</h1>
          {config.courtName ? <p className="workspace-court">{config.courtName}</p> : null}
          <p>{details.question}</p>
        </header>
        <section className="workspace-priorities">
          <Link href="/pending-actions">
            <span>{details.queue}</span>
            <b>
              {openPending} <small>illustrative items</small>
            </b>
            <p>{details.detail}</p>
          </Link>
          <div>
            <span>Upcoming activity</span>
            <b>
              {upcoming.length} <small>illustrative items</small>
            </b>
            <p>All dates and activity are bundled demo data.</p>
          </div>
          <div>
            <span>Matters in view</span>
            <b>
              {cases.length} <small>cases</small>
            </b>
            <p>One shared local case dataset, tailored by workspace.</p>
          </div>
        </section>
        <section className="workspace-action-grid" aria-label="Quick actions">
          {config.actions.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
              <span>→</span>
            </Link>
          ))}
        </section>
        <section className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <span>Pending actions</span>
              <h2>Status, deadlines, and document requests</h2>
            </div>
            <Link href="/pending-actions">View all pending actions →</Link>
          </div>
          <PendingActionsTable items={pending.slice(0, 6)} compact showRespond={role !== "citizen"} />
        </section>
        <section className="workspace-section">
          <div className="workspace-section-heading">
            <div>
              <span>Upcoming</span>
              <h2>{role === "judge" ? "Today’s docket" : role === "stenographer" ? "Today’s proceedings" : "Next activity"}</h2>
            </div>
            <Link href="/today">Open today’s matters →</Link>
          </div>
          <div className="workspace-activity-list">
            {upcoming.slice(0, 4).map((item) => (
              <Link href={item.href} key={item.id}>
                <time>{date(item.date)}</time>
                <div>
                  <b>{item.title}</b>
                  <p>
                    {item.type === "hearing" ? "Hearing" : "Action deadline"} · {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
