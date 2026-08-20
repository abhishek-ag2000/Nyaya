"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";
import { getOpenActionsForUser, getUpcomingItemsForUser, getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";
import Link from "next/link";

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
  const actions = getOpenActionsForUser(cases), upcoming = getUpcomingItemsForUser(cases);
  const queue = role === "judge" ? cases.filter((item) => item.stage.current !== "Decision") : role === "registry" ? cases.filter((item) => item.filings.some((filing) => filing.status === "Needs Attention" || filing.status === "Under Review")) : role === "stenographer" ? cases.slice(0, 2) : role === "police" ? cases.filter((item) => item.caseCategory.toLowerCase().includes("criminal")) : cases;
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
          <div>
            <span>{details.queue}</span>
            <b>
              {actions.length} <small>illustrative items</small>
            </b>
            <p>{details.detail}</p>
          </div>
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
              <span>{role === "citizen" ? "My cases" : details.queue}</span>
              <h2>
                {role === "judge"
                  ? "Today’s court context"
                  : role === "registry"
                    ? "Filing and scrutiny context"
                    : role === "stenographer"
                      ? "Assigned proceedings"
                      : role === "police"
                        ? "Investigation-linked matters"
                        : role === "citizen"
                          ? "Your cases"
                          : "What needs attention"}
              </h2>
            </div>
            {role !== "citizen" && <Link href="/my-cases">View all cases →</Link>}
          </div>
          {role === "citizen" ? (
            <CaseRows cases={cases} role={role} />
          ) : role === "advocate" && actions.length ? (
            <div className="workspace-attention-list">
              {actions.slice(0, 3).map(({ caseData, ...action }) => (
                <Link href={`/cases/${caseData.id}`} key={action.id}>
                  <div>
                    <b>{caseData.shortTitle}</b>
                    <p>{action.title}</p>
                  </div>
                  <span>{action.dueDate ? `By ${date(action.dueDate)}` : "Review"} →</span>
                </Link>
              ))}
            </div>
          ) : (
            <CaseRows cases={queue.slice(0, 3)} role={role} />
          )}
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

function CaseRows({ cases, role }: { cases: UnifiedCase[]; role: Role }) {
  return (
    <div className="workspace-attention-list">
      {cases.length ? (
        cases.map((item) => (
          <Link href={`/cases/${item.id}`} key={item.id}>
            <div>
              <b>{item.shortTitle}</b>
              <p>
                {role === "registry"
                  ? `${item.filings.length} filing${item.filings.length === 1 ? "" : "s"} · ${item.stage.current}`
                  : `${item.caseType} · ${item.stage.current}`}
              </p>
            </div>
            <span>{date(item.nextHearing.date)} →</span>
          </Link>
        ))
      ) : (
        <p className="calm-empty">No local queue entries are bundled for this view.</p>
      )}
    </div>
  );
}
