import type { ReadinessRule } from "@/lib/filing-readiness";

export default function FilingReadinessChecker({ rules }: { rules: ReadinessRule[] }) {
  const passed = rules.filter((rule) => rule.passed).length;
  const ordered = [...rules].sort((a, b) => Number(a.passed) - Number(b.passed));
  return <section className="readiness-checker">
    <p className="quiet-summary readiness-lead"><b>{passed} of {rules.length}</b> structural checks complete</p>
    <p>These checks look only at whether the draft is structurally complete. They are not a legal-merits judgment, registry decision, or prediction of success.</p>
    <ol className="readiness-list">
      {ordered.map((rule) => <li className={rule.passed ? "ready" : "open"} key={rule.id}>
        <b>{rule.passed ? "Ready" : "Needed"} · {rule.label}</b>
        <span>{rule.detail}</span>
      </li>)}
    </ol>
  </section>;
}
