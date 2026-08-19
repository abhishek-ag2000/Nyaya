"use client";

const portals = ["District Court Services", "High Court Services", "eFiling", "NJDG", "Virtual Court", "ePay", "Judgment Search", "SMS Lookup", "eCourts App"];
export default function PortalUnifier() {
  return <div className="unifier" aria-label="Illustration: nine existing portal concepts unify in one case card">
    {portals.map((portal, index) => <span className={`portal-chip chip-${index + 1}`} key={portal}>{portal}</span>)}
    <div className="case-card"><span className="eyebrow">Unified case file</span><strong>NYOS-2026-DL-000482</strong><span className="case-status">● Listed for hearing</span><div className="card-line" /><small>One clear view of your case</small></div>
  </div>;
}
