"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { caseCategories, getCaseCategory, type CaseCategory } from "@/data/case-categories";
import { FILING_ROUTE_DISCLAIMER, FORUM_GUIDANCE_LABEL, getStageMap, offenceClassOptions, type OffenceClass } from "@/data/forum-and-stages";
import { createFiledDemoCase } from "@/data/demo-case-store";
import {
  DELHI_COURT_COMPLEXES, FILING_STEPS, PROTOTYPE_ADVOCATE, initialWizardDraft,
  pecuniaryTier, seedForCategory, type WizardDraft
} from "@/data/filing-wizard";
import type { UnifiedCase } from "@/data/unified-case";
import { assembleDraft, formatRupees, illustrativeCourtFee, illustrativeLimitationLabel, suggestedForumFor, type FilingParty } from "@/lib/filing-draft";
import { evaluateFilingReadiness } from "@/lib/filing-readiness";

const localIso = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const displayDate = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${iso}T00:00:00`));

function applyCategory(state: WizardDraft, category: CaseCategory): WizardDraft {
  return { ...state, ...seedForCategory(category.id), step: state.step, confirmed: false };
}

export default function FreshCaseFiling() {
  const router = useRouter();
  const [state, setState] = useState<WizardDraft>(initialWizardDraft);
  const [efiRef] = useState(() => `EFI-${new Date().getFullYear()}-DL-${String(Math.floor(100000 + Math.random() * 900000))}`);
  const [draftSaved, setDraftSaved] = useState("");
  const [revealed, setRevealed] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const category = getCaseCategory(state.categoryId);
  const subtype = category?.subtypes.find((item) => item.id === state.subtypeId);
  const forum = category ? suggestedForumFor(category.id, state.subtypeId, state.claimValue, state.offenceClass) : undefined;
  const fee = illustrativeCourtFee(Number(state.claimValue.replace(/,/g, "")));
  const today = localIso();
  const current = FILING_STEPS[state.step - 1];
  const draft = useMemo(() => category && forum ? assembleDraft({
    category, subtypeLabel: subtype?.label ?? "", forumLabel: forum.courtLevel, district: "Delhi",
    courtComplex: state.courtComplex, claimValue: state.claimValue, courtFee: fee, causePlace: state.causePlace,
    earliestDate: state.earliestDate ? displayDate(state.earliestDate) : "", commercialSuit: state.commercialSuit,
    first: state.first, opposite: state.opposite, facts: state.facts, primaryPrayer: state.primaryPrayer,
    alternativePrayer: state.alternativePrayer, date: displayDate(today)
  }) : "", [category, fee, forum, state, subtype?.label, today]);
  const rules = evaluateFilingReadiness({
    causeTitleReady: Boolean(state.first[0]?.name.trim() && state.opposite[0]?.name.trim()),
    firstPartyNamed: Boolean(state.first[0]?.name.trim()),
    oppositePartyNamed: Boolean(state.opposite[0]?.name.trim()),
    forumReady: Boolean(forum),
    jurisdictionConfirmed: state.subjectMatter && state.territorial && state.pecuniary,
    factCount: state.facts.filter((fact) => fact.trim()).length,
    primaryPrayer: Boolean(state.primaryPrayer.trim()),
    verificationPresent: draft.includes("do hereby verify"),
    requiredDocuments: category?.requiredDocuments.map((label) => ({ label, assembled: Boolean(state.documents[label]) })) ?? [],
    feeAndLimitationAcknowledged: state.feeAck && state.limitationAck
  });
  const allReady = rules.every((rule) => rule.passed);
  const checks = useMemo(() => {
    const extra = rules.filter((rule) => ["cause-title", "first-party", "opposite-party", "facts", "prayer"].includes(rule.id));
    return [
      { label: "Pecuniary valuation matches court-fee scale", passed: Boolean(fee) && state.pecuniary, detail: fee ? `Court fee sketched at ${formatRupees(fee)}.` : "Valuation still needs a court-fee sketch." },
      { label: `Territorial competence — ${state.courtComplex.split("—")[0].trim() || "Delhi"}`, passed: state.territorial, detail: state.territorial ? "Subordinate bench territorial check confirmed." : "Territorial competence is not confirmed." },
      { label: "Statement of Truth under Order VI Rule 15A", passed: draft.includes("Statement of Truth"), detail: draft.includes("Statement of Truth") ? "Verification clause is present in the assembled draft." : "The draft is missing a statement of truth." },
      { label: `Advocate enrolment ${PROTOTYPE_ADVOCATE.enrollment}`, passed: true, detail: "Bar enrolment is treated as active in this local demo." },
      { label: "Delhi Advocates Welfare Fund stamp", passed: Boolean(category && category.requiredDocuments.every((item) => state.documents[item])), detail: category && category.requiredDocuments.every((item) => state.documents[item]) ? "Mandatory annexures are marked on the docket." : "One or more stamped annexures are still unmarked." },
      ...extra.map((rule) => ({ label: rule.label, passed: rule.passed, detail: rule.detail }))
    ];
  }, [category, draft, fee, rules, state.courtComplex, state.documents, state.pecuniary, state.territorial]);

  function set<K extends keyof WizardDraft>(key: K, value: WizardDraft[K]) { setState((currentState) => ({ ...currentState, [key]: value })); }
  function goTo(step: number) { set("step", Math.min(9, Math.max(1, step))); }
  function continueToNext() {
    setState((currentState) => {
      const step = Number(currentState.step) || 1;
      if (step >= 9) return currentState;
      if (step === 8 && scanning) return currentState;
      if (!currentState.categoryId) return { ...currentState, ...seedForCategory("civil-suit"), step: 2 };
      return { ...currentState, step: Math.min(9, step + 1) };
    });
  }
  function saveDraft() {
    window.localStorage.setItem("nyaya-filing-wizard-draft", JSON.stringify(state));
    setDraftSaved("Draft saved locally");
  }
  const canFile = allReady && state.confirmed;

  useEffect(() => { bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [state.step]);
  useEffect(() => {
    if (state.step !== 8) {
      setRevealed(0);
      setScanning(false);
      return;
    }
    let index = 0;
    setRevealed(0);
    setScanning(true);
    const total = checks.length;
    const timer = window.setInterval(() => {
      index += 1;
      setRevealed(index);
      if (index >= total) {
        window.clearInterval(timer);
        setScanning(false);
      }
    }, 560);
    return () => window.clearInterval(timer);
  }, [state.step, checks.length]);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nyaya-filing-wizard-draft");
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<WizardDraft>;
      if (!parsed.categoryId) return;
      setState({ ...initialWizardDraft(), ...parsed, step: parsed.step && parsed.step >= 1 && parsed.step <= 9 ? parsed.step : 1 });
    } catch { /* keep seeded demo */ }
  }, []);

  function createCase() {
    if (!category || !forum || !allReady) return;
    const id = `NYA-FILE-${Date.now().toString(36).toUpperCase()}`;
    const firstName = state.first[0].name.trim();
    const oppositeName = state.opposite[0].name.trim();
    const title = `${firstName} v. ${oppositeName}`;
    const map = getStageMap(category.id, state.subtypeId);
    const docId = `doc-draft-${id}`;
    const filingId = `filing-${id}`;
    const courtName = state.commercialSuit
      ? `District Judge (Commercial), ${state.courtComplex}`
      : `${forum.courtLevel}, ${state.courtComplex}`;
    const record: UnifiedCase = {
      id, demo: true, title, shortTitle: title, caseType: category.label, caseCategory: category.nature === "criminal" ? "Criminal" : "Civil", categoryId: category.id, subtypeId: state.subtypeId,
      court: { name: courtName, establishment: state.courtComplex, state: "Delhi", district: "Central", courtroom: "Court 2", judge: "Presiding Judge Demo-03" },
      status: { label: "Pending for approval", code: "pending-approval", plainLanguage: "This local filing is waiting for registry approval in the prototype. No court has received it.", updatedAt: today },
      stage: { current: "Pending for approval", completedStages: [], upcomingStages: map },
      stageMap: map, stageIndex: 0, forum: { courtLevel: forum.courtLevel, provision: forum.provision },
      nextHearing: { date: today, time: "11:00 AM", purpose: "Registry scrutiny / approval", mode: "physical" },
      parties: { petitioners: state.first.map((party) => `${party.name.trim()}`), respondents: state.opposite.map((party) => `${party.name.trim()}`) },
      advocates: { petitioner: [`${PROTOTYPE_ADVOCATE.name}`], respondent: ["Counsel Demo"] },
      documents: [{ id: docId, caseId: id, title: `${category.label} — assembled draft`, date: today, category: "Filing", pages: Math.max(1, Math.ceil(draft.length / 1800)), addedBy: "Petitioner Counsel", source: "filing", extractedText: draft, processing: { status: "processed", classification: category.label, ocrComplete: true } }],
      filings: [{ id: filingId, title: `${category.label} — ${subtype?.label ?? category.label}`, filingType: category.label, date: today, filedBy: "Petitioner", status: "Under Review", statusDescription: `Provisional e-filing reference ${efiRef}. Waiting for local registry approval. Recorded in this browser only.`, statusUpdatedAt: today, documentIds: [docId], detail: "filing assembled from the 9-step court sequence." }],
      orders: [], actionsRequired: [], notifications: [],
      events: [{ id: `event-${id}`, caseId: id, type: "case-created", occurredAt: today, title: "filing created", description: `A local case record was created from the Filing Wizard (${efiRef}).`, plainLanguage: "This filing is pending for approval in My cases. No court has received it.", source: { type: "filing", id: filingId }, visibility: "case-users" }],
      assembledDraft: draft, transactionId: efiRef,
      caseHistory: [{ judge: "Presiding Judge Demo-03", businessDate: today, nextHearingDate: today, purpose: "Pending for approval" }]
    };
    createFiledDemoCase(record);
    window.localStorage.removeItem("nyaya-filing-wizard-draft");
    const receipt = { caseId: id, txn: efiRef, title, court: courtName, filedAt: new Date().toISOString() };
    window.sessionStorage.setItem("nyaya-filing-receipt", JSON.stringify(receipt));
    setTransmitting(true);
    window.setTimeout(() => router.push(`/file-a-case/success?case=${encodeURIComponent(id)}&txn=${encodeURIComponent(efiRef)}`), 1100);
  }

  const limitationBadge = category && state.earliestDate
    ? illustrativeLimitationLabel(state.earliestDate, category.limitationReference, today)
    : null;
  const nav = (
    <div className="filing-nav-actions">
      {state.step > 1 && <button className="ghost-cta" onClick={() => goTo(state.step - 1)} type="button"><ArrowLeft aria-hidden="true" className="back-arrow-icon" /> Previous step ({String(state.step - 1).padStart(2, "0")})</button>}
      {state.step === 1 && <button className="ghost-cta" onClick={saveDraft} type="button">{draftSaved || "Save draft"}</button>}
      {state.step < 9 && (
        <button className="filing-continue" disabled={state.step === 8 && scanning} onClick={continueToNext} type="button">
          {state.step === 8 && scanning ? "Running scrutiny…" : state.step === 1 ? "Continue to Step 02 →" : `Proceed to Step ${String(state.step + 1).padStart(2, "0")} →`}
        </button>
      )}
    </div>
  );

  return (
    <main className="filing-shell">
      <aside className="filing-rail" aria-label="Filing wizard steps">
        <p className="filing-rail-kicker">Filing Wizard</p>
        <h1>9-Step Court Sequence</h1>
        <ol className="filing-steps">
          {FILING_STEPS.map((step) => {
            const done = state.step > step.id;
            const currentStep = state.step === step.id;
            return (
              <li className={currentStep ? "is-current" : done ? "is-done" : ""} key={step.id}>
                <button disabled={step.id > state.step} onClick={() => goTo(step.id)} type="button">
                  <span>{String(step.id).padStart(2, "0")}</span>
                  <b>{step.short}</b>
                  {done && <i aria-hidden="true" className="filing-step-dot" />}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="filing-rail-meta">
          <small>Filing route</small>
          <strong>{PROTOTYPE_ADVOCATE.route}</strong>
          <em>Adv: {PROTOTYPE_ADVOCATE.name}</em>
        </div>
      </aside>

      <section className="filing-stage">
        {category && state.step > 1 && (
          <div className="filing-genus">
            <span aria-hidden="true">{category.roman}</span>
            <div>
              <small>Matter classification pre-set from Step 01</small>
              <strong>{category.label} ({category.code})</strong>
            </div>
            <button onClick={() => goTo(1)} type="button">Change matter genus</button>
          </div>
        )}

        <div className={`filing-stage-head ${state.step === 1 ? "is-classify" : ""}`}>
          {state.step === 1 ? (
            <>
              <div>
                <h2>Classify the matter.</h2>
                <p className="filing-stage-kicker">{current.kicker}</p>
              </div>
              <div className="filing-head-meta">
                <dl>
                  <div><dt>Jurisdiction</dt><dd>Original Civil / Criminal</dd></div>
                  <div><dt>User type</dt><dd>Advocate on Record</dd></div>
                </dl>
                {nav}
              </div>
            </>
          ) : (
            <>
              <div className="filing-head-row">
                <div>
                  <p className="filing-stage-kicker">{current.stage}</p>
                  <h2>{current.title}</h2>
                </div>
                {nav}
              </div>
              <p className="filing-stage-lead">{current.instruction}</p>
            </>
          )}
        </div>

        {state.step === 1 && <p className="filing-stage-copy">{current.instruction}</p>}

        <div className="filing-stage-body" ref={bodyRef}>
          {state.step === 1 && (
            <div className="classify-grid">
              {caseCategories.map((item) => {
                const selected = state.categoryId === item.id;
                return (
                  <button className={selected ? "is-selected" : ""} key={item.id} onClick={() => setState((currentState) => applyCategory(currentState, item))} type="button">
                    <div className="classify-card-head">
                      <small>{item.roman} — {item.code}</small>
                      <i className={selected ? "is-on" : ""} aria-hidden="true" />
                    </div>
                    <b>{item.label}</b>
                    <p>{item.summary}</p>
                    <div className="classify-card-foot">
                      {selected ? <em>Selected category</em> : null}
                      <span>{item.statute}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {state.step === 2 && category && forum && (
            <div className="forum-form">
              <div className="suggested-forum" aria-label="Suggested forum">
                <span className="eyebrow">Suggested forum</span>
                <b>{forum.courtLevel}</b>
                <p>{forum.provision}</p>
                <p className="legal-disclosure">{FORUM_GUIDANCE_LABEL}</p>
              </div>
              <label className="filing-field">District &amp; court complex
                <select onChange={(event) => set("courtComplex", event.target.value)} value={state.courtComplex}>
                  {DELHI_COURT_COMPLEXES.map((complex) => <option key={complex} value={complex}>{complex}</option>)}
                </select>
                <small>Territorial competence determined per CPC §§16–20 / BNSS jurisdiction rules.</small>
              </label>
              {category.nature === "criminal" ? (
                <label className="filing-field">Offence classification
                  <select onChange={(event) => set("offenceClass", event.target.value as OffenceClass)} value={state.offenceClass}>
                    {offenceClassOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </label>
              ) : (
                <label className="filing-field">Suit pecuniary valuation (INR ₹)
                  <input inputMode="numeric" onChange={(event) => set("claimValue", event.target.value.replace(/[^\d]/g, ""))} value={state.claimValue} />
                  <div className="fee-row">
                    <span>Illustrative Court Fee Estimate: {fee ? formatRupees(fee) : "—"}</span>
                    <span>Tier: {pecuniaryTier(state.claimValue, state.commercialSuit)}</span>
                  </div>
                  <p className="legal-disclosure">Illustrative procedural reference only. Verify the applicable court-fee statute, schedule and local rules before filing.</p>
                </label>
              )}
              <div className="forum-split">
                <label className="filing-field">Place where cause of action arose
                  <input onChange={(event) => set("causePlace", event.target.value)} value={state.causePlace} />
                </label>
                <label className="filing-field">Police station jurisdiction
                  <input onChange={(event) => set("policeStation", event.target.value)} value={state.policeStation} />
                </label>
              </div>
              {category.nature !== "criminal" && (
                <label className="filing-check">
                  <input checked={state.commercialSuit} onChange={(event) => set("commercialSuit", event.target.checked)} type="checkbox" />
                  <span>Designate as <b>Commercial Suit</b> under Section 2(1)(c) of the Commercial Courts Act, 2015. (Triggers mandatory Pre-Institution Mediation compliance under Section 12A.)</span>
                </label>
              )}
              <fieldset className="jurisdiction-silent">
                <label><input checked={state.subjectMatter} onChange={(event) => set("subjectMatter", event.target.checked)} type="checkbox" /> Subject-matter competence confirmed</label>
                <label><input checked={state.territorial} onChange={(event) => set("territorial", event.target.checked)} type="checkbox" /> Territorial competence confirmed</label>
                <label><input checked={state.pecuniary} onChange={(event) => set("pecuniary", event.target.checked)} type="checkbox" /> Pecuniary / competence confirmed</label>
              </fieldset>
            </div>
          )}

          {state.step === 3 && category && (
            <div className="party-columns">
              <PartyColumn heading={`${category.partyLabels.first} / Complainant (Party 1)`} onChange={(parties) => set("first", parties)} parties={state.first} />
              <div className="party-block">
                <h3>{category.partyLabels.opposite} / Respondent (Party 2)</h3>
                {state.opposite.map((party, index) => (
                  <div className="party-card" key={`opp-${index}`}>
                    <label>{category.partyLabels.opposite} name / entity<input onChange={(event) => set("opposite", state.opposite.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} value={party.name} /></label>
                    <label>Service address for process<textarea onChange={(event) => set("opposite", state.opposite.map((item, itemIndex) => itemIndex === index ? { ...item, address: event.target.value } : item))} rows={3} value={party.address} /></label>
                  </div>
                ))}
                <p className="summons-mode">Summons Mode: {state.summonsMode}</p>
              </div>
            </div>
          )}

          {state.step === 4 && (
            <div className="facts-form">
              <label className="filing-field">Date when cause of action first accrued
                <div className="date-row">
                  <input onChange={(event) => set("earliestDate", event.target.value)} type="date" value={state.earliestDate} />
                  {limitationBadge && <span>{limitationBadge}</span>}
                </div>
              </label>
              <label className="filing-field">Material facts synopsis (Order VI Rule 2 CPC)
                <textarea onChange={(event) => set("facts", [event.target.value, ...state.facts.slice(1)])} rows={7} value={state.facts[0] ?? ""} />
              </label>
            </div>
          )}

          {state.step === 5 && category && (
            <div className="relief-form">
              <div className="relief-chips">{category.typicalReliefs.map((relief) => (
                <button key={relief} onClick={() => set("primaryPrayer", relief)} type="button">{relief}</button>
              ))}</div>
              <label className="filing-field">Substantive relief prayer (Clause A)
                <input onChange={(event) => set("primaryPrayer", event.target.value)} value={state.primaryPrayer} />
              </label>
              <label className="filing-field">Interim application / injunction relief (Order XXXIX R.1 &amp; 2)
                <input onChange={(event) => set("alternativePrayer", event.target.value)} value={state.alternativePrayer} />
              </label>
            </div>
          )}

          {state.step === 6 && category && (
            <div className="docket-list">
              {category.requiredDocuments.map((item) => {
                const checked = Boolean(state.documents[item]);
                return (
                  <label className={checked ? "is-checked" : ""} key={item}>
                    <input checked={checked} onChange={(event) => set("documents", { ...state.documents, [item]: event.target.checked })} type="checkbox" />
                    <i aria-hidden="true"><Check size={16} /></i>
                    <span className="docket-copy">
                      <b>{item}</b>
                      {checked ? <em>OCR scanned &amp; verified</em> : null}
                    </span>
                  </label>
                );
              })}
              <div className="docket-acks">
                <label><input checked={state.feeAck} onChange={(event) => set("feeAck", event.target.checked)} type="checkbox" /> Court-fee sketch acknowledged ({fee ? formatRupees(fee) : "n/a"})</label>
                <label><input checked={state.limitationAck} onChange={(event) => set("limitationAck", event.target.checked)} type="checkbox" /> Limitation reference acknowledged ({category.limitationReference})</label>
              </div>
            </div>
          )}

          {state.step === 7 && (
            <article className="draft-sheet">
              <pre>{draft}</pre>
            </article>
          )}

          {state.step === 8 && (
            <div className="scrutiny-run">
              <p className="scrutiny-status" aria-live="polite">{scanning ? `Registry engine running — ${Math.min(revealed + 1, checks.length)} of ${checks.length}` : `Scrutiny complete — ${checks.filter((item) => item.passed).length} of ${checks.length} passed`}</p>
              <div aria-hidden="true" className="scrutiny-meter"><i style={{ width: `${Math.round((Math.min(revealed, checks.length) / Math.max(checks.length, 1)) * 100)}%` }} /></div>
              <ol className="scrutiny-list">
                {checks.map((item, index) => {
                  const mode = index > revealed ? "queued" : index === revealed && scanning ? "checking" : item.passed ? "passed" : "open";
                  return (
                    <li className={`is-${mode}`} key={`${item.label}-${index}`}>
                      <i aria-hidden="true">{mode === "checking" ? <Loader2 className="filing-spin" size={16} /> : <Check size={16} />}</i>
                      <span className="scrutiny-copy"><b>{item.label}</b><small>{mode === "checking" ? "Checking the record…" : mode === "queued" ? "Queued" : item.detail}</small></span>
                      <em>{mode === "checking" ? "Running" : mode === "queued" ? "Queued" : item.passed ? "Passed" : "Needed"}</em>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {state.step === 9 && (
            <div className="file-box">
              <p className="efi-ref">Provisional e-filing reference: {efiRef}</p>
              <p>By clicking “Affix Signature &amp; Issue Case Filing”, you confirm that the statement of truth and all annexed pleadings comply with the Subordinate Court Rules of Delhi. This site still creates only a local record.</p>
              <label className="filing-check">
                <input checked={state.confirmed} disabled={transmitting} onChange={(event) => set("confirmed", event.target.checked)} type="checkbox" />
                <span>I confirm this is a demo filing and must not be treated as a court submission.</span>
              </label>
              <button className="filing-transmit" disabled={!canFile || transmitting} onClick={createCase} type="button">
                {transmitting ? "Transmitting to registry…" : "Affix signature & transmit to registry"}
              </button>
            </div>
          )}
        </div>

        <div className="filing-nav">
          <p className="filing-disclaimer"><i /> Disclaimer: {FILING_ROUTE_DISCLAIMER}</p>
          {nav}
        </div>
      </section>
    </main>
  );
}

function PartyColumn({ heading, parties, onChange }: { heading: string; parties: FilingParty[]; onChange: (parties: FilingParty[]) => void }) {
  return (
    <div className="party-block">
      <h3>{heading}</h3>
      {parties.map((party, index) => (
        <div className="party-card" key={`${heading}-${index}`}>
          <label>Full name / entity name<input onChange={(event) => onChange(parties.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} value={party.name} /></label>
          <label>Entity constitution<input onChange={(event) => onChange(parties.map((item, itemIndex) => itemIndex === index ? { ...item, constitution: event.target.value } : item))} value={party.constitution ?? ""} /></label>
          <label>Registered address<textarea onChange={(event) => onChange(parties.map((item, itemIndex) => itemIndex === index ? { ...item, address: event.target.value } : item))} rows={3} value={party.address} /></label>
        </div>
      ))}
    </div>
  );
}
