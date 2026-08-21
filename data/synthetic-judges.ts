export type JudgeCaseHistory = { date: string; caseId: string; summary: string };

export type SyntheticJudge = {
  id: string;
  name: string;
  displayName: string;
  syntheticLabel: string;
  designation: string;
  court: string;
  state: string;
  district: string;
  jurisdiction: string[];
  courtroom: string;
  sitting: string;
  appointedSince: string;
  identityVerified: boolean;
  contact: { registryOffice: string; publicEnquiryPhone: string; note: string };
  caseIds: string[];
  caseHistory: JudgeCaseHistory[];
};

const judicialDisclaimer = "Judicial profile — for demonstration only. Not associated with any real person.";
const registryNote = "Public contact is routed through the court registry, not a personal channel.";

// Fictional profiles for interface demonstration only. These are not judicial records.
export const syntheticJudges: SyntheticJudge[] = [
  {
    id: "JDG-DEMO-001",
    name: "Presiding Judge Demo-03",
    displayName: "Presiding Judge Demo-03",
    syntheticLabel: judicialDisclaimer,
    designation: "District & Sessions Judge",
    court: "District & Sessions Court, Darjeeling",
    state: "West Bengal",
    district: "Darjeeling",
    jurisdiction: ["Criminal matters", "Sessions trials"],
    courtroom: "Court 3",
    sitting: "10:30 AM – 4:30 PM",
    appointedSince: "2019 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "District & Sessions Court Registry, Darjeeling",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-WB-DEMO-04821", "NYA-DEMO-CRM-00109", "NYA-DEMO-BAIL-01122", "NYA-WB-DEMO-05510", "NYA-DEMO-GW-00101", "NYA-DEMO-CRA-00244"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-DEMO-CRA-00244", summary: "Criminal appeal listed for hearing." },
      { date: "2026-08-16", caseId: "NYA-DEMO-CRM-00109", summary: "Arguments date confirmed on the case record." },
      { date: "2026-08-14", caseId: "NYA-DEMO-BAIL-01122", summary: "Bail application taken up and listed for hearing." },
      { date: "2026-08-12", caseId: "NYA-WB-DEMO-04821", summary: "Interim application order recorded; next hearing scheduled." },
      { date: "2026-08-08", caseId: "NYA-WB-DEMO-05510", summary: "Criminal revision admitted and listed for hearing." },
      { date: "2026-08-05", caseId: "NYA-DEMO-GW-00101", summary: "Guardianship petition presented and recorded." }
    ]
  },
  {
    id: "JDG-DEMO-002",
    name: "Presiding Judge Demo-04",
    displayName: "Presiding Judge Demo-04",
    syntheticLabel: judicialDisclaimer,
    designation: "Additional District Judge",
    court: "Civil Court, Siliguri",
    state: "West Bengal",
    district: "Darjeeling",
    jurisdiction: ["Civil suits", "Execution proceedings"],
    courtroom: "Court 2",
    sitting: "10:30 AM – 4:00 PM",
    appointedSince: "2021 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "Civil Court Registry, Siliguri",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-DEMO-CIV-02031", "NYA-DEMO-EXE-00821", "NYA-DEMO-MISC-00608", "NYA-DEMO-APL-00940", "NYA-DEMO-GW-00118", "NYA-DL-DEMO-01982"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-DEMO-CIV-02031", summary: "Evidence hearing listed on the public cause list." },
      { date: "2026-08-18", caseId: "NYA-DEMO-EXE-00821", summary: "Execution notice to judgment-debtor listed." },
      { date: "2026-08-16", caseId: "NYA-DEMO-MISC-00608", summary: "Miscellaneous amendment application notice listed." },
      { date: "2026-08-13", caseId: "NYA-DEMO-APL-00940", summary: "Civil appeal listed for hearing." },
      { date: "2026-08-11", caseId: "NYA-DEMO-GW-00118", summary: "Guardianship custody petition listed for hearing." },
      { date: "2026-08-07", caseId: "NYA-DL-DEMO-01982", summary: "Civil appeal admission recorded." }
    ]
  },
  {
    id: "JDG-DEMO-003",
    name: "Presiding Judge Demo-05",
    displayName: "Presiding Judge Demo-05",
    syntheticLabel: judicialDisclaimer,
    designation: "District Judge",
    court: "District & Sessions Court, Central Delhi",
    state: "Delhi",
    district: "Central Delhi",
    jurisdiction: ["Civil appeals", "Commercial matters"],
    courtroom: "Court 5",
    sitting: "10:00 AM – 4:00 PM",
    appointedSince: "2018 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "District & Sessions Court Registry, Central Delhi",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-DL-DEMO-01982", "NYA-DEMO-APL-00940", "NYA-DEMO-COM-00890", "NYA-DEMO-CIV-02031", "NYA-DEMO-ARB-00386", "NYA-DEMO-EXE-00714"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-DL-DEMO-01982", summary: "Civil appeal listed for arguments." },
      { date: "2026-08-17", caseId: "NYA-DEMO-APL-00940", summary: "Connected civil appeal listed for hearing." },
      { date: "2026-08-14", caseId: "NYA-DEMO-COM-00890", summary: "Commercial suit taken up for directions." },
      { date: "2026-08-12", caseId: "NYA-DEMO-CIV-02031", summary: "Civil suit evidence noted on the public record." },
      { date: "2026-08-09", caseId: "NYA-DEMO-ARB-00386", summary: "Arbitration application status recorded." },
      { date: "2026-08-06", caseId: "NYA-DEMO-EXE-00714", summary: "Execution proceeding listed for further orders." }
    ]
  },
  {
    id: "JDG-DEMO-004",
    name: "Presiding Judge Demo-06",
    displayName: "Presiding Judge Demo-06",
    syntheticLabel: judicialDisclaimer,
    designation: "Sessions Judge",
    court: "Bengaluru Rural District & Sessions Court",
    state: "Karnataka",
    district: "Bengaluru Rural",
    jurisdiction: ["Bail matters", "Criminal trials"],
    courtroom: "Court 4",
    sitting: "10:30 AM – 4:30 PM",
    appointedSince: "2020 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "District & Sessions Court Registry, Bengaluru Rural",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-KA-DEMO-01247", "NYA-DEMO-CRM-00109", "NYA-DEMO-BAIL-01122", "NYA-WB-DEMO-04821", "NYA-WB-DEMO-05510", "NYA-DEMO-MISC-00612"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-KA-DEMO-01247", summary: "Bail matter listed for hearing." },
      { date: "2026-08-17", caseId: "NYA-DEMO-BAIL-01122", summary: "Connected bail application listed." },
      { date: "2026-08-15", caseId: "NYA-DEMO-CRM-00109", summary: "Criminal matter listed for arguments." },
      { date: "2026-08-12", caseId: "NYA-WB-DEMO-04821", summary: "Interim application status recorded." },
      { date: "2026-08-10", caseId: "NYA-WB-DEMO-05510", summary: "Criminal revision listed for hearing." },
      { date: "2026-08-07", caseId: "NYA-DEMO-MISC-00612", summary: "Miscellaneous application taken up for directions." }
    ]
  },
  {
    id: "JDG-DEMO-005",
    name: "Presiding Judge Demo-07",
    displayName: "Presiding Judge Demo-07",
    syntheticLabel: judicialDisclaimer,
    designation: "Civil Judge, Senior Division",
    court: "Nashik District & Sessions Court",
    state: "Maharashtra",
    district: "Nashik",
    jurisdiction: ["Property suits", "Civil evidence"],
    courtroom: "Court 7",
    sitting: "11:00 AM – 5:00 PM",
    appointedSince: "2017 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "District Court Registry, Nashik",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-MH-DEMO-03318", "NYA-DEMO-FAM-00451", "NYA-DEMO-CIV-02031", "NYA-DEMO-APL-00940", "NYA-DEMO-EXE-00714", "NYA-DL-DEMO-01982"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-MH-DEMO-03318", summary: "Property suit listed for evidence." },
      { date: "2026-08-16", caseId: "NYA-DEMO-FAM-00451", summary: "Family petition listed for evidence." },
      { date: "2026-08-14", caseId: "NYA-DEMO-CIV-02031", summary: "Civil suit evidence noted on the public record." },
      { date: "2026-08-11", caseId: "NYA-DEMO-APL-00940", summary: "Civil appeal listed for arguments." },
      { date: "2026-08-08", caseId: "NYA-DEMO-EXE-00714", summary: "Execution proceeding listed for directions." },
      { date: "2026-08-05", caseId: "NYA-DL-DEMO-01982", summary: "Connected civil appeal status recorded." }
    ]
  },
  {
    id: "JDG-DEMO-006",
    name: "Presiding Judge Demo-08",
    displayName: "Presiding Judge Demo-08",
    syntheticLabel: judicialDisclaimer,
    designation: "Commercial Court Judge",
    court: "Commercial Court, Kolkata",
    state: "West Bengal",
    district: "Kolkata",
    jurisdiction: ["Arbitration", "Commercial disputes"],
    courtroom: "Commercial Court 1",
    sitting: "10:30 AM – 4:30 PM",
    appointedSince: "2022 (illustrative)",
    identityVerified: true,
    contact: {
      registryOffice: "Commercial Court Registry, Kolkata",
      publicEnquiryPhone: "Not published — contact court registry",
      note: registryNote
    },
    caseIds: ["NYA-DEMO-ARB-00410", "NYA-DEMO-COM-00890", "NYA-DEMO-EXE-00905", "NYA-DEMO-ARB-00455", "NYA-DEMO-REV-00301", "NYA-DEMO-APL-00940"],
    caseHistory: [
      { date: "2026-08-19", caseId: "NYA-DEMO-ARB-00410", summary: "Section 9 arbitration application filed." },
      { date: "2026-08-17", caseId: "NYA-DEMO-COM-00890", summary: "Commercial suit listed for hearing." },
      { date: "2026-08-14", caseId: "NYA-DEMO-EXE-00905", summary: "Execution process listed for attachment directions." },
      { date: "2026-08-11", caseId: "NYA-DEMO-ARB-00455", summary: "Arbitration application listed for hearing." },
      { date: "2026-08-08", caseId: "NYA-DEMO-REV-00301", summary: "Civil revision petition filed." },
      { date: "2026-08-05", caseId: "NYA-DEMO-APL-00940", summary: "Civil appeal listed for hearing." }
    ]
  }
];
