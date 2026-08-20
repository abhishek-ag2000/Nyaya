import { getRecentCaseEvents, listFiledCases, loadDemoCase } from "@/data/demo-case-store";
import { demoUnifiedCase, type CaseAction, type CaseEvent, type UnifiedCase } from "@/data/unified-case";

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
  makeCase("NYA-DEMO-EXE-00714", "Demo Finance Ltd. v. R. Sen", "Execution Proceeding", "Execution Petition Filed", "2026-08-27", "District Court, Kolkata", "Kolkata Court Complex", "Certified copy review requested", { id: "action-certified-copy", title: "Review certified-copy requirement", description: "A procedural item needs review before the next listing.", status: "open", priority: "medium", dueDate: "2026-08-25" }, { state: "West Bengal", district: "Kolkata", judge: "Presiding Judge Demo-04" }),
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

export function getUserCases(): UnifiedCase[] { return [loadDemoCase(demoUnifiedCase.id), ...readOnlyDemoCases, ...listFiledCases().filter((item) => item.id !== demoUnifiedCase.id && !readOnlyDemoCases.some((demo) => demo.id === item.id))]; }
export function isPendingApproval(caseData: UnifiedCase) {
  return caseData.status.code === "pending-approval" || caseData.status.code === "presented" || caseData.id.startsWith("NYA-FILE-");
}
export function getOpenActionsForUser(cases = getUserCases()) { return cases.flatMap((caseData) => caseData.actionsRequired.filter((action) => action.status === "open").map((action) => ({ ...action, caseData }))).sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority] || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))); }
export function getUpcomingItemsForUser(cases = getUserCases()) { return cases.flatMap((caseData) => [{ id: `hearing-${caseData.id}`, type: "hearing" as const, date: caseData.nextHearing.date, caseId: caseData.id, title: caseData.title, subtitle: `${caseData.nextHearing.time} · ${caseData.court.courtroom} · ${caseData.court.name}`, href: `/cases/${caseData.id}` }, ...caseData.actionsRequired.filter((action) => action.status === "open" && action.dueDate).map((action) => ({ id: action.id, type: "deadline" as const, date: action.dueDate as string, caseId: caseData.id, title: action.title, subtitle: caseData.shortTitle, href: `/cases/${caseData.id}` }))]).sort((a, b) => a.date.localeCompare(b.date)); }
export function getRecentEventsForUser(cases = getUserCases()) { return cases.flatMap((caseData) => getRecentCaseEvents(caseData, caseData.events.length).map((caseEvent) => ({ caseData, caseEvent }))).sort((a, b) => b.caseEvent.occurredAt.localeCompare(a.caseEvent.occurredAt)); }
export function getLatestCaseEvent(caseData: UnifiedCase) { return getRecentCaseEvents(caseData, 1)[0]; }
