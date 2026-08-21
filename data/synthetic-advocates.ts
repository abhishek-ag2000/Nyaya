export type AdvocateCounselRole = "Counsel for Petitioner" | "Counsel for Respondent";

export type SyntheticAdvocate = {
  id: string;
  name: string;
  displayName: string;
  syntheticLabel: string;
  barEnrollmentId: string;
  practicingSince: number;
  practiceAreas: string[];
  languages: string[];
  state: string;
  district: string;
  court: string;
  identityVerified: boolean;
  registrationStatus: "Registration recorded";
  documentReview: "document review complete" | "document review pending";
  caseIds: string[];
  caseRoles: Record<string, AdvocateCounselRole>;
};

const advocateDisclaimer = "Advocate profile — for demonstration only. Not associated with any real person.";

export const syntheticAdvocates: SyntheticAdvocate[] = [
  {
    id: "ADV-DEMO-001",
    name: "Advocate A. Sen",
    displayName: "Adv. A. Sen",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-1234/2015",
    practicingSince: 2015,
    practiceAreas: ["Criminal Defence", "Applications", "Bail Applications"],
    languages: ["English", "Hindi", "Bengali", "Nepali"],
    state: "West Bengal",
    district: "Darjeeling",
    court: "District & Sessions Court, Darjeeling",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review complete",
    caseIds: ["NYA-WB-DEMO-04821", "NYA-DEMO-CRM-00109", "NYA-DEMO-BAIL-01122", "NYA-WB-DEMO-05510", "NYA-DEMO-GW-00101", "NYA-DEMO-CRA-00201"],
    caseRoles: {
      "NYA-WB-DEMO-04821": "Counsel for Petitioner",
      "NYA-DEMO-CRM-00109": "Counsel for Respondent",
      "NYA-DEMO-BAIL-01122": "Counsel for Petitioner",
      "NYA-WB-DEMO-05510": "Counsel for Petitioner",
      "NYA-DEMO-GW-00101": "Counsel for Petitioner",
      "NYA-DEMO-CRA-00201": "Counsel for Respondent"
    }
  },
  {
    id: "ADV-DEMO-002",
    name: "Advocate R. Bose",
    displayName: "Adv. R. Bose",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-2088/2012",
    practicingSince: 2012,
    practiceAreas: ["Civil Suits", "Evidence"],
    languages: ["English", "Hindi", "Bengali", "Nepali"],
    state: "West Bengal",
    district: "Darjeeling",
    court: "Civil Court, Siliguri",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review complete",
    caseIds: ["NYA-DEMO-CIV-02031", "NYA-DEMO-EXE-00821", "NYA-DEMO-MISC-00601", "NYA-DEMO-APL-00940", "NYA-DEMO-GW-00118", "NYA-DL-DEMO-01982"],
    caseRoles: {
      "NYA-DEMO-CIV-02031": "Counsel for Petitioner",
      "NYA-DEMO-EXE-00821": "Counsel for Respondent",
      "NYA-DEMO-MISC-00601": "Counsel for Petitioner",
      "NYA-DEMO-APL-00940": "Counsel for Petitioner",
      "NYA-DEMO-GW-00118": "Counsel for Petitioner",
      "NYA-DL-DEMO-01982": "Counsel for Petitioner"
    }
  },
  {
    id: "ADV-DEMO-003",
    name: "Advocate K. Roy",
    displayName: "Adv. K. Roy",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-3310/2018",
    practicingSince: 2018,
    practiceAreas: ["Execution", "Commercial matters"],
    languages: ["English", "Hindi", "Bengali"],
    state: "West Bengal",
    district: "Kolkata",
    court: "District Court, Kolkata",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review pending",
    caseIds: ["NYA-DEMO-EXE-00714", "NYA-DEMO-ARB-00386", "NYA-DEMO-COM-00890", "NYA-DEMO-CIV-02031", "NYA-DEMO-MISC-00612", "NYA-WB-DEMO-04821"],
    caseRoles: {
      "NYA-DEMO-EXE-00714": "Counsel for Petitioner",
      "NYA-DEMO-ARB-00386": "Counsel for Respondent",
      "NYA-DEMO-COM-00890": "Counsel for Petitioner",
      "NYA-DEMO-CIV-02031": "Counsel for Respondent",
      "NYA-DEMO-MISC-00612": "Counsel for Petitioner",
      "NYA-WB-DEMO-04821": "Counsel for Respondent"
    }
  },
  {
    id: "ADV-DEMO-004",
    name: "Advocate M. Das",
    displayName: "Adv. M. Das",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-4412/2010",
    practicingSince: 2010,
    practiceAreas: ["Criminal Defence", "Arguments"],
    languages: ["English", "Hindi", "Bengali", "Nepali"],
    state: "West Bengal",
    district: "Darjeeling",
    court: "Sessions Court, Darjeeling",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review complete",
    caseIds: ["NYA-DEMO-CRM-00109", "NYA-WB-DEMO-04821", "NYA-DEMO-BAIL-01122", "NYA-WB-DEMO-05510", "NYA-KA-DEMO-01247", "NYA-DEMO-MISC-00612"],
    caseRoles: {
      "NYA-DEMO-CRM-00109": "Counsel for Petitioner",
      "NYA-WB-DEMO-04821": "Counsel for Respondent",
      "NYA-DEMO-BAIL-01122": "Counsel for Respondent",
      "NYA-WB-DEMO-05510": "Counsel for Petitioner",
      "NYA-KA-DEMO-01247": "Counsel for Petitioner",
      "NYA-DEMO-MISC-00612": "Counsel for Respondent"
    }
  },
  {
    id: "ADV-DEMO-005",
    name: "Advocate P. Nandi",
    displayName: "Adv. P. Nandi",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-5521/2016",
    practicingSince: 2016,
    practiceAreas: ["Arbitration", "Commercial matters"],
    languages: ["English", "Hindi", "Bengali"],
    state: "West Bengal",
    district: "Kolkata",
    court: "Commercial Court, Kolkata",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review complete",
    caseIds: ["NYA-DEMO-ARB-00386", "NYA-DEMO-COM-00890", "NYA-DL-DEMO-01982", "NYA-DEMO-EXE-00714", "NYA-DEMO-APL-00940", "NYA-DEMO-CIV-02031"],
    caseRoles: {
      "NYA-DEMO-ARB-00386": "Counsel for Petitioner",
      "NYA-DEMO-COM-00890": "Counsel for Respondent",
      "NYA-DL-DEMO-01982": "Counsel for Petitioner",
      "NYA-DEMO-EXE-00714": "Counsel for Petitioner",
      "NYA-DEMO-APL-00940": "Counsel for Respondent",
      "NYA-DEMO-CIV-02031": "Counsel for Petitioner"
    }
  },
  {
    id: "ADV-DEMO-006",
    name: "Advocate S. Iyer",
    displayName: "Adv. S. Iyer",
    syntheticLabel: advocateDisclaimer,
    barEnrollmentId: "WB/DEMO-6603/2014",
    practicingSince: 2014,
    practiceAreas: ["Civil Suits", "Court appearances"],
    languages: ["English", "Hindi", "Bengali"],
    state: "West Bengal",
    district: "Kolkata",
    court: "District Court, Kolkata",
    identityVerified: true,
    registrationStatus: "Registration recorded",
    documentReview: "document review pending",
    caseIds: ["NYA-DEMO-EXE-00714", "NYA-DEMO-ARB-00386", "NYA-DEMO-COM-00890", "NYA-DEMO-FAM-00451", "NYA-DEMO-APL-00940", "NYA-DEMO-CIV-02031"],
    caseRoles: {
      "NYA-DEMO-EXE-00714": "Counsel for Respondent",
      "NYA-DEMO-ARB-00386": "Counsel for Respondent",
      "NYA-DEMO-COM-00890": "Counsel for Petitioner",
      "NYA-DEMO-FAM-00451": "Counsel for Respondent",
      "NYA-DEMO-APL-00940": "Counsel for Petitioner",
      "NYA-DEMO-CIV-02031": "Counsel for Respondent"
    }
  }
];
