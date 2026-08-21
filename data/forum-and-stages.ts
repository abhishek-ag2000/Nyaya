import { getCaseCategory, type CaseCategoryId } from "@/data/case-categories";
import { getProceduralMap } from "@/data/procedural-stages";

export const FORUM_GUIDANCE_LABEL = "Illustrative forum guidance — actual pecuniary limits are set by state governments and change periodically; confirm current limits for your state.";
export const STAGE_SEQUENCE_LABEL = "Illustrative procedural sequence for this class of proceeding — not the actual order or history of this case. Actual stages, order, and duration vary by court, state, and case specifics.";
export const FILING_ROUTE_DISCLAIMER = "This designed route models real Indian district court filing procedure using a demo case. It cannot create, submit, or register a case with any court or authority.";

export type OffenceClass = "executive" | "petty" | "magistrate" | "sessions";
export type SuggestedForum = {
  courtLevel: string;
  hierarchy: "civil" | "criminal" | "special";
  provision: string;
  rationale: string;
};

export function getStageMap(category: string, subtype = ""): string[] {
  const id = getCaseCategory(category)?.id ?? category;
  return getProceduralMap({ categoryId: id, caseType: category, caseCategory: category, subtype }).stages.map((item) => item.title);
}

export function getSuggestedForum(category: string, subtype = "", value?: number | string): SuggestedForum {
  const id = (getCaseCategory(category)?.id ?? category) as CaseCategoryId;
  const amount = typeof value === "number" ? value : Number.NaN;
  const offence = typeof value === "string" ? value : "";

  if (id === "criminal-case" || subtype === "sessions" || offence === "sessions") {
    if (offence === "executive" || subtype === "executive") {
      return {
        courtLevel: "Executive Magistrate",
        hierarchy: "criminal",
        provision: "BNSS — executive / preventive jurisdiction (illustrative)",
        rationale: "Preventive and executive functions sit with the Executive Magistrate, not the trial of warrant cases."
      };
    }
    if (offence === "petty" || subtype === "summons") {
      return {
        courtLevel: "Judicial Magistrate, Second Class",
        hierarchy: "criminal",
        provision: "BNSS — magistrate competent to try petty / summons cases (illustrative)",
        rationale: "Lesser offences triable as summons cases are ordinarily heard by a Second Class Magistrate, subject to local allocation."
      };
    }
    if (offence === "sessions" || subtype === "sessions") {
      return {
        courtLevel: "Sessions Court / Additional Sessions Judge (District & Sessions Judge)",
        hierarchy: "criminal",
        provision: "BNSS — Sessions Court may pass any sentence; death is subject to High Court confirmation",
        rationale: "Sessions-triable offences are committed to, and tried by, the Court of Session."
      };
    }
    return {
      courtLevel: "Judicial Magistrate, First Class / Chief Judicial Magistrate",
      hierarchy: "criminal",
      provision: "BNSS — JMFC / CJM as the ordinary court of first instance (illustrative)",
      rationale: "Most magistrate-triable warrant and complaint cases are taken up by a First Class Magistrate or the CJM."
    };
  }

  if (id === "criminal-appeal") {
    return {
      courtLevel: "Sessions Court / Additional Sessions Judge",
      hierarchy: "criminal",
      provision: "BNSS — appeals from magistrate’s judgments ordinarily lie to the Court of Session",
      rationale: "A criminal appeal from a magistrate is typically presented to the Sessions Court, not as an original complaint."
    };
  }

  if (id === "civil-appeal") {
    return {
      courtLevel: "District Judge / Additional District Judge (appellate)",
      hierarchy: "civil",
      provision: "CPC ss.96–112 / Order XLI — appeals from decrees and appealable orders (illustrative)",
      rationale: "A first appeal from a subordinate civil court ordinarily lies to the District Court, subject to the state’s appellate structure."
    };
  }

  if (id === "arbitration-case") {
    return {
      courtLevel: "District Judge / Commercial Court (principal civil court of original jurisdiction)",
      hierarchy: "special",
      provision: "Arbitration and Conciliation Act, s.2(1)(e), read with ss.9 / 34 / 36",
      rationale: "Arbitration court applications go to the principal civil court of original jurisdiction, or a designated Commercial Court — not a Munsiff."
    };
  }

  if (id === "guardianship-case") {
    return {
      courtLevel: "District Judge / Additional District Judge",
      hierarchy: "civil",
      provision: "Guardians and Wards Act — District Court as the court of first instance",
      rationale: "Guardianship petitions are ordinarily presented to the District Judge, not a court of limited pecuniary jurisdiction."
    };
  }

  if (id === "revision-petition") {
    if (subtype === "criminal-rev") {
      return {
        courtLevel: "Sessions Court / Additional Sessions Judge",
        hierarchy: "criminal",
        provision: "BNSS — revisional jurisdiction of the Sessions Court (illustrative)",
        rationale: "Criminal revisions from a magistrate ordinarily lie to the Court of Session."
      };
    }
    return {
      courtLevel: "District Judge / Additional District Judge",
      hierarchy: "civil",
      provision: "CPC — revisional jurisdiction of the District Court (illustrative)",
      rationale: "Civil revisions from a subordinate civil court are typically taken up by the District Judge."
    };
  }

  if (id === "misc-application") {
    return {
      courtLevel: "The court seized of the parent proceeding (often Civil Judge, Senior Division)",
      hierarchy: "civil",
      provision: "CPC — incidental applications follow the parent suit",
      rationale: "A miscellaneous application is filed in the court already dealing with the suit or proceeding, not a new forum chosen by claim value alone."
    };
  }

  if (id === "execution-petition") {
    const civil = civilForumByValue(amount);
    return {
      ...civil,
      rationale: "Execution is ordinarily taken out in the court which passed the decree, or the court to which it is transferred. The level below is illustrative only."
    };
  }

  return civilForumByValue(amount);
}

function civilForumByValue(amount: number): SuggestedForum {
  if (Number.isFinite(amount) && amount > 0 && amount < 300000) {
    return {
      courtLevel: "Civil Judge (Junior Division) / Court of Small Causes",
      hierarchy: "civil",
      provision: "CPC s.15 — suit to be instituted in the court of the lowest grade competent to try it",
      rationale: "Suits illustratively up to ₹3 lakh are shown at Junior Division / Small Causes level. Actual pecuniary bands are set by each state and change periodically."
    };
  }
  if (Number.isFinite(amount) && amount < 2000000) {
    return {
      courtLevel: "Civil Judge (Senior Division)",
      hierarchy: "civil",
      provision: "CPC ss.15–16, read with the state’s pecuniary-jurisdiction notification (illustrative)",
      rationale: "Original suits in the mid-value band are illustratively shown before the Civil Judge (Senior Division). Confirm the current state notification."
    };
  }
  return {
    courtLevel: "District Judge / Additional District Judge",
    hierarchy: "civil",
    provision: "District Court original civil jurisdiction — pecuniary competence as notified for the district (illustrative)",
    rationale: "High-value original suits are illustratively shown before the District Judge. Commercial designation may shift the matter to the Commercial Court."
  };
}

export const offenceClassOptions: { id: OffenceClass; label: string }[] = [
  { id: "executive", label: "Executive / preventive" },
  { id: "petty", label: "Petty / summons-triable" },
  { id: "magistrate", label: "Magistrate-triable (JMFC / CJM)" },
  { id: "sessions", label: "Sessions-triable" }
];
