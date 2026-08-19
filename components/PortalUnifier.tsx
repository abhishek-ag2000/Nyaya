"use client";
import { motion, useReducedMotion } from "framer-motion";

const portals = ["District Court Services", "High Court Services", "eFiling", "NJDG", "Virtual Court", "ePay", "Judgment Search", "SMS Lookup", "eCourts App"];
export default function PortalUnifier() {
  const reduceMotion = useReducedMotion();
  return <div className="unifier" aria-label="Illustration: nine existing portal concepts unify in one case card">
    {portals.map((portal, index) => <motion.span className={`portal-chip chip-${index + 1}`} key={portal} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduceMotion ? 0 : index * 0.07, duration: 0.45 }}>{portal}</motion.span>)}
    <motion.div className="case-card" initial={reduceMotion ? false : { opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : .35, duration: .5 }}><span className="eyebrow">Unified case file</span><strong>NYA-WB-DEMO-04821</strong><span className="case-status">● Hearing scheduled</span><div className="card-line" /><small>One clear view of your case</small></motion.div>
  </div>;
}
