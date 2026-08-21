"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isActiveWorkflowStatus } from "@/data/demo-case-store";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
import { getPendingActionsForRole, getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";
import PendingActionsTable from "@/components/workspaces/PendingActionsTable";

const intro: Record<Role, string> = {
  citizen: "Document requests and filings waiting for approval across the cases you are following, with a request → approval → service audit trail.",
  advocate: "Practice document requests that still need attention, with deadlines, status, and an audit trail.",
  judge: "Order-awaited matters and open document actions from the shared case set, with workflow status.",
  registry: "Filings under review and document requests in the registry service workflow.",
  stenographer: "Assigned proceedings and document actions for drafting review, with status and deadlines.",
  police: "Investigation-linked document requests and authorised service status across linked matters.",
};

export default function PendingActions() {
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
    if (role === null) router.replace("/login");
  }, [role, router]);

  const items = useMemo(() => (role ? getPendingActionsForRole(role, cases) : []), [cases, role]);
  const activeCount = items.filter((item) => isActiveWorkflowStatus(item.status)).length;

  if (role === undefined || !role) return <main className="wrap workspace-loading">Loading pending actions…</main>;

  const config = roleConfig[role];
  return (
    <main className="wrap operations-page pending-actions">
      <p className="kicker">{config.workspace} · pending actions</p>
      <h1>Pending Actions</h1>
      <p>{intro[role]}</p>
      <p className="quiet-summary">
        {activeCount} active · {items.length} total · demo document-request / service workflow with audit trail
      </p>
      <PendingActionsTable items={items} showRespond={role !== "citizen"} />
    </main>
  );
}
