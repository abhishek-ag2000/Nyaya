"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UnifiedCaseWorkspace from "@/components/cases/UnifiedCaseWorkspace";
import { loadCaseRecord } from "@/data/demo-case-store";
import type { UnifiedCase } from "@/data/unified-case";

export default function CaseWorkspaceLoader({ caseId, initialCase }: { caseId: string; initialCase?: UnifiedCase }) {
  const [caseData, setCaseData] = useState<UnifiedCase | undefined>(initialCase);
  const [ready, setReady] = useState(Boolean(initialCase));

  useEffect(() => {
    setCaseData(loadCaseRecord(caseId, initialCase));
    setReady(true);
  }, [caseId, initialCase]);

  if (!ready) return <main className="wrap workspace-loading">Loading the case workspace…</main>;
  if (!caseData) return <main className="wrap static-page"><p className="kicker">Unified demo case</p><h1>This page opens one shared case workspace.</h1><p>No local case was found for this identifier. Bundled demo cases and filings created in this browser remain available.</p><Link className="outline-cta" href="/cases/NYA-WB-DEMO-04821">Open unified case →</Link></main>;
  return <UnifiedCaseWorkspace caseData={caseData} />;
}
