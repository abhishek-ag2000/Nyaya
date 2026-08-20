export type CaseNature = "civil" | "criminal" | "special";
export type CaseCategoryId =
  | "civil-suit"
  | "criminal-case"
  | "execution-petition"
  | "arbitration-case"
  | "criminal-appeal"
  | "misc-application"
  | "guardianship-case"
  | "revision-petition";

export type CaseSubtype = { id: string; label: string; note?: string };
export type CaseCategory = {
  id: CaseCategoryId;
  label: string;
  nature: CaseNature;
  summary: string;
  roman: string;
  code: string;
  statute: string;
  partyLabels: { first: string; opposite: string };
  subtypes: CaseSubtype[];
  typicalReliefs: string[];
  requiredDocuments: string[];
  limitationReference: string;
  nomenclature: { state: string; name: string }[];
};

export const caseCategories: CaseCategory[] = [
  {
    id: "civil-suit",
    label: "Civil Suit",
    nature: "civil",
    roman: "I",
    code: "CS / OS",
    statute: "Code of Civil Procedure, 1908 — Order VII, Rule 1",
    summary: "Original civil proceeding commenced by plaint — money, property, declaration, or specific relief.",
    partyLabels: { first: "Plaintiff", opposite: "Defendant" },
    subtypes: [
      { id: "money", label: "Money / recovery suit" },
      { id: "property", label: "Title / possession / declaration" },
      { id: "injunction", label: "Injunction suit" },
      { id: "summary", label: "Summary suit (Order XXXVII)" }
    ],
    typicalReliefs: [
      "Money decree with pendente lite and future interest",
      "Prayer for specific performance of the contract",
      "Prayer for declaration of title, status or rights",
      "Temporary injunction under Order XXXIX Rules 1 and 2",
      "Prayer for stay of further disposal of the subject matter",
      "Costs of the suit under Section 35 CPC"
    ],
    requiredDocuments: [
      "Original Plaint verified on Oath (Signed PDF)",
      "Master Freight Transport Agreement (Annexure P-1)",
      "Invoices & Ledger Statement of Accounts (Annexure P-2)",
      "Statutory Legal Demand Notice dated 15.12.2025 (Annexure P-3)",
      "Vakalatnama duly executed & stamped with Delhi Advocates Welfare Stamp"
    ],
    limitationReference: "Limitation Act, Art. 113 (illustrative) — 3 years from when the right to sue accrues. Confirm the applicable article, exclusions, and condonation provisions.",
    nomenclature: [
      { state: "West Bengal", name: "Title Suit / Money Suit" },
      { state: "Tamil Nadu", name: "Original Suit (O.S.)" },
      { state: "Maharashtra", name: "Regular Civil Suit (R.C.S.)" },
      { state: "Delhi", name: "Civil Suit (CS)" }
    ]
  },
  {
    id: "criminal-case",
    label: "Criminal Case",
    nature: "criminal",
    roman: "II",
    code: "CRL",
    statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    summary: "Complaint or police case before a magistrate or sessions court, classified by the offence and the court competent to try it.",
    partyLabels: { first: "Complainant", opposite: "Accused" },
    subtypes: [
      { id: "complaint", label: "Private complaint" },
      { id: "summons", label: "Summons case" },
      { id: "warrant", label: "Warrant case (magistrate trial)" },
      { id: "sessions", label: "Sessions-triable offence" }
    ],
    typicalReliefs: [
      "Take cognizance of the offence and issue process",
      "Prayer for regular bail in a non-bailable offence",
      "Prayer for release of seized case property",
      "Direct investigation and call for a report"
    ],
    requiredDocuments: ["Complaint / FIR reference", "List of witnesses", "List of documents / exhibits", "Vakalatnama (private complaint)", "Process / process-fee memo", "Copies for the accused"],
    limitationReference: "BNSS limitation for taking cognizance of certain offences (illustrative). Periods vary by the maximum punishment. Confirm the current schedule before presenting a complaint.",
    nomenclature: [
      { state: "West Bengal", name: "C.R. / G.R. / Complaint Case" },
      { state: "Maharashtra", name: "R.C.C. / Summary Case" },
      { state: "Delhi", name: "Crl. Case / Sessions Case" },
      { state: "Karnataka", name: "C.C. / S.C." }
    ]
  },
  {
    id: "execution-petition",
    label: "Execution Petition",
    nature: "civil",
    roman: "III",
    code: "EX",
    statute: "Code of Civil Procedure, 1908 — Order XXI, Rule 11",
    summary: "Proceeding to enforce a decree — ordinarily before the court which passed it, or the court to which it is transferred.",
    partyLabels: { first: "Decree-holder", opposite: "Judgment-debtor" },
    subtypes: [
      { id: "money-exec", label: "Execution of money decree" },
      { id: "possession-exec", label: "Delivery of possession" },
      { id: "attachment", label: "Attachment / sale of property" }
    ],
    typicalReliefs: [
      "Prayer for execution of the money decree by attachment and sale",
      "Arrest and detention of the judgment-debtor (where available)",
      "Delivery of vacant possession of the scheduled property",
      "Record satisfaction of the decree"
    ],
    requiredDocuments: ["Execution petition", "Certified copy of decree", "Copy of judgment (if required)", "Vakalatnama", "Process-fee memo", "Schedule of property (if attachment sought)"],
    limitationReference: "Limitation Act, Art. 136 (illustrative) — 12 years from the date when the decree becomes enforceable. Confirm current law and any stay or part-satisfaction.",
    nomenclature: [
      { state: "West Bengal", name: "Execution Case (Ex. Case)" },
      { state: "Maharashtra", name: "Darkhast / Execution Petition" },
      { state: "Tamil Nadu", name: "E.P." },
      { state: "Delhi", name: "Execution Petition (Ex.P.)" }
    ]
  },
  {
    id: "arbitration-case",
    label: "Arbitration Application",
    nature: "special",
    roman: "IV",
    code: "ARB",
    statute: "Arbitration and Conciliation Act, 1996",
    summary: "Court applications under the Arbitration and Conciliation Act — typically Sections 9, 34, or 36 — not a full civil trial.",
    partyLabels: { first: "Applicant", opposite: "Respondent" },
    subtypes: [
      { id: "s9", label: "Section 9 — interim measures" },
      { id: "s34", label: "Section 34 — set aside award" },
      { id: "s36", label: "Section 36 — enforcement of award" }
    ],
    typicalReliefs: [
      "Interim injunction / status-quo pending arbitration",
      "Set aside the arbitral award dated…",
      "Stay of enforcement of the award",
      "Enforce the award as a decree of this Court"
    ],
    requiredDocuments: ["Application under the relevant section", "Copy of arbitration agreement", "Copy of award (S.34 / S.36)", "Vakalatnama", "Court-fee as applicable", "Affidavit in support"],
    limitationReference: "S.34: 3 months from receipt of the award, with a further 30 days on sufficient cause (illustrative). Confirm the Act, exclusions, and the date of receipt.",
    nomenclature: [
      { state: "West Bengal", name: "Arb. Petition / Commercial Court application" },
      { state: "Delhi", name: "O.M.P. (I) / O.M.P. (Comm)" },
      { state: "Maharashtra", name: "Arbitration Petition" },
      { state: "Karnataka", name: "A.A. / Com.A.P." }
    ]
  },
  {
    id: "criminal-appeal",
    label: "Criminal Appeal",
    nature: "criminal",
    roman: "V",
    code: "CRL.A",
    statute: "Bharatiya Nagarik Suraksha Sanhita, 2023 — Chapter XXIX",
    summary: "Appeal from a magistrate’s judgment to the Sessions Court, or as otherwise provided by the BNSS.",
    partyLabels: { first: "Appellant", opposite: "Respondent" },
    subtypes: [
      { id: "conviction", label: "Appeal against conviction" },
      { id: "acquittal", label: "Appeal against acquittal" },
      { id: "sentence", label: "Appeal as to sentence" }
    ],
    typicalReliefs: [
      "Set aside the conviction and sentence",
      "Acquit the appellant of all charges",
      "Reduce / modify the sentence",
      "Call for the trial-court record"
    ],
    requiredDocuments: ["Memorandum of appeal", "Certified copy of judgment", "Certified copy of order / sentence", "Vakalatnama", "Copies for the respondent", "Application for condonation if delayed"],
    limitationReference: "Appeal periods under the BNSS vary by forum and the nature of the order (often 30–90 days, illustrative). Confirm the governing provision and starting point.",
    nomenclature: [
      { state: "West Bengal", name: "Criminal Appeal (C.A.)" },
      { state: "Delhi", name: "Crl. A." },
      { state: "Maharashtra", name: "Criminal Appeal" },
      { state: "Tamil Nadu", name: "Crl.A." }
    ]
  },
  {
    id: "misc-application",
    label: "Miscellaneous Application",
    nature: "civil",
    roman: "VI",
    code: "MISC",
    statute: "CPC §151 (Inherent Powers), Order VI R.17, Limitation Act §5",
    summary: "Incidental application in a pending or disposed proceeding — stay, injunction, amendment, restoration, or condonation.",
    partyLabels: { first: "Applicant", opposite: "Opposite party" },
    subtypes: [
      { id: "interim", label: "Interim injunction / stay" },
      { id: "amendment", label: "Amendment of pleadings" },
      { id: "restoration", label: "Restoration (Order IX)" },
      { id: "delay", label: "Condonation of delay" }
    ],
    typicalReliefs: [
      "Prayer for stay order pending the parent proceeding",
      "Prayer for temporary injunction under Order XXXIX",
      "Permit amendment of the plaint / written statement",
      "Condone the delay under Section 5 of the Limitation Act"
    ],
    requiredDocuments: ["Application with grounds", "Affidavit in support", "Vakalatnama (if not already on record)", "Copy of the order under challenge (if any)", "Copies for the opposite party"],
    limitationReference: "Depends on the parent proceeding and the specific rule (e.g. Order IX restoration, Limitation Act s.5 for condonation). Illustrative only — confirm the governing provision.",
    nomenclature: [
      { state: "West Bengal", name: "Misc. Case / IA" },
      { state: "Delhi", name: "I.A. in CS / CM" },
      { state: "Maharashtra", name: "Civil Misc. Application" },
      { state: "Tamil Nadu", name: "I.A. in O.S." }
    ]
  },
  {
    id: "guardianship-case",
    label: "Guardianship Petition",
    nature: "civil",
    roman: "VII",
    code: "G&W",
    statute: "Guardians and Wards Act, 1890 — Sections 7, 8, 9 & 10",
    summary: "Petition under the Guardians and Wards Act for appointment, custody, or removal of a guardian.",
    partyLabels: { first: "Petitioner", opposite: "Respondent" },
    subtypes: [
      { id: "appointment", label: "Appointment of guardian" },
      { id: "custody", label: "Custody of the minor" },
      { id: "removal", label: "Removal of guardian" }
    ],
    typicalReliefs: [
      "Appoint the petitioner as guardian of the person / property of the minor",
      "Grant custody of the minor to the petitioner",
      "Remove the existing guardian and appoint…",
      "Direct an inquiry into the welfare of the minor"
    ],
    requiredDocuments: ["Guardianship petition", "Birth / age proof of the minor", "Consent / no-objection where available", "Affidavit of fitness", "Vakalatnama", "Notice particulars of relatives"],
    limitationReference: "No single Limitation Act article covers every guardianship petition. Delay, laches, and the minor’s welfare remain relevant. Illustrative procedural reference only.",
    nomenclature: [
      { state: "West Bengal", name: "G.A. / Guardianship Case" },
      { state: "Delhi", name: "G.P. / GWA petition" },
      { state: "Maharashtra", name: "Guardianship Petition" },
      { state: "Karnataka", name: "G & W Act petition" }
    ]
  },
  {
    id: "revision-petition",
    label: "Revision Petition",
    nature: "special",
    roman: "VIII",
    code: "REV",
    statute: "CPC §115 (Civil Revision) / BNSS §438–442 (Criminal Revision)",
    summary: "Supervisory challenge to a subordinate court’s order — civil revision or criminal revision, as the case may be.",
    partyLabels: { first: "Petitioner", opposite: "Respondent" },
    subtypes: [
      { id: "civil-rev", label: "Civil revision" },
      { id: "criminal-rev", label: "Criminal revision" }
    ],
    typicalReliefs: [
      "Set aside the impugned order dated…",
      "Remand the matter for fresh consideration",
      "Stay operation of the impugned order",
      "Call for the record of the subordinate court"
    ],
    requiredDocuments: ["Revision petition", "Certified copy of the impugned order", "Copies of relevant pleadings", "Vakalatnama", "Application for stay (if sought)", "Copies for the respondent"],
    limitationReference: "Practice often treats 90 days as the outer period for many revisions (illustrative). Confirm the CPC / BNSS provision, starting point, and condonation.",
    nomenclature: [
      { state: "West Bengal", name: "Civil Revision / C.R.R." },
      { state: "Delhi", name: "C.R.P. / Crl. Rev. P." },
      { state: "Maharashtra", name: "Civil Revision Application" },
      { state: "Tamil Nadu", name: "C.R.P. / Crl.R.C." }
    ]
  }
];

export function getCaseCategory(id: string | undefined | null) {
  return caseCategories.find((item) => item.id === id);
}

export function categoryIdFromLabels(caseType: string, caseCategory: string): CaseCategoryId {
  const haystack = `${caseType} ${caseCategory}`.toLowerCase();
  if (haystack.includes("execution")) return "execution-petition";
  if (haystack.includes("arbit")) return "arbitration-case";
  if (haystack.includes("guardian")) return "guardianship-case";
  if (haystack.includes("revision")) return "revision-petition";
  if (haystack.includes("appeal") && haystack.includes("criminal")) return "criminal-appeal";
  if (haystack.includes("misc") || haystack.includes("application") || haystack.includes("bail")) return haystack.includes("criminal") || haystack.includes("bail") ? "criminal-case" : "misc-application";
  if (haystack.includes("criminal") || haystack.includes("sessions") || haystack.includes("fir")) return "criminal-case";
  return "civil-suit";
}
