"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { advancePendingAction, getAllowedPendingTransitions, type PendingActionWorkflowStatus } from "@/data/demo-case-store";
import { getMockRole } from "@/data/mock-session";
import type { PendingActionItem, PendingActionKind } from "@/data/user-cases";

const date = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));

const kindLabels: Record<PendingActionKind, string> = {
  "case-action": "Case action",
  approval: "Pending approval",
  "order-pending": "Order awaited",
  "filing-review": "Filing review",
  "proceeding-review": "Proceeding",
  "linked-matter": "Linked matter",
};

const statusLabels: Record<PendingActionWorkflowStatus, string> = {
  requested: "Requested",
  issued: "Issued",
  assigned: "Assigned",
  attempted: "Attempted",
  served: "Served",
  failed: "Failed",
  approved: "Approved",
  disapproved: "Disapproved",
  "clarification-requested": "Clarification requested",
};

const SERVICE_STEPS: PendingActionWorkflowStatus[] = ["requested", "issued", "assigned", "attempted", "served"];

const ACTION_BUTTONS: Array<{ status: PendingActionWorkflowStatus; label: string }> = [
  { status: "approved", label: "Approve" },
  { status: "disapproved", label: "Disapprove" },
  { status: "clarification-requested", label: "Request clarification" },
  { status: "issued", label: "Issue" },
  { status: "assigned", label: "Assign" },
  { status: "attempted", label: "Mark attempted" },
  { status: "served", label: "Mark served" },
  { status: "failed", label: "Mark failed" },
  { status: "requested", label: "Return to request" },
];

function stepState(current: PendingActionWorkflowStatus, step: PendingActionWorkflowStatus) {
  if (current === "failed" && step === "served") return "branch";
  if (current === "failed") {
    const failedPath: PendingActionWorkflowStatus[] = ["requested", "issued", "assigned", "attempted"];
    return failedPath.includes(step) ? "done" : "todo";
  }
  if (current === "approved" || current === "disapproved" || current === "clarification-requested") {
    return step === "requested" ? "done" : "todo";
  }
  const index = SERVICE_STEPS.indexOf(step);
  const currentIndex = SERVICE_STEPS.indexOf(current);
  if (currentIndex < 0) return "todo";
  if (index < currentIndex) return "done";
  if (index === currentIndex) return "current";
  return "todo";
}

export default function PendingActionsTable({
  items,
  compact = false,
  showRespond = true,
}: {
  items: PendingActionItem[];
  compact?: boolean;
  showRespond?: boolean;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function respond(item: PendingActionItem, nextStatus: PendingActionWorkflowStatus) {
    const role = getMockRole();
    if (!role) return;
    advancePendingAction({
      itemId: item.id,
      caseId: item.caseId,
      sourceActionId: item.sourceActionId,
      nextStatus,
      role,
    });
  }

  if (!items.length) {
    return <p className="calm-empty">No pending actions are bundled for this workspace.</p>;
  }

  return (
    <div className={`filed-docs-wrap pending-actions-table${compact ? " is-compact" : ""}`}>
      <table className="filed-docs-table">
        <thead>
          <tr>
            <th scope="col">Case</th>
            <th scope="col">Action</th>
            <th scope="col">Document to review</th>
            <th scope="col">Deadline</th>
            <th scope="col">Status</th>
            {showRespond ? <th scope="col">Respond</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const allowed = getAllowedPendingTransitions(item.status);
            const open = expanded[item.id];
            return (
              <Fragment key={item.id}>
                <tr>
                  <th scope="row">
                    <Link href={item.href}>{item.caseTitle}</Link>
                    <code>{item.caseId}</code>
                  </th>
                  <td>
                    <span className="filing-status">{kindLabels[item.kind]}</span>
                    <p>{item.title}</p>
                  </td>
                  <td>
                    {item.documentHref ? (
                      <Link href={item.documentHref}>{item.documentTitle}</Link>
                    ) : (
                      item.documentTitle
                    )}
                  </td>
                  <td>{item.dueDate ? <time dateTime={item.dueDate}>{date(item.dueDate)}</time> : "—"}</td>
                  <td>
                    <span className="filing-status">{statusLabels[item.status]}</span>
                    <ol className="pending-workflow-steps" aria-label="Request to service workflow">
                      {SERVICE_STEPS.map((step) => (
                        <li className={stepState(item.status, step)} key={step}>
                          {statusLabels[step]}
                        </li>
                      ))}
                      {item.status === "failed" ? <li className="branch">Failed</li> : null}
                      {item.status === "approved" || item.status === "disapproved" || item.status === "clarification-requested" ? (
                        <li className="current">{statusLabels[item.status]}</li>
                      ) : null}
                    </ol>
                    <button
                      type="button"
                      className="pending-audit-toggle"
                      aria-expanded={open}
                      onClick={() => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] }))}
                    >
                      {open ? "Hide audit trail" : "Show audit trail"}
                    </button>
                  </td>
                  {showRespond ? (
                    <td>
                      {allowed.length ? (
                        <div className="pending-action-buttons">
                          {ACTION_BUTTONS.filter((button) => allowed.includes(button.status)).map((button) => (
                            <button key={button.status} type="button" onClick={() => respond(item, button.status)}>
                              {button.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="filing-status">Closed</span>
                      )}
                    </td>
                  ) : null}
                </tr>
                {open ? (
                  <tr className="pending-audit-row">
                    <td colSpan={showRespond ? 6 : 5}>
                      <div className="pending-audit-trail">
                        <b>Audit trail</b>
                        <ol>
                          {item.auditTrail.map((entry, index) => (
                            <li key={`${entry.at}-${entry.status}-${index}`}>
                              <time dateTime={entry.at}>{date(entry.at)}</time>
                              <span className="filing-status">{statusLabels[entry.status]}</span>
                              <em>{entry.byRole}</em>
                              <span>{entry.label}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
