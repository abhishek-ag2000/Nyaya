import { getCaseCategory } from "@/data/case-categories";
import type { Filing, UnifiedCase } from "@/data/unified-case";

export type ReadinessInput = {
  causeTitleReady: boolean;
  firstPartyNamed: boolean;
  oppositePartyNamed: boolean;
  forumReady: boolean;
  jurisdictionConfirmed: boolean;
  factCount: number;
  primaryPrayer: boolean;
  verificationPresent: boolean;
  requiredDocuments: { label: string; assembled: boolean }[];
  feeAndLimitationAcknowledged: boolean;
};

export type ReadinessRule = { id: string; label: string; passed: boolean; detail: string };

export function evaluateFilingReadiness(input: ReadinessInput): ReadinessRule[] {
  const missingDocs = input.requiredDocuments.filter((item) => !item.assembled).map((item) => item.label);
  return [
    { id: "cause-title", label: "Cause title", passed: input.causeTitleReady, detail: input.causeTitleReady ? "Parties are named in a cause-title format." : "Add names for both sides so a cause title can be formed." },
    { id: "first-party", label: "First party identified", passed: input.firstPartyNamed, detail: input.firstPartyNamed ? "The moving party is named." : "Name the plaintiff / petitioner / applicant." },
    { id: "opposite-party", label: "Opposite party identified", passed: input.oppositePartyNamed, detail: input.oppositePartyNamed ? "The opposite party is named." : "Name the defendant / respondent / accused." },
    { id: "forum", label: "Forum suggested", passed: input.forumReady, detail: input.forumReady ? "An illustrative court level has been suggested." : "Complete classification so a forum can be suggested." },
    { id: "jurisdiction", label: "Jurisdiction checks", passed: input.jurisdictionConfirmed, detail: input.jurisdictionConfirmed ? "Subject-matter, territorial, and pecuniary / competence checks are confirmed." : "Confirm all three registry-style jurisdiction checks." },
    { id: "facts", label: "Numbered facts", passed: input.factCount >= 1, detail: input.factCount >= 1 ? `${input.factCount} material-fact paragraph${input.factCount === 1 ? " is" : "s are"} present.` : "Add a chronological statement of material facts." },
    { id: "prayer", label: "Primary prayer", passed: input.primaryPrayer, detail: input.primaryPrayer ? "A primary prayer has been framed." : "State the primary relief sought." },
    { id: "verification", label: "Verification clause", passed: input.verificationPresent, detail: input.verificationPresent ? "A verification placeholder is included in the assembled draft." : "The assembled draft must include a verification clause." },
    { id: "documents", label: "Required documents", passed: missingDocs.length === 0 && input.requiredDocuments.length > 0, detail: missingDocs.length ? `Still unmarked: ${missingDocs.join(", ")}.` : "Category-specific documents are marked as assembled." },
    { id: "fee-limitation", label: "Court fee & limitation references", passed: input.feeAndLimitationAcknowledged, detail: input.feeAndLimitationAcknowledged ? "Illustrative court-fee and limitation references have been acknowledged." : "Acknowledge the illustrative court-fee estimate and limitation reference." }
  ];
}

/** Derive structural readiness rules from an already-filed case record. */
export function rulesFromCaseFiling(caseData: UnifiedCase, filing: Filing): ReadinessRule[] {
  const firstNamed = Boolean(caseData.parties.petitioners[0]?.trim());
  const oppositeNamed = Boolean(caseData.parties.respondents[0]?.trim());
  const draft = caseData.assembledDraft ?? "";
  const factMatches = draft.match(/^\d+\.\t/gm);
  const factCount = factMatches?.length ?? (draft.includes("MOST RESPECTFULLY SHOWETH") ? 1 : 0);
  const category = getCaseCategory(caseData.categoryId);
  const docHaystack = [
    ...caseData.documents.map((document) => document.title),
    filing.title,
    draft,
  ].join(" ").toLowerCase();
  const requiredDocuments = (category?.requiredDocuments ?? []).map((label) => ({
    label,
    assembled: docHaystack.includes(label.toLowerCase()) || caseData.documents.length > 0,
  }));
  const filingOnRecord = ["Accepted", "Registered", "Under Review", "Needs Attention", "Submitted"].includes(filing.status);

  return evaluateFilingReadiness({
    causeTitleReady: firstNamed && oppositeNamed,
    firstPartyNamed: firstNamed,
    oppositePartyNamed: oppositeNamed,
    forumReady: Boolean(caseData.forum?.courtLevel) || Boolean(caseData.court.name),
    jurisdictionConfirmed: filingOnRecord && firstNamed && oppositeNamed,
    factCount: factCount || (draft.length > 200 ? 1 : 0),
    primaryPrayer: /PRAYER|prayed that/i.test(draft) || Boolean(filing.detail),
    verificationPresent: /do hereby verify|Statement of Truth|verification/i.test(draft),
    requiredDocuments: requiredDocuments.length
      ? requiredDocuments
      : caseData.documents.map((document) => ({ label: document.title, assembled: true })),
    feeAndLimitationAcknowledged: filingOnRecord,
  });
}
