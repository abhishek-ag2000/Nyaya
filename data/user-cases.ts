import { getPendingActionWorkflow, getPendingActionWorkflows, getRecentCaseEvents, isActiveWorkflowStatus, listFiledCases, loadDemoCase, normalizeWorkflowStatus, type PendingActionAuditEntry, type PendingActionWorkflowStatus } from "@/data/demo-case-store";
import type { Role } from "@/data/roles";
import { demoUnifiedCase, type CaseAction, type CaseEvent, type UnifiedCase } from "@/data/unified-case";

export type PendingActionKind = "case-action" | "approval" | "order-pending" | "filing-review" | "proceeding-review" | "linked-matter";
export type PendingActionItem = {
  id: string;
  kind: PendingActionKind;
  title: string;
  description: string;
  caseId: string;
  caseTitle: string;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  href: string;
  documentTitle: string;
  documentHref?: string;
  relatedDocumentId?: string;
  status: PendingActionWorkflowStatus;
  auditTrail: PendingActionAuditEntry[];
  sourceActionId?: string;
};

const event = (caseId: string, date: string, title: string, type: CaseEvent["type"] = "status-changed"): CaseEvent => ({ id: `event-${caseId}`, caseId, type, occurredAt: date, title, description: "A case update.", plainLanguage: "This is a case update for Nyaya.", source: { type: "case" }, visibility: "case-users" });
function seedDocuments(caseId: string, stage: string): Pick<UnifiedCase, "documents" | "orders" | "filings"> {
  const filingId = `filing-${caseId}`;
  const applicationId = `doc-app-${caseId}`;
  const orderId = `doc-order-${caseId}`;
  const showOrder = stage === "Order Reserved" || stage === "Arguments" || stage === "Evidence" || stage === "Hearing";
  const documents = [
    {
      id: applicationId,
      caseId,
      title: "Application on record",
      date: "2026-08-02",
      category: "Filing" as const,
      pages: 6,
      addedBy: "Petitioner Counsel",
      source: "filing" as const,
      processing: { status: "processed" as const, classification: "Application" },
      extractedText: "Extract: This demonstration filing has been accepted into the case record for procedural review.",
    },
    ...(showOrder
      ? [{
          id: orderId,
          caseId,
          title: "Order dated 12 August 2026",
          date: "2026-08-12",
          category: "Order" as const,
          pages: 4,
          addedBy: "Court record",
          source: "court" as const,
          processing: { status: "processed" as const, classification: "Court Order" },
          extractedText: "Extract: The matter is listed for a procedural hearing at the scheduled time shown in this case workspace.",
        }]
      : []),
  ];
  return {
    documents,
    orders: showOrder ? [orderId] : [],
    filings: [{
      id: filingId,
      title: "Application on record",
      filingType: "Application",
      date: "2026-08-02",
      filedBy: "Petitioner",
      status: "Accepted",
      statusDescription: "Recorded as accepted in the registry flow. This is not court or authority approval.",
      statusUpdatedAt: "2026-08-03",
      documentIds: [applicationId],
      detail: "An application accepted into the registry review flow.",
    }],
  };
}
const makeCase = (id: string, title: string, caseType: string, stage: string, date: string, court: string, establishment: string, recentTitle: string, action?: CaseAction, context: { state: string; district: string; judge: string } = { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" }): UnifiedCase => ({
  id, demo: true, title, shortTitle: title, caseType, caseCategory: caseType, court: { name: `${court}`, establishment, state: context.state, district: context.district, courtroom: "Court 2", judge: context.judge },
  status: { label: stage === "Order Reserved" ? "Order Reserved" : "Hearing Scheduled", code: "demo", plainLanguage: "This matter is shown for dashboard demonstration only.", updatedAt: "2026-08-19" },
  stage: { current: stage, completedStages: ["Filed", "Scrutiny", "Registered"], upcomingStages: ["Decision"] }, nextHearing: { date, time: "11:00 AM", purpose: stage === "Order Reserved" ? "Order awaited" : "Listed hearing", mode: "physical" },
  parties: { petitioners: ["Demo Petitioner"], respondents: ["Demo Respondent"] }, advocates: { petitioner: ["Advocate Demo"], respondent: ["Counsel Demo"] },
  notifications: [], actionsRequired: action ? [action] : [], events: [event(id, "2026-08-19", recentTitle)],
  ...seedDocuments(id, stage),
});

export const readOnlyDemoCases: UnifiedCase[] = [
  makeCase("NYA-DEMO-CIV-02031", "Mehta Properties v. Arun Das", "Civil Suit", "Evidence", "2026-08-28", "Civil Court, Siliguri", "Siliguri Court Complex", "Evidence hearing listed"),
  makeCase("NYA-DEMO-EXE-00714", "Demo Finance Ltd. v. R. Sen", "Execution Proceeding", "Execution Petition Filed", "2026-08-27", "District Court, Kolkata", "Kolkata Court Complex", "Certified copy review requested", { id: "action-certified-copy", title: "Review certified-copy requirement", description: "A procedural item needs review before the next listing.", status: "open", priority: "medium", dueDate: "2026-08-25", relatedDocumentId: "doc-app-NYA-DEMO-EXE-00714", relatedFilingId: "filing-NYA-DEMO-EXE-00714" }, { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-04" }),
  makeCase("NYA-DEMO-CRM-00109", "State v. Demo Accused", "Criminal Matter", "Arguments", "2026-09-02", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Arguments hearing confirmed"),
  makeCase("NYA-DEMO-ARB-00386", "Eastern Demo Traders v. Northline Demo Pvt. Ltd.", "Arbitration Application", "Order Reserved", "2026-09-05", "Commercial Court, Kolkata", "Kolkata Court Complex", "Order awaited", undefined, { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-04" }),
  makeCase("NYA-DL-DEMO-01982", "Kapoor Demo Services v. Metro Demo Works", "Civil Appeal", "Arguments", "2026-09-08", "District & Sessions Court, Central Delhi", "Tees Hazari Courts", "Arguments hearing listed", undefined, { state: "Delhi", district: "Central Delhi", judge: "Presiding Judge Demo-05" }),
  makeCase("NYA-KA-DEMO-01247", "State v. Demo Applicant", "Bail Matter", "Hearing", "2026-09-10", "Bengaluru Rural District & Sessions Court", "Bengaluru Rural District & Sessions Court", "Bail hearing listed", undefined, { state: "Karnataka", district: "Bengaluru Rural", judge: "Presiding Judge Demo-06" }),
  makeCase("NYA-MH-DEMO-03318", "Demo Estates v. Kulkarni Demo", "Property Suit", "Evidence", "2026-09-12", "Nashik District & Sessions Court", "Nashik District & Sessions Court", "Evidence hearing listed", undefined, { state: "Maharashtra", district: "Nashik", judge: "Presiding Judge Demo-07" }),
  makeCase("NYA-DEMO-BAIL-01122", "State v. Demo Bail Applicant", "Bail Application", "Hearing", "2026-08-21", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Bail application listed"),
  makeCase("NYA-DEMO-MISC-00612", "In re Demo Miscellaneous", "Miscellaneous Application", "Hearing", "2026-08-22", "District & Sessions Court, Darjeeling", "Darjeeling Court Complex", "Miscellaneous application listed"),
  makeCase("NYA-DEMO-FAM-00451", "Demo Petitioner v. Demo Respondent", "Family Petition", "Evidence", "2026-08-25", "Civil Court, Siliguri", "Siliguri Court Complex", "Family petition listed for evidence"),
  makeCase("NYA-WB-DEMO-05510", "State v. Demo Revisionist", "Criminal Revision", "Arguments", "2026-09-01", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Criminal revision listed for arguments"),
  makeCase("NYA-DEMO-COM-00890", "Harbor Demo Ltd. v. Delta Demo LLP", "Commercial Suit", "Hearing", "2026-09-04", "Commercial Court, Kolkata", "Kolkata Court Complex", "Commercial suit listed", undefined, { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-08" }),
  makeCase("NYA-DEMO-APL-00940", "Banerjee Demo v. Municipal Demo Board", "Civil Appeal", "Arguments", "2026-09-07", "District Court, Kolkata", "Kolkata Court Complex", "Civil appeal listed for arguments", undefined, { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" })
];

/** Resolve any bundled demo case for public case/document routes (no sign-in required). */
export function resolveBundledCase(id: string): UnifiedCase | undefined {
  const key = decodeURIComponent(id).toLowerCase();
  if (demoUnifiedCase.id.toLowerCase() === key) return demoUnifiedCase;
  return readOnlyDemoCases.find((item) => item.id.toLowerCase() === key);
}

export function getUserCases(): UnifiedCase[] { return [loadDemoCase(demoUnifiedCase.id), ...readOnlyDemoCases, ...listFiledCases().filter((item) => item.id !== demoUnifiedCase.id && !readOnlyDemoCases.some((demo) => demo.id === item.id))]; }
export function isPendingApproval(caseData: UnifiedCase) {
  return caseData.status.code === "pending-approval" || caseData.status.code === "presented" || caseData.id.startsWith("NYA-FILE-");
}
export function getOpenActionsForUser(cases = getUserCases()) {
  return cases
    .flatMap((caseData) =>
      caseData.actionsRequired
        .filter((action) => isActiveWorkflowStatus(normalizeWorkflowStatus(action.status)))
        .map((action) => ({ ...action, caseData }))
    )
    .sort(
      (a, b) =>
        ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority] ||
        (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
    );
}

function withWorkflow(item: Omit<PendingActionItem, "status" | "auditTrail"> & { status?: PendingActionWorkflowStatus; auditTrail?: PendingActionAuditEntry[] }): PendingActionItem {
  const workflow = getPendingActionWorkflow(item.id);
  return {
    ...item,
    status: workflow.status,
    auditTrail: workflow.auditTrail,
  };
}

function documentHref(caseId: string, documentId: string) {
  return `/cases/${caseId}/documents/${documentId}`;
}

function caseActionHref(caseId: string, action: CaseAction) {
  if (action.relatedDocumentId) return documentHref(caseId, action.relatedDocumentId);
  if (action.relatedFilingId) return `/cases/${caseId}?tab=Filed+documents`;
  return `/cases/${caseId}`;
}

function latestDocument(caseData: UnifiedCase) {
  return [...(caseData.documents ?? [])].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))[0];
}

function resolveCaseActionDocument(caseData: UnifiedCase, action: CaseAction): { documentTitle: string; documentHref?: string; relatedDocumentId?: string } {
  if (action.relatedDocumentId) {
    const document = caseData.documents.find((item) => item.id === action.relatedDocumentId);
    return {
      documentTitle: document?.title ?? "Case document",
      documentHref: documentHref(caseData.id, action.relatedDocumentId),
      relatedDocumentId: action.relatedDocumentId,
    };
  }
  if (action.relatedFilingId) {
    const filing = caseData.filings.find((item) => item.id === action.relatedFilingId);
    const docId = filing?.documentIds?.[0];
    if (docId) {
      const document = caseData.documents.find((item) => item.id === docId);
      return {
        documentTitle: document?.title ?? filing?.title ?? "Filing on record",
        documentHref: documentHref(caseData.id, docId),
        relatedDocumentId: docId,
      };
    }
    return { documentTitle: filing?.title ?? "Filing on record" };
  }
  return { documentTitle: "Case record" };
}

function resolveApprovalDocument(caseData: UnifiedCase): { documentTitle: string; documentHref?: string; relatedDocumentId?: string } {
  const filing = caseData.filings[0];
  const docId = filing?.documentIds?.[0] ?? caseData.documents[0]?.id;
  if (docId) {
    const document = caseData.documents.find((item) => item.id === docId);
    return {
      documentTitle: document?.title ?? filing?.title ?? "Fresh filing",
      documentHref: documentHref(caseData.id, docId),
      relatedDocumentId: docId,
    };
  }
  return { documentTitle: filing?.title ?? caseData.documents[0]?.title ?? "Fresh filing" };
}

function resolveOrderDocument(caseData: UnifiedCase): { documentTitle: string; documentHref?: string; relatedDocumentId?: string } {
  const orderId = caseData.orders?.[0];
  const orderDoc = orderId
    ? caseData.documents.find((item) => item.id === orderId)
    : caseData.documents.find((item) => item.category === "Order");
  if (orderDoc) {
    return {
      documentTitle: orderDoc.title,
      documentHref: documentHref(caseData.id, orderDoc.id),
      relatedDocumentId: orderDoc.id,
    };
  }
  return { documentTitle: "Order on record" };
}

function resolveFilingDocument(caseData: UnifiedCase, filing: UnifiedCase["filings"][number]): { documentTitle: string; documentHref?: string; relatedDocumentId?: string } {
  const docId = filing.documentIds?.[0];
  if (docId) {
    const document = caseData.documents.find((item) => item.id === docId);
    return {
      documentTitle: document?.title ?? filing.title,
      documentHref: documentHref(caseData.id, docId),
      relatedDocumentId: docId,
    };
  }
  return { documentTitle: filing.title };
}

function resolveLatestDocument(caseData: UnifiedCase, fallback: string): { documentTitle: string; documentHref?: string; relatedDocumentId?: string } {
  const document = latestDocument(caseData);
  if (!document) return { documentTitle: fallback };
  return {
    documentTitle: document.title,
    documentHref: documentHref(caseData.id, document.id),
    relatedDocumentId: document.id,
  };
}

export function getPendingActionsForRole(role: Role, cases = getUserCases()): PendingActionItem[] {
  const priorityRank = { high: 0, medium: 1, low: 2 } as const;
  const storedWorkflows = getPendingActionWorkflows();
  const items: PendingActionItem[] = cases.flatMap((caseData) =>
    caseData.actionsRequired
      .filter((action) => {
        const normalized = normalizeWorkflowStatus(action.status);
        return isActiveWorkflowStatus(normalized) || Boolean(storedWorkflows[`case-action-${action.id}`]);
      })
      .map((action) => {
        const document = resolveCaseActionDocument(caseData, action);
        return withWorkflow({
          id: `case-action-${action.id}`,
          kind: "case-action",
          title: action.title,
          description: action.description,
          caseId: caseData.id,
          caseTitle: caseData.shortTitle,
          dueDate: action.dueDate,
          priority: action.priority,
          href: caseActionHref(caseData.id, action),
          sourceActionId: action.id,
          ...document,
        });
      })
  );

  if (role === "citizen") {
    for (const caseData of cases.filter(isPendingApproval)) {
      const document = resolveApprovalDocument(caseData);
      items.push(withWorkflow({
        id: `approval-${caseData.id}`,
        kind: "approval",
        title: "Pending for approval",
        description: "This filing is waiting for local registry acceptance.",
        caseId: caseData.id,
        caseTitle: caseData.shortTitle,
        dueDate: caseData.status.updatedAt || caseData.nextHearing.date,
        priority: "medium",
        href: document.documentHref ?? `/cases/${caseData.id}`,
        ...document,
      }));
    }
  }

  if (role === "judge") {
    for (const caseData of cases.filter((item) => item.stage.current === "Order Reserved")) {
      const document = resolveOrderDocument(caseData);
      items.push(withWorkflow({
        id: `order-pending-${caseData.id}`,
        kind: "order-pending",
        title: "Order awaited",
        description: `${caseData.caseType} · ${caseData.court.name}`,
        caseId: caseData.id,
        caseTitle: caseData.shortTitle,
        dueDate: caseData.nextHearing.date,
        priority: "medium",
        href: document.documentHref ?? `/cases/${caseData.id}`,
        ...document,
      }));
    }
  }

  if (role === "registry") {
    for (const caseData of cases) {
      for (const filing of caseData.filings.filter((item) => item.status === "Needs Attention" || item.status === "Under Review")) {
        const document = resolveFilingDocument(caseData, filing);
        items.push(withWorkflow({
          id: `filing-review-${filing.id}`,
          kind: "filing-review",
          title: filing.title,
          description: `${filing.status} · ${filing.filingType}`,
          caseId: caseData.id,
          caseTitle: caseData.shortTitle,
          dueDate: filing.date,
          priority: filing.status === "Needs Attention" ? "high" : "medium",
          href: document.documentHref ?? `/cases/${caseData.id}?tab=Filed+documents`,
          ...document,
        }));
      }
    }
  }

  if (role === "stenographer") {
    for (const caseData of cases.slice(0, 2)) {
      const document = resolveLatestDocument(caseData, "Proceeding draft");
      items.push(withWorkflow({
        id: `proceeding-review-${caseData.id}`,
        kind: "proceeding-review",
        title: "Proceeding draft needs review",
        description: `${caseData.caseType} · ${caseData.stage.current}`,
        caseId: caseData.id,
        caseTitle: caseData.shortTitle,
        dueDate: caseData.nextHearing.date,
        priority: "medium",
        href: document.documentHref ?? `/cases/${caseData.id}`,
        ...document,
      }));
    }
  }

  if (role === "police") {
    for (const caseData of cases.filter((item) => item.caseCategory.toLowerCase().includes("criminal"))) {
      const document = resolveLatestDocument(caseData, "Authorized case record");
      items.push(withWorkflow({
        id: `linked-matter-${caseData.id}`,
        kind: "linked-matter",
        title: "Investigation-linked matter",
        description: `${caseData.caseType} · next listing ${caseData.nextHearing.date}`,
        caseId: caseData.id,
        caseTitle: caseData.shortTitle,
        dueDate: caseData.nextHearing.date,
        priority: "medium",
        href: document.documentHref ?? `/cases/${caseData.id}`,
        ...document,
      }));
    }
  }

  const deduped = Array.from(new Map(items.map((item) => [item.id, item])).values());
  return deduped.sort((a, b) => {
    const aActive = isActiveWorkflowStatus(a.status) ? 0 : 1;
    const bActive = isActiveWorkflowStatus(b.status) ? 0 : 1;
    return aActive - bActive || priorityRank[a.priority] - priorityRank[b.priority] || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
  });
}

export function countOpenPendingActions(role: Role, cases = getUserCases()) {
  return getPendingActionsForRole(role, cases).filter((item) => isActiveWorkflowStatus(item.status)).length;
}

export function getUpcomingItemsForUser(cases = getUserCases()) {
  return cases
    .flatMap((caseData) => [
      {
        id: `hearing-${caseData.id}`,
        type: "hearing" as const,
        date: caseData.nextHearing.date,
        caseId: caseData.id,
        title: caseData.title,
        subtitle: `${caseData.nextHearing.time} · ${caseData.court.courtroom} · ${caseData.court.name}`,
        href: `/cases/${caseData.id}`,
      },
      ...caseData.actionsRequired
        .filter((action) => isActiveWorkflowStatus(normalizeWorkflowStatus(action.status)) && action.dueDate)
        .map((action) => ({
          id: action.id,
          type: "deadline" as const,
          date: action.dueDate as string,
          caseId: caseData.id,
          title: action.title,
          subtitle: caseData.shortTitle,
          href: `/cases/${caseData.id}`,
        })),
    ])
    .sort((a, b) => a.date.localeCompare(b.date));
}
export function getRecentEventsForUser(cases = getUserCases()) { return cases.flatMap((caseData) => getRecentCaseEvents(caseData, caseData.events.length).map((caseEvent) => ({ caseData, caseEvent }))).sort((a, b) => b.caseEvent.occurredAt.localeCompare(a.caseEvent.occurredAt)); }
export function getLatestCaseEvent(caseData: UnifiedCase) { return getRecentCaseEvents(caseData, 1)[0]; }
