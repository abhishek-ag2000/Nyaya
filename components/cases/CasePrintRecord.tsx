import type { UnifiedCase } from "@/data/unified-case";
import { buildCaseExportSections } from "@/lib/case-export";

export default function CasePrintRecord({ caseData }: { caseData: UnifiedCase }) {
  const sections = buildCaseExportSections(caseData);
  return (
    <article className="case-print-record" aria-hidden="true">
      <header>
        <p className="case-print-kicker">Nyaya · demo case record</p>
        <h1>{caseData.title}</h1>
        <p>
          <code>{caseData.id}</code> · {caseData.caseType}
        </p>
        <p className="case-print-note">Not a certified copy. Illustrative synthetic data only.</p>
      </header>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <ul>
            {section.lines.map((line) => (
              <li key={`${section.heading}-${line}`}>{line}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
