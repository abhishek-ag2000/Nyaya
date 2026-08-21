export type DocumentProcessing = { status: "uploaded" | "processing" | "processed" | "needs-review"; classification: string; confidence?: number; ocrComplete?: boolean; aiAssisted?: boolean };
export type IntakeFields = { courtName?: string; parties?: string[]; filingDate?: string; advocateName?: string; prayerPresent?: boolean; verificationPresent?: boolean; affidavitPresent?: boolean; jurisdictionPresent?: boolean; courtFeeStatementPresent?: boolean; vakalatnamaPresent?: boolean; annexuresDetected?: string[] };
export type DocumentIntakeResult = { documentType?: string; documentTitle?: string; filingType?: string; extractedText: string; pageCount?: number; confidence?: "High" | "Review needed"; detectedCase?: { caseId?: string; caseTitle?: string }; extractedFields?: IntakeFields; warnings?: string[] };
export type CaseDocument = { id: string; caseId?: string; title: string; date: string; category: "Filing" | "Order" | "Submission" | "Evidence"; subtype?: string; pages: number; addedBy: string; source?: "upload" | "court" | "filing"; processing?: DocumentProcessing; extractedText?: string; extractedFields?: IntakeFields; warnings?: string[] };
export type CaseEventType = "case-created" | "case-registered" | "document-uploaded" | "document-processed" | "filing-created" | "filing-needs-attention" | "filing-ready" | "hearing-scheduled" | "hearing-rescheduled" | "order-added" | "notice-added" | "action-required" | "action-resolved" | "status-changed";
export type CaseEvent = { id: string; caseId: string; type: CaseEventType; occurredAt: string; title: string; description: string; plainLanguage?: string; source?: { type: "document" | "filing" | "hearing" | "order" | "case" | "system"; id?: string }; sourceSystem?: { type: "court-record" | "filing" | "registry" | "investigation" | "user" | "prototype"; label: string }; actor?: { role?: string; label?: string }; actionRequired?: { required: boolean; actionId?: string }; details?: { previousDate?: string; newDate?: string }; visibility?: "public" | "case-users" | "role-restricted" };
export type NotificationType = "case-update" | "hearing" | "document" | "filing" | "action" | "order";
export type CaseNotification = { id: string; caseId: string; type: NotificationType; title: string; message: string; createdAt: string; read: boolean; priority: "normal" | "important"; href?: string; relatedEventId?: string; recipientRole?: string };
export type FilingStatus = "Draft" | "Uploaded" | "Submitted" | "Under Review" | "Needs Attention" | "Accepted" | "Registered";
export type Filing = { id: string; title: string; filingType: string; date: string; filedBy: string; status: FilingStatus; statusDescription: string; statusUpdatedAt: string; documentIds: string[]; detail: string };
export type CaseActionStatus = "open" | "requested" | "issued" | "assigned" | "attempted" | "served" | "failed" | "approved" | "disapproved" | "clarification-requested" | "completed";
export type CaseAction = { id: string; title: string; description: string; status: CaseActionStatus; priority: "high" | "medium" | "low"; dueDate?: string; relatedDocumentId?: string; relatedFilingId?: string };
export type CaseHistoryRow = { judge: string; businessDate: string; nextHearingDate: string; purpose: string };
export type CaseProvision = { act: string; sections: string[] };
export type CaseIdentity = {
  filingNumber?: string;
  registrationNumber?: string;
  cnr?: string;
  eFilingNumber?: string;
  eFilingDate?: string;
};
export type CaseDates = {
  filingDate?: string;
  registrationDate?: string;
  firstHearingDate?: string;
  decisionDate?: string;
};
export type UnifiedCase = {
  id: string; demo?: boolean; title: string; shortTitle: string; caseType: string; caseCategory: string; categoryId?: string; subtypeId?: string;
  court: { name: string; establishment: string; state: string; district: string; courtroom: string; judge: string };
  status: { label: string; code: string; plainLanguage: string; updatedAt: string; natureOfDisposal?: string };
  stage: { current: string; completedStages: string[]; upcomingStages: string[] };
  stageMap?: string[]; stageIndex?: number;
  forum?: { courtLevel: string; provision: string };
  nextHearing: { date: string; time: string; purpose: string; mode: "physical" | "virtual" | "hybrid" };
  parties: { petitioners: string[]; respondents: string[] }; advocates: { petitioner: string[]; respondent: string[] };
  events: CaseEvent[]; notifications: CaseNotification[]; filings: Filing[]; documents: CaseDocument[]; orders: string[]; actionsRequired: CaseAction[];
  caseHistory?: CaseHistoryRow[]; assembledDraft?: string; transactionId?: string;
  identity?: CaseIdentity;
  dates?: CaseDates;
  provisions?: CaseProvision[];
};

export const demoUnifiedCase: UnifiedCase = {
  id: "NYA-WB-DEMO-04821", demo: true, title: "Sharma v. State of West Bengal", shortTitle: "Sharma v. State", caseType: "Criminal Miscellaneous Matter", caseCategory: "Criminal",
  court: { name: "District & Sessions Court, Darjeeling", establishment: "Siliguri Court Complex", state: "West Bengal", district: "Darjeeling", courtroom: "Court 3", judge: "Presiding Judge Demo-03" },
  status: { label: "Hearing Scheduled", code: "hearing", plainLanguage: "The matter has been listed before the court for its next hearing.", updatedAt: "2026-08-18" },
  stage: { current: "Hearing", completedStages: ["Filed", "Scrutiny", "Registered", "Notice"], upcomingStages: ["Evidence", "Arguments", "Decision"] },
  nextHearing: { date: "2026-08-26", time: "11:00 AM", purpose: "Hearing on application", mode: "physical" },
  parties: { petitioners: ["Rahul Sharma"], respondents: ["State of West Bengal"] }, advocates: { petitioner: ["A. Sen"], respondent: ["Public Prosecutor"] },
  identity: {
    filingNumber: "CRM/4821/2026",
    registrationNumber: "4821/2026",
    cnr: "WBDJ030048212026",
    eFilingNumber: "EF-WB-2026-004821",
    eFilingDate: "2026-07-20",
  },
  dates: {
    filingDate: "2026-07-20",
    registrationDate: "2026-07-28",
    firstHearingDate: "2026-08-02",
  },
  provisions: [
    { act: "Bharatiya Nagarik Suraksha Sanhita, 2023", sections: ["482"] },
    { act: "Bharatiya Nyaya Sanhita, 2023", sections: ["351"] },
  ],
  caseHistory: [
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-02", nextHearingDate: "2026-08-12", purpose: "Notice and appearance" },
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-12", nextHearingDate: "2026-08-20", purpose: "SR / AD / Appearance" },
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-14", nextHearingDate: "2026-08-18", purpose: "SR / AD / Appearance" },
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-16", nextHearingDate: "2026-08-18", purpose: "SR / AD / Appearance" },
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-18", nextHearingDate: "2026-08-20", purpose: "SR / AD / Appearance" },
    { judge: "Presiding Judge Demo-03", businessDate: "2026-08-20", nextHearingDate: "2026-08-26", purpose: "Hearing on application" },
  ],
  documents: [
    { id: "doc-submission", title: "Respondent Written Submission", date: "2026-08-18", category: "Submission", pages: 2, addedBy: "Respondent Counsel", processing: { status: "needs-review", classification: "Written Submission", confidence: 0.94 }, extractedText: "Extract: The respondent places a written submission on the case record for procedural review before the scheduled hearing." },
    { id: "doc-order", title: "Order dated 12 August 2026", date: "2026-08-12", category: "Order", pages: 4, addedBy: "Court record", processing: { status: "processed", classification: "Court Order", confidence: 0.98 }, extractedText: "Extract: The matter is listed for a procedural hearing at the scheduled time shown in this case workspace." },
    { id: "doc-application", title: "Application for Interim Relief", date: "2026-08-02", category: "Filing", pages: 6, addedBy: "Petitioner Counsel", processing: { status: "processed", classification: "Application", confidence: 0.93 }, extractedText: "Extract: This demonstration filing requests interim relief and has been accepted into the registry review flow." }
  ],
  events: [
    { id: "event-submission", caseId: "NYA-WB-DEMO-04821", type: "document-uploaded", occurredAt: "2026-08-18", title: "Respondent Written Submission added", description: "A written submission was added to the case record.", plainLanguage: "A new document is available for review.", source: { type: "document", id: "doc-submission" }, actor: { role: "Respondent Counsel", label: "Respondent Counsel" }, actionRequired: { required: true, actionId: "review-submission" }, visibility: "case-users" },
    { id: "event-order", caseId: "NYA-WB-DEMO-04821", type: "hearing-scheduled", occurredAt: "2026-08-12", title: "Hearing scheduled", description: "A court order listed the matter for a scheduled hearing.", plainLanguage: "The matter has a new scheduled court date.", source: { type: "order", id: "doc-order" }, actor: { role: "Court", label: "court record" }, visibility: "case-users" },
    { id: "event-application", caseId: "NYA-WB-DEMO-04821", type: "filing-created", occurredAt: "2026-08-02", title: "Application filed", description: "An application was submitted in the matter and accepted for registry review.", source: { type: "filing", id: "filing-interim" }, actor: { role: "Petitioner Counsel", label: "A. Sen" }, visibility: "case-users" },
    { id: "event-registration", caseId: "NYA-WB-DEMO-04821", type: "case-registered", occurredAt: "2026-07-28", title: "Case registered", description: "The case was registered here.", source: { type: "case" }, visibility: "case-users" }
  ],
  notifications: [{ id: "notification-submission", caseId: "NYA-WB-DEMO-04821", type: "action", title: "Review respondent submission", message: "A new document is available for review before the next hearing.", createdAt: "2026-08-18", read: false, priority: "important", href: "/cases/NYA-WB-DEMO-04821/documents/doc-submission", relatedEventId: "event-submission" }],
  filings: [
    { id: "filing-interim", title: "Application for Interim Relief", filingType: "Application", date: "2026-08-02", filedBy: "Petitioner", status: "Accepted", statusDescription: "Recorded as accepted in the registry flow. This is not court or authority approval.", statusUpdatedAt: "2026-08-03", documentIds: ["doc-application"], detail: "An application accepted into the registry review flow." },
    { id: "filing-submission", title: "Respondent Submission", filingType: "Written Submission", date: "2026-08-18", filedBy: "Respondent", status: "Needs Attention", statusDescription: "a demonstration registry check indicates that this filing needs review before it can be marked accepted.", statusUpdatedAt: "2026-08-18", documentIds: ["doc-submission"], detail: "A respondent submission awaiting review before the next hearing." }
  ],
  orders: ["doc-order"],
  actionsRequired: [{ id: "review-submission", title: "Review newly uploaded respondent submission", description: "A new document was added to the case record.", status: "open", priority: "high", dueDate: "2026-08-25", relatedDocumentId: "doc-submission", relatedFilingId: "filing-submission" }]
};

export function getUnifiedCase(id: string) { if (id.toLowerCase() === demoUnifiedCase.id.toLowerCase()) return demoUnifiedCase; return undefined; }
