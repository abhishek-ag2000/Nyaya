import { getPendingActionWorkflow, getPendingActionWorkflows, getRecentCaseEvents, isActiveWorkflowStatus, listFiledCases, loadDemoCase, normalizeWorkflowStatus, type PendingActionAuditEntry, type PendingActionWorkflowStatus } from "@/data/demo-case-store";
import type { CaseCategoryId } from "@/data/case-categories";
import { getProceduralMap } from "@/data/procedural-stages";
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

const event = (caseId: string, date: string, title: string, type: CaseEvent["type"] = "status-changed"): CaseEvent => ({ id: `event-${caseId}-${date}`, caseId, type, occurredAt: date, title, description: "A case update.", plainLanguage: "This is a case update for Nyaya.", source: { type: "case" }, visibility: "case-users" });
function seedDocuments(caseId: string, stage: string): Pick<UnifiedCase, "documents" | "orders" | "filings"> {
  const filingId = `filing-${caseId}`;
  const applicationId = `doc-app-${caseId}`;
  const orderId = `doc-order-${caseId}`;
  const showOrder = /order|arguments|evidence|hearing|judgment|satisfaction|execution process/i.test(stage);
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

type MakeCaseOpts = {
  categoryId: CaseCategoryId;
  petitioners?: string[];
  respondents?: string[];
  petitionerAdvocates?: string[];
  respondentAdvocates?: string[];
  action?: CaseAction;
  context?: { state: string; district: string; judge: string; courtroom?: string };
};

const makeCase = (
  id: string,
  title: string,
  caseType: string,
  stage: string,
  date: string,
  court: string,
  establishment: string,
  recentTitle: string,
  opts: MakeCaseOpts
): UnifiedCase => {
  const context = opts.context ?? { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" };
  const procedural = getProceduralMap({ categoryId: opts.categoryId, caseType, caseCategory: caseType });
  const map = procedural.stages.map((item) => item.title);
  const stageIndex = Math.max(0, map.findIndex((titleItem) => titleItem.toLowerCase() === stage.toLowerCase()));
  const resolvedIndex = stageIndex >= 0 ? stageIndex : 0;
  const current = map[resolvedIndex] ?? stage;
  return {
    id,
    demo: true,
    title,
    shortTitle: title,
    caseType,
    caseCategory: caseType,
    categoryId: opts.categoryId,
    court: {
      name: court,
      establishment,
      state: context.state,
      district: context.district,
      courtroom: context.courtroom ?? "Court 2",
      judge: context.judge,
    },
    status: {
      label: /order reserved|judgment|satisfaction/i.test(current) ? current : "Hearing Scheduled",
      code: "demo",
      plainLanguage: "This matter is shown for dashboard demonstration only.",
      updatedAt: "2026-08-19",
    },
    stage: {
      current,
      completedStages: map.slice(0, resolvedIndex),
      upcomingStages: map.slice(resolvedIndex + 1),
    },
    stageMap: map,
    stageIndex: resolvedIndex,
    nextHearing: {
      date,
      time: "11:00 AM",
      purpose: /order reserved|judgment/i.test(current) ? "Order awaited" : current,
      mode: "physical",
    },
    parties: {
      petitioners: opts.petitioners ?? ["Demo Petitioner"],
      respondents: opts.respondents ?? ["Demo Respondent"],
    },
    advocates: {
      petitioner: opts.petitionerAdvocates ?? ["Advocate Demo"],
      respondent: opts.respondentAdvocates ?? ["Counsel Demo"],
    },
    notifications: [],
    actionsRequired: opts.action ? [opts.action] : [],
    events: [event(id, "2026-08-19", recentTitle)],
    ...seedDocuments(id, current),
  };
};

export const readOnlyDemoCases: UnifiedCase[] = [
  // Civil Suit
  makeCase("NYA-DEMO-CIV-02031", "Mehta Properties v. Arun Das", "Civil Suit", "Hearing & Examination", "2026-08-28", "Civil Court, Siliguri", "Siliguri Court Complex", "Evidence hearing listed", {
    categoryId: "civil-suit",
    petitioners: ["Mehta Properties Pvt. Ltd. (Demo)"],
    respondents: ["Arun Das (Demo)"],
    petitionerAdvocates: ["Adv. P. Banerjee (Demo)"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04", courtroom: "Court 2" },
  }),
  makeCase("NYA-MH-DEMO-03318", "Demo Estates v. Kulkarni Demo", "Civil Suit", "Framing of Issues", "2026-09-12", "Nashik District & Sessions Court", "Nashik District & Sessions Court", "Issues hearing listed", {
    categoryId: "civil-suit",
    petitioners: ["Demo Estates LLP"],
    respondents: ["Kulkarni Demo"],
    context: { state: "Maharashtra", district: "Nashik", judge: "Presiding Judge Demo-07", courtroom: "Court 1" },
  }),
  makeCase("NYA-DEMO-COM-00890", "Harbor Demo Ltd. v. Delta Demo LLP", "Civil Suit", "Appearance of Parties", "2026-09-04", "Commercial Court, Kolkata", "Kolkata Court Complex", "Commercial suit listed", {
    categoryId: "civil-suit",
    petitioners: ["Harbor Demo Ltd."],
    respondents: ["Delta Demo LLP"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-08", courtroom: "Court 3" },
  }),
  makeCase("NYA-DEMO-FAM-00451", "Sengupta Demo v. Bose Demo", "Civil Suit", "Written Statement", "2026-08-25", "Civil Court, Siliguri", "Siliguri Court Complex", "Family petition listed for written statement", {
    categoryId: "civil-suit",
    petitioners: ["Sengupta Demo"],
    respondents: ["Bose Demo"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" },
  }),
  makeCase("NYA-DEMO-CIV-LIVE-551", "Demo Landlord v. Demo Tenant", "Civil Suit", "Hearing & Examination", "2026-08-20", "Civil Court, Siliguri", "Siliguri Court Complex", "Live civil listing", {
    categoryId: "civil-suit",
    petitioners: ["Demo Landlord"],
    respondents: ["Demo Tenant"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04", courtroom: "Court 4" },
  }),
  makeCase("NYA-DEMO-COM-LIVE-312", "Orbit Demo Pvt. Ltd. v. Horizon Demo Traders", "Civil Suit", "Hearing & Examination", "2026-08-20", "Commercial Court, Kolkata", "Kolkata Court Complex", "Live commercial listing", {
    categoryId: "civil-suit",
    petitioners: ["Orbit Demo Pvt. Ltd."],
    respondents: ["Horizon Demo Traders"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-08", courtroom: "Court 2" },
  }),
  makeCase("NYA-MH-DEMO-LIVE-1188", "Patil Demo Farms v. Demo Co-op Bank", "Civil Suit", "Hearing & Examination", "2026-08-20", "Nashik District & Sessions Court", "Nashik District & Sessions Court", "Live property listing", {
    categoryId: "civil-suit",
    petitioners: ["Patil Demo Farms"],
    respondents: ["Demo Co-op Bank"],
    context: { state: "Maharashtra", district: "Nashik", judge: "Presiding Judge Demo-07", courtroom: "Court 2" },
  }),

  // Criminal Case
  makeCase("NYA-DEMO-CRM-00109", "State v. Demo Accused", "Criminal Case", "Arguments", "2026-09-02", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Arguments hearing confirmed", {
    categoryId: "criminal-case",
    petitioners: ["State of West Bengal"],
    respondents: ["Demo Accused"],
    petitionerAdvocates: ["Public Prosecutor (Demo)"],
    respondentAdvocates: ["Adv. A. Sen"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03", courtroom: "Court 3" },
  }),
  makeCase("NYA-DEMO-BAIL-01122", "State v. Demo Bail Applicant", "Criminal Case", "Discharge / Plea", "2026-08-21", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Bail application listed", {
    categoryId: "criminal-case",
    petitioners: ["State of West Bengal"],
    respondents: ["Demo Bail Applicant"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-KA-DEMO-01247", "State v. Demo Applicant", "Criminal Case", "Framing of Charge", "2026-09-10", "Bengaluru Rural District & Sessions Court", "Bengaluru Rural District & Sessions Court", "Bail hearing listed", {
    categoryId: "criminal-case",
    petitioners: ["State of Karnataka"],
    respondents: ["Demo Applicant"],
    context: { state: "Karnataka", district: "Bengaluru Rural", judge: "Presiding Judge Demo-06", courtroom: "Court 4" },
  }),
  makeCase("NYA-WB-DEMO-LIVE-2204", "Demo Complainant v. State of West Bengal", "Criminal Case", "Prosecution Evidence", "2026-08-20", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Live criminal listing", {
    categoryId: "criminal-case",
    petitioners: ["Demo Complainant"],
    respondents: ["State of West Bengal"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03", courtroom: "Court 3" },
  }),

  // Execution
  makeCase("NYA-DEMO-EXE-00714", "Demo Finance Ltd. v. R. Sen", "Execution Petition", "Execution Petition Filed", "2026-08-27", "District Court, Kolkata", "Kolkata Court Complex", "Certified copy review requested", {
    categoryId: "execution-petition",
    petitioners: ["Demo Finance Ltd."],
    respondents: ["R. Sen (Demo)"],
    action: {
      id: "action-certified-copy",
      title: "Review certified-copy requirement",
      description: "A procedural item needs review before the next listing.",
      status: "open",
      priority: "medium",
      dueDate: "2026-08-25",
      relatedDocumentId: "doc-app-NYA-DEMO-EXE-00714",
      relatedFilingId: "filing-NYA-DEMO-EXE-00714",
    },
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-04" },
  }),
  makeCase("NYA-DEMO-EXE-00821", "Siliguri Credit Demo v. Guha Demo", "Execution Petition", "Notice to Judgment-Debtor", "2026-09-03", "Civil Court, Siliguri", "Siliguri Court Complex", "JD notice listed", {
    categoryId: "execution-petition",
    petitioners: ["Siliguri Credit Demo Co."],
    respondents: ["Guha Demo"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" },
  }),
  makeCase("NYA-DEMO-EXE-00905", "North Bend Bank Demo v. Roy Demo", "Execution Petition", "Execution Process", "2026-09-11", "District Court, Kolkata", "Kolkata Court Complex", "Attachment process listed", {
    categoryId: "execution-petition",
    petitioners: ["North Bend Bank Demo"],
    respondents: ["Roy Demo"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" },
  }),

  // Arbitration
  makeCase("NYA-DEMO-ARB-00386", "Eastern Demo Traders v. Northline Demo Pvt. Ltd.", "Arbitration Application", "Order / Award on Application", "2026-09-05", "Commercial Court, Kolkata", "Kolkata Court Complex", "Order awaited", {
    categoryId: "arbitration-case",
    petitioners: ["Eastern Demo Traders"],
    respondents: ["Northline Demo Pvt. Ltd."],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-04" },
  }),
  makeCase("NYA-DEMO-ARB-00410", "Riverfront Demo Spices v. Coastline Demo Logistics", "Arbitration Application", "Application Filed (S.9 / S.34)", "2026-08-24", "Commercial Court, Kolkata", "Kolkata Court Complex", "Section 9 application filed", {
    categoryId: "arbitration-case",
    petitioners: ["Riverfront Demo Spices"],
    respondents: ["Coastline Demo Logistics"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-08" },
  }),
  makeCase("NYA-DEMO-ARB-00455", "Teesta Demo Mills v. Valley Demo Packers", "Arbitration Application", "Hearing", "2026-09-09", "District Court, Kolkata", "Kolkata Court Complex", "Arbitration hearing listed", {
    categoryId: "arbitration-case",
    petitioners: ["Teesta Demo Mills"],
    respondents: ["Valley Demo Packers"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" },
  }),

  // Criminal Appeal
  makeCase("NYA-DEMO-CRA-00201", "State v. Mondal Demo Respondent", "Criminal Appeal", "Memorandum of Appeal Filed", "2026-08-29", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Criminal appeal filed", {
    categoryId: "criminal-appeal",
    petitioners: ["State of West Bengal"],
    respondents: ["Mondal Demo Respondent"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-DEMO-CRA-00244", "Biswas Demo Appellant v. State", "Criminal Appeal", "Hearing", "2026-09-06", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Criminal appeal hearing listed", {
    categoryId: "criminal-appeal",
    petitioners: ["Biswas Demo Appellant"],
    respondents: ["State of West Bengal"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),

  // Miscellaneous Application — all 4 stages
  makeCase("NYA-DEMO-MISC-00601", "In re Demo Stay Application", "Miscellaneous Application", "Application Filed", "2026-08-23", "District & Sessions Court, Darjeeling", "Darjeeling Court Complex", "Misc application filed", {
    categoryId: "misc-application",
    petitioners: ["Chhetri Demo Applicant"],
    respondents: ["Lama Demo Opposite Party"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-DEMO-MISC-00608", "In re Demo Amendment IA", "Miscellaneous Application", "Notice (if required)", "2026-08-26", "Civil Court, Siliguri", "Siliguri Court Complex", "Misc notice listed", {
    categoryId: "misc-application",
    petitioners: ["Tamang Demo Applicant"],
    respondents: ["Rai Demo Opposite Party"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" },
  }),
  makeCase("NYA-DEMO-MISC-00612", "In re Demo Miscellaneous", "Miscellaneous Application", "Hearing", "2026-08-22", "District & Sessions Court, Darjeeling", "Darjeeling Court Complex", "Miscellaneous application listed", {
    categoryId: "misc-application",
    petitioners: ["Thapa Demo Applicant"],
    respondents: ["Gurung Demo Opposite Party"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-DEMO-MISC-00630", "In re Demo Restoration", "Miscellaneous Application", "Order", "2026-09-01", "Civil Court, Siliguri", "Siliguri Court Complex", "Misc order reserved", {
    categoryId: "misc-application",
    petitioners: ["Pradhan Demo Applicant"],
    respondents: ["Sherpa Demo Opposite Party"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-04" },
  }),

  // Guardianship
  makeCase("NYA-DEMO-GW-00101", "In re Minor Demo Child (Guardianship)", "Guardianship Petition", "Petition Filed", "2026-08-30", "District & Sessions Court, Darjeeling", "Darjeeling Court Complex", "Guardianship petition filed", {
    categoryId: "guardianship-case",
    petitioners: ["Ananya Sharma Demo"],
    respondents: ["Vikram Sharma Demo"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-DEMO-GW-00118", "In re Custody of Minor Demo", "Guardianship Petition", "Hearing", "2026-09-08", "District Court, Kolkata", "Kolkata Court Complex", "Guardianship hearing listed", {
    categoryId: "guardianship-case",
    petitioners: ["Priya Banerjee Demo"],
    respondents: ["Amit Banerjee Demo"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" },
  }),

  // Revision
  makeCase("NYA-WB-DEMO-05510", "State v. Demo Revisionist", "Revision Petition", "Hearing", "2026-09-01", "Sessions Court, Darjeeling", "Darjeeling Court Complex", "Criminal revision listed for arguments", {
    categoryId: "revision-petition",
    petitioners: ["State of West Bengal"],
    respondents: ["Demo Revisionist"],
    context: { state: "West Bengal", district: "Darjeeling", judge: "Presiding Judge Demo-03" },
  }),
  makeCase("NYA-DEMO-REV-00301", "Dutta Demo v. Municipal Demo Board", "Revision Petition", "Revision Petition Filed", "2026-08-28", "District Court, Kolkata", "Kolkata Court Complex", "Civil revision filed", {
    categoryId: "revision-petition",
    petitioners: ["Dutta Demo"],
    respondents: ["Municipal Demo Board"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" },
  }),

  // Civil Appeal
  makeCase("NYA-DL-DEMO-01982", "Kapoor Demo Services v. Metro Demo Works", "Civil Appeal", "Admission / Preliminary Hearing", "2026-09-08", "District & Sessions Court, Central Delhi", "Tees Hazari Courts", "Civil appeal admission listed", {
    categoryId: "civil-appeal",
    petitioners: ["Kapoor Demo Services"],
    respondents: ["Metro Demo Works"],
    context: { state: "Delhi", district: "Central Delhi", judge: "Presiding Judge Demo-05", courtroom: "Court 5" },
  }),
  makeCase("NYA-DEMO-APL-00940", "Banerjee Demo v. Municipal Demo Board", "Civil Appeal", "Hearing of Appeal", "2026-09-07", "District Court, Kolkata", "Kolkata Court Complex", "Civil appeal listed for arguments", {
    categoryId: "civil-appeal",
    petitioners: ["Banerjee Demo"],
    respondents: ["Municipal Demo Board"],
    context: { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-05" },
  }),
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
    for (const caseData of cases.filter((item) => /order reserved|order \/ award/i.test(item.stage.current))) {
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
