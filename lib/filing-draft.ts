import { getCaseCategory, type CaseCategory } from "@/data/case-categories";
import { getSuggestedForum } from "@/data/forum-and-stages";

export type OffenceClass = "executive" | "petty" | "magistrate" | "sessions";
export type FilingParty = { name: string; address: string; role: string; constitution?: string };

export function causeTitle(first: FilingParty[], opposite: FilingParty[], labels: { first: string; opposite: string }) {
  const left = first.map((party) => party.name.trim()).filter(Boolean).join(", ") || `[${labels.first} name]`;
  const right = opposite.map((party) => party.name.trim()).filter(Boolean).join(", ") || `[${labels.opposite} name]`;
  return `${left}  …  ${labels.first}\nVersus\n${right}  …  ${labels.opposite}`;
}

export function illustrativeCourtFee(claimValue: number) {
  if (!Number.isFinite(claimValue) || claimValue <= 0) return 0;
  if (claimValue <= 100000) return Math.max(50, Math.round(claimValue * 0.075));
  if (claimValue <= 500000) return 7500 + Math.round((claimValue - 100000) * 0.025);
  if (claimValue <= 1000000) return 17500 + Math.round((claimValue - 500000) * 0.01);
  return 22500 + Math.round((claimValue - 1000000) * 0.0033);
}

export function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export type AssembledDraftInput = {
  category: CaseCategory;
  subtypeLabel: string;
  forumLabel: string;
  district: string;
  courtComplex?: string;
  claimValue?: string;
  courtFee?: number;
  causePlace?: string;
  earliestDate?: string;
  commercialSuit?: boolean;
  first: FilingParty[];
  opposite: FilingParty[];
  facts: string[];
  primaryPrayer: string;
  alternativePrayer: string;
  date: string;
};

export function assembleDraft(input: AssembledDraftInput) {
  const labels = input.category.partyLabels;
  const petitioner = input.first[0]?.name.trim() || labels.first;
  const facts = input.facts.map((fact) => fact.trim()).filter(Boolean);
  const numbered = facts.map((fact, index) => `${index + 1}.\t${fact}`).join("\n\n");
  const amount = Number((input.claimValue ?? "").replace(/,/g, ""));
  const valuation = Number.isFinite(amount) && amount > 0 ? formatRupees(amount) : "as stated";
  const feeLine = input.courtFee ? formatRupees(input.courtFee) : "as applicable";
  const forum = input.courtComplex
    ? `${input.forumLabel.toUpperCase()}\n${input.courtComplex.toUpperCase()}`
    : `THE ${input.forumLabel.toUpperCase()}\nAT ${input.district.toUpperCase()}`;
  const commercial = input.commercialSuit ? " (COMMERCIAL)" : "";
  const causeDate = input.earliestDate || "the date stated in the plaint";
  const causePlace = input.causePlace || input.district;

  return [
    `IN THE COURT OF THE ${forum}${commercial}.`,
    "",
    `SUIT NO. _______ OF 2026 (ORIGINAL ${input.category.code} — ${input.category.roman}).`,
    "",
    causeTitle(input.first, input.opposite, labels),
    "",
    "MOST RESPECTFULLY SHOWETH:",
    "",
    numbered || "1.\t[Material facts in chronological order.]",
    "",
    `${facts.length + 1}.\tThe cause of action first accrued on ${causeDate} at ${causePlace}. This Hon'ble Court has territorial competence under CPC §§16–20 / BNSS jurisdiction rules (illustrative).`,
    "",
    `${facts.length + 2}.\tThe suit is valued at ${valuation} for the purpose of jurisdiction and court-fee. The calculated ad-valorem court fee is ${feeLine} (illustrative Delhi sketch).`,
    "",
    "PRAYER",
    "",
    "In the premises, it is most respectfully prayed that this Hon'ble Court may be pleased to:",
    "",
    `A.\t${input.primaryPrayer.trim() || "[Primary relief sought.]"}`,
    input.alternativePrayer.trim() ? `B.\t${input.alternativePrayer.trim()}` : "",
    "C.\tAward costs of the suit and pass any other order this Hon'ble Court deems fit and proper.",
    "VERIFICATION",
    "",
    `I, the authorised signatory of ${petitioner}, do hereby verify that the contents of the above paragraphs are true to my knowledge and belief, and that this is a Statement of Truth under Order VI Rule 15A CPC (illustrative).`,
    "",
    `Place: ${input.district}`,
    `Date: ${input.date}`,
    "",
    "Through counsel: Adv. Aarav Sengupta (D/1892/2012, Bar Council of Delhi)",
    "",
    "(This is a draft. It is not a court filing and has no legal effect.)"
  ].filter((line, index, lines) => line !== "" || lines[index - 1] !== "").join("\n");
}

export function forumValue(categoryId: string, claimValue: string, offenceClass: string) {
  const category = getCaseCategory(categoryId);
  if (!category) return undefined;
  if (category.nature === "criminal") return offenceClass || undefined;
  const amount = Number(claimValue.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

export function suggestedForumFor(categoryId: string, subtypeId: string, claimValue: string, offenceClass: string) {
  return getSuggestedForum(categoryId, subtypeId, forumValue(categoryId, claimValue, offenceClass));
}

/** Parse the first N year(s)|month(s)|day(s) from a category limitationReference string. */
export function parseIllustrativeLimitation(reference: string): { amount: number; unit: "year" | "month" | "day"; days: number } | null {
  const match = reference.match(/(\d+)\s*[-–]?\s*(?:to\s*)?(\d+)?\s*(year|month|day)s?/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const unit = match[3].toLowerCase() as "year" | "month" | "day";
  const days = unit === "year" ? amount * 365 : unit === "month" ? amount * 30 : amount;
  return { amount, unit, days };
}

/** Hedged limitation badge for the filing wizard — never an unqualified legal determination. */
export function illustrativeLimitationLabel(earliestDate: string, limitationReference: string, todayIso: string): string | null {
  if (!earliestDate) return null;
  const parsed = parseIllustrativeLimitation(limitationReference);
  if (!parsed) {
    return "Limitation for this category is case-specific — illustrative, verify applicable rules.";
  }
  const start = new Date(`${earliestDate}T00:00:00`);
  const today = new Date(`${todayIso}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(today.getTime())) {
    return "Limitation for this category is case-specific — illustrative, verify applicable rules.";
  }
  const daysElapsed = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const unitLabel = `${parsed.amount} ${parsed.unit}${parsed.amount === 1 ? "" : "s"}`;
  if (daysElapsed <= parsed.days) {
    return `Within illustrative ${unitLabel} limitation reference for this category — verify applicable rules.`;
  }
  return `Outside illustrative ${unitLabel} limitation reference for this category — verify applicable rules.`;
}
