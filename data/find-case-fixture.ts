export type FinderPerson = { name: string; caseIds: string[] };

export const caseTypeGroups = [
  { label: "Civil", options: ["Civil Suit", "Civil Appeal", "Civil Revision", "Execution Proceeding", "Property Suit", "Small Cause Suit"] },
  { label: "Criminal", options: ["Criminal Matter", "Criminal Appeal", "Criminal Revision", "Bail Matter", "Criminal Miscellaneous Matter", "Complaint Case"] },
  { label: "Commercial", options: ["Commercial Suit", "Commercial Appeal", "Arbitration Application", "Arbitration Execution", "Commercial Arbitration Petition"] },
  { label: "Family", options: ["Matrimonial Suit", "Divorce by Mutual Consent", "Guardian & Wards Case", "Maintenance Petition", "Succession Case"] },
  { label: "Labour & service", options: ["Labour Court Application", "Industrial Dispute Case", "Employee Compensation Application", "Service Matter"] },
  { label: "Property & public matters", options: ["Land Acquisition Reference", "Probate Suit", "Insolvency Petition", "Election Petition", "Public Premises Appeal"] },
  { label: "Special matters", options: ["Motor Accident Claim Petition", "NDPS Special Case", "POCSO Special Case", "SC/ST Act Special Case", "Prevention of Corruption Act Case", "Domestic Violence Application"] }
] as const;

export const finderAdvocates: FinderPerson[] = [
  { name: "Advocate A. Sen (synthetic)", caseIds: ["NYA-WB-DEMO-04821"] },
  { name: "Advocate R. Bose (synthetic)", caseIds: ["NYA-DEMO-CIV-02031"] },
  { name: "Advocate K. Roy (synthetic)", caseIds: ["NYA-DEMO-EXE-00714"] },
  { name: "Advocate M. Das (synthetic)", caseIds: ["NYA-DEMO-CRM-00109"] },
  { name: "Advocate P. Nandi (synthetic)", caseIds: ["NYA-DEMO-ARB-00386"] },
  { name: "Advocate N. Kapoor (synthetic)", caseIds: ["NYA-DL-DEMO-01982"] },
  { name: "Advocate S. Iyer (synthetic)", caseIds: ["NYA-KA-DEMO-01247"] },
  { name: "Advocate V. Kulkarni (synthetic)", caseIds: ["NYA-MH-DEMO-03318"] }
];

export const finderJudges: FinderPerson[] = [
  { name: "Presiding Judge Demo-03 (synthetic)", caseIds: ["NYA-WB-DEMO-04821"] },
  { name: "Presiding Judge Demo-04 (synthetic)", caseIds: ["NYA-DEMO-CIV-02031", "NYA-DEMO-EXE-00714", "NYA-DEMO-CRM-00109", "NYA-DEMO-ARB-00386"] },
  { name: "Presiding Judge Demo-05 (synthetic)", caseIds: ["NYA-DL-DEMO-01982"] },
  { name: "Presiding Judge Demo-06 (synthetic)", caseIds: ["NYA-KA-DEMO-01247"] },
  { name: "Presiding Judge Demo-07 (synthetic)", caseIds: ["NYA-MH-DEMO-03318"] }
];
