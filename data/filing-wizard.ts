import { caseCategories, type CaseCategoryId } from "@/data/case-categories";
import type { FilingParty, OffenceClass } from "@/lib/filing-draft";

export const FILING_STEPS = [
  { id: 1, short: "Classify", title: "Classify the matter.", kicker: "Fresh case filing · Step 01 of 09.", stage: "STEP 01 OF 09 · CLASSIFY THE MATTER", instruction: "Select the legal character and governing procedural statutory track for the proposed proceeding." },
  { id: 2, short: "Forum", title: "Determine Court Complex & Pecuniary Competence", kicker: "Step 02 of 09 · Forum & Jurisdiction", stage: "STEP 02 OF 09 · FORUM & JURISDICTION", instruction: "Identify the competent territorial subordinate bench and compute statutory court fee liabilities." },
  { id: 3, short: "Parties", title: "Petitioner / Plaintiff & Respondent Details", kicker: "Step 03 of 09 · Parties Memorandum", stage: "STEP 03 OF 09 · PARTIES MEMORANDUM", instruction: "Provide legal entity particulars and registered addresses for summons delivery." },
  { id: 4, short: "Facts", title: "Chronology & Cause of Action Genesis", kicker: "Step 04 of 09 · Statement of Facts", stage: "STEP 04 OF 09 · STATEMENT OF FACTS", instruction: "State essential jurisdictional dates for limitation calculation (Limitation Act, 1963)." },
  { id: 5, short: "Relief", title: "Specific Prayers & Interim Reliefs Claimed", kicker: "Step 05 of 09 · Prayer & Reliefs", stage: "STEP 05 OF 09 · PRAYER & RELIEFS", instruction: "Frame the primary prayer and any interim relief with the precision the court can actually grant." },
  { id: 6, short: "Documents", title: "Mandatory Annexures & Stamped E-Filing Docket", kicker: "Step 06 of 09 · Revenue & Document Index", stage: "STEP 06 OF 09 · REVENUE & DOCUMENT INDEX", instruction: "Mark the plaint, vakalatnama, court-fee proof and indexed annexures required for registry scrutiny." },
  { id: 7, short: "Draft", title: "Court Plaint & Pleading Memorandum Draft", kicker: "Step 07 of 09 · Petition Synthesis", stage: "STEP 07 OF 09 · PETITION SYNTHESIS", instruction: "The pleading is assembled from the earlier steps. This is a draft, not a court filing." },
  { id: 8, short: "Readiness", title: "Pre-Submission Compliance Scrutiny", kicker: "Step 08 of 09 · Registry Scrutiny", stage: "STEP 08 OF 09 · REGISTRY SCRUTINY", instruction: "These checks look only at structural completeness. They are not a merits judgment or a registry decision." },
  { id: 9, short: "File", title: "Affix Digital Signature & Issue CNR Token", kicker: "Step 09 of 09 · Digital Signature & Filing", stage: "STEP 09 OF 09 · DIGITAL SIGNATURE & FILING", instruction: "Signing with Advocate Certificate: Adv. Aarav Sengupta (D/1892/2012 (Bar Council of Delhi))." }
] as const;

export const DELHI_COURT_COMPLEXES = [
  "Central District — Tis Hazari Courts Complex",
  "West District — Tis Hazari Courts Complex",
  "New Delhi District — Patiala House Courts Complex",
  "South District — Saket Courts Complex",
  "South-East District — Saket Courts Complex",
  "South-West District — Dwarka Courts Complex",
  "East District — Karkardooma Courts Complex",
  "Shahdara District — Karkardooma Courts Complex",
  "North District — Rohini Courts Complex",
  "North-West District — Rohini Courts Complex",
  "North-East District — Karkardooma Courts Complex"
];

export const PROTOTYPE_ADVOCATE = {
  name: "Adv. Aarav Sengupta",
  enrollment: "D/1892/2012",
  bar: "Bar Council of Delhi",
  route: "Subordinate Bench Delhi"
};

export type WizardDraft = {
  step: number;
  categoryId: CaseCategoryId | "";
  subtypeId: string;
  claimValue: string;
  offenceClass: OffenceClass | "";
  courtComplex: string;
  causePlace: string;
  policeStation: string;
  commercialSuit: boolean;
  subjectMatter: boolean;
  territorial: boolean;
  pecuniary: boolean;
  first: FilingParty[];
  opposite: FilingParty[];
  summonsMode: string;
  facts: string[];
  earliestDate: string;
  primaryPrayer: string;
  alternativePrayer: string;
  documents: Record<string, boolean>;
  feeAck: boolean;
  limitationAck: boolean;
  confirmed: boolean;
};

const marked = (categoryId: CaseCategoryId) =>
  Object.fromEntries((caseCategories.find((item) => item.id === categoryId)?.requiredDocuments ?? []).map((item) => [item, true]));

export function emptyParty(role: string, extras: Partial<FilingParty> = {}): FilingParty {
  return { name: "", address: "", role, constitution: "", ...extras };
}

export function pecuniaryTier(claimValue: string, commercialSuit: boolean) {
  const amount = Number(claimValue.replace(/,/g, ""));
  if (commercialSuit) return "District Judge (Commercial)";
  if (!Number.isFinite(amount) || amount <= 0) return "Confirm valuation";
  if (amount < 300000) return "Jr. Civil Judge / Small Causes";
  if (amount < 2000000) return "Sr. Civil Judge";
  return "Sr. Civil Judge / Dist. Judge";
}

export function seedForCategory(categoryId: CaseCategoryId): Omit<WizardDraft, "step"> {
  const category = caseCategories.find((item) => item.id === categoryId)!;
  const base = {
    categoryId,
    subtypeId: category.subtypes[0]?.id ?? "",
    claimValue: "",
    offenceClass: (category.nature === "criminal" ? "magistrate" : "") as OffenceClass | "",
    courtComplex: DELHI_COURT_COMPLEXES[0],
    causePlace: "Kashmere Gate, Delhi",
    policeStation: "Kotwali / Chandni Chowk",
    commercialSuit: false,
    subjectMatter: true,
    territorial: true,
    pecuniary: true,
    first: [emptyParty(category.partyLabels.first)],
    opposite: [emptyParty(category.partyLabels.opposite)],
    summonsMode: "Speed Post + Dasti + Official e-Mail",
    facts: ["", ""],
    earliestDate: "2025-11-14",
    primaryPrayer: "",
    alternativePrayer: "",
    documents: marked(categoryId),
    feeAck: true,
    limitationAck: true,
    confirmed: false
  };

  if (categoryId === "civil-suit") {
    return {
      ...base,
      subtypeId: "money",
      claimValue: "2500000",
      commercialSuit: true,
      first: [emptyParty("Plaintiff", { name: "Bharat Logistics Private Limited", constitution: "Corporate Body / Company", address: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020" })],
      opposite: [emptyParty("Defendant", { name: "Om Sai Freight Carriers & Anr.", constitution: "Partnership / Proprietary concern", address: "Shop No. 12, Transport Nagar, Kashmere Gate, Delhi 110006" })],
      facts: [
        "The Plaintiff company engaged the Defendant for multi-state freight transport under Service Agreement dated 12.01.2024. Despite acknowledgment of goods delivery and invoice clearance obligations, the Defendant defaulted on invoice remittances amounting to ₹24,80,000/- with statutory interest."
      ],
      primaryPrayer: "Money Decree with 18% p.a. pendente lite & future interest",
      alternativePrayer: "Ad-interim ex-parte injunction restraining disposal of commercial assets"
    };
  }

  if (categoryId === "criminal-case") {
    return {
      ...base,
      subtypeId: "complaint",
      offenceClass: "magistrate",
      first: [emptyParty("Complainant", { name: "Smt. Kavita Mehra", constitution: "Individual", address: "House No. 18, Civil Lines, Delhi 110054" })],
      opposite: [emptyParty("Accused", { name: "Rajeev Malhotra", constitution: "Individual", address: "B-22, Chandni Chowk, Delhi 110006" })],
      facts: [
        "On 14.11.2025, at Kotwali / Chandni Chowk, the accused dishonestly induced the complainant to part with ₹3,40,000 on a false promise of supplying goods, which were never delivered.",
        "A legal notice was issued. The complainant now seeks cognizance on a private complaint, with a prayer for bail conditions and release of seized documents if taken into custody."
      ],
      primaryPrayer: "Take cognizance of the offence and issue process to the accused",
      alternativePrayer: "Prayer for regular bail with conditions, and release of seized case property on undertaking"
    };
  }

  if (categoryId === "execution-petition") {
    return {
      ...base,
      subtypeId: "money-exec",
      claimValue: "1120000",
      first: [emptyParty("Decree-holder", { name: "Smt. Parmila", constitution: "Individual (through SPA)", address: "Through SPA Holder, Tis Hazari, Delhi" })],
      opposite: [emptyParty("Judgment-debtor", { name: "Shri Anuj Sharma", constitution: "Proprietor", address: "K-7/26, Second Floor, DLF Phase II, Gurugram, Haryana" })],
      facts: [
        "A money decree dated 19.07.2025 in CS DJ No. 275/2024 (Tis Hazari) awarded ₹11,20,000 with 9% interest, which remains unsatisfied.",
        "The judgment-debtor has failed to pay despite demand. Execution is sought under Order XXI by attachment of movable assets."
      ],
      primaryPrayer: "Execute the decree by attachment and sale of the judgment-debtor’s property",
      alternativePrayer: "In the alternative, issue notice under Order XXI Rule 37 before coercive detention"
    };
  }

  if (categoryId === "arbitration-case") {
    return {
      ...base,
      subtypeId: "s9",
      claimValue: "2500000",
      first: [emptyParty("Applicant", { name: "Bharat Logistics Private Limited", constitution: "Corporate Body / Company", address: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020" })],
      opposite: [emptyParty("Respondent", { name: "Om Sai Freight Carriers & Anr.", constitution: "Partnership", address: "Shop No. 12, Transport Nagar, Kashmere Gate, Delhi 110006" })],
      facts: [
        "The parties are bound by an arbitration clause in the Master Freight Transport Agreement dated 12.01.2024.",
        "The applicant apprehends dissipation of commercial assets and seeks Section 9 interim measures pending constitution of the tribunal."
      ],
      primaryPrayer: "Grant interim injunction / status-quo under Section 9 of the Arbitration and Conciliation Act, 1996",
      alternativePrayer: "Secure the disputed amount by deposit or bank guarantee pending arbitration"
    };
  }

  if (categoryId === "criminal-appeal") {
    return {
      ...base,
      subtypeId: "conviction",
      offenceClass: "sessions",
      first: [emptyParty("Appellant", { name: "State (GNCT of Delhi)", constitution: "Prosecution", address: "Office of the Public Prosecutor, Tis Hazari Courts, Delhi" })],
      opposite: [emptyParty("Respondent", { name: "Accused / Convict", constitution: "Individual", address: "Through jail / last known address, Delhi" })],
      facts: [
        "The magistrate acquitted the accused on 14.11.2025. The State appeals on the ground that unrebutted documentary evidence was ignored.",
        "The appeal is presented within the BNSS limitation window, with a prayer for stay of release where applicable."
      ],
      primaryPrayer: "Set aside the acquittal and convict the respondent according to law",
      alternativePrayer: "Stay operation of the impugned judgment pending the appeal"
    };
  }

  if (categoryId === "misc-application") {
    return {
      ...base,
      subtypeId: "interim",
      claimValue: "2500000",
      first: [emptyParty("Applicant", { name: "Bharat Logistics Private Limited", constitution: "Corporate Body / Company", address: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020" })],
      opposite: [emptyParty("Opposite party", { name: "Om Sai Freight Carriers & Anr.", constitution: "Partnership", address: "Shop No. 12, Transport Nagar, Kashmere Gate, Delhi 110006" })],
      facts: [
        "The parent civil suit is pending. The defendant is attempting to alienate commercial assets, defeating the money claim.",
        "An ad-interim injunction is sought under Order XXXIX Rules 1 and 2, citing prima facie case, irreparable injury and balance of convenience."
      ],
      primaryPrayer: "Grant an ad-interim injunction restraining disposal of commercial assets until further orders",
      alternativePrayer: "Prayer for stay of any further transfer of the subject-matter pending hearing"
    };
  }

  if (categoryId === "guardianship-case") {
    return {
      ...base,
      subtypeId: "appointment",
      first: [emptyParty("Petitioner", { name: "Smt. Ananya Sharma", constitution: "Natural guardian / mother", address: "C-14, Civil Lines, Delhi 110054" })],
      opposite: [emptyParty("Respondent", { name: "Shri Vikram Sharma", constitution: "Father of the minor", address: "Kashmere Gate, Delhi 110006" })],
      facts: [
        "The petition is for appointment of the petitioner as guardian of the person of the minor under Sections 7–10 of the Guardians and Wards Act, 1890.",
        "The welfare of the minor is the paramount consideration, following Githa Hariharan and Elizabeth Dinshaw."
      ],
      primaryPrayer: "Appoint the petitioner as guardian of the person of the minor and grant custody",
      alternativePrayer: "Direct an inquiry into the welfare of the minor and pass such further orders as may be just"
    };
  }

  return {
    ...base,
    subtypeId: "civil-rev",
    first: [emptyParty("Petitioner", { name: "Bharat Logistics Private Limited", constitution: "Corporate Body / Company", address: "Plot 42, Okhla Industrial Area Phase III, New Delhi 110020" })],
    opposite: [emptyParty("Respondent", { name: "Om Sai Freight Carriers & Anr.", constitution: "Partnership", address: "Shop No. 12, Transport Nagar, Kashmere Gate, Delhi 110006" })],
    facts: [
      "The subordinate court declined to consider a jurisdictional objection apparent on the face of the record.",
      "Revision is sought under CPC Section 115 to set aside the impugned order dated 14.11.2025 and to stay its operation."
    ],
    primaryPrayer: "Set aside the impugned order dated 14.11.2025 as suffering from jurisdictional error",
    alternativePrayer: "Stay operation of the impugned order pending the revision"
  };
}

export const initialWizardDraft = (): WizardDraft => ({ step: 1, ...seedForCategory("civil-suit") });
