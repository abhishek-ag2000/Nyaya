"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadDemoCase } from "@/data/demo-case-store";
import type { UnifiedCase } from "@/data/unified-case";

function dateLabel(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)); }

export default function DocumentDetailPanel({ caseId, documentId, initialCase }: { caseId: string; documentId: string; initialCase?: UnifiedCase }) {
  const [caseData, setCaseData] = useState(initialCase);
  useEffect(() => { if (initialCase) setCaseData(loadDemoCase(caseId, initialCase)); }, [caseId, initialCase]);
  const document = caseData?.documents.find((item) => item.id === documentId);
  if (!caseData) return <main className="wrap static-page"><p className="kicker">No local case</p><h1>We couldn&apos;t open this demo case.</h1><Link className="outline-cta" href={`/cases/${caseId}`}>Return to case →</Link></main>;
  if (!document) return <main className="wrap static-page"><p className="kicker">Loading local document</p><h1>Checking this synthetic case record…</h1><p>If this document is not available after the demo state loads, it may have been reset.</p><Link className="outline-cta" href={`/cases/${caseId}`}>Return to case →</Link></main>;
  return <main className="wrap document-detail"><Link className="back-link" href={`/cases/${caseData.id}`}>← Back to case</Link><span className="demo-pill">Synthetic document</span><p className="kicker">Document</p><h1>{document.title}</h1><p className="document-detail-intro">This is a local prototype record, not an official court document.</p><dl className="document-meta"><div><dt>Type</dt><dd>{document.category}</dd></div><div><dt>Added</dt><dd><time dateTime={document.date}>{dateLabel(document.date)}</time></dd></div><div><dt>Pages</dt><dd>{document.pages}</dd></div><div><dt>Uploaded by</dt><dd><span className="uploaded-by">{document.addedBy}</span></dd></div></dl>{document.processing && <section className="document-processing"><span className="eyebrow">Processing</span><dl><div><dt>Record state</dt><dd>{document.processing.status.replace("-", " ")}</dd></div><div><dt>Classification</dt><dd>{document.processing.classification}</dd></div></dl><p><strong>AI-assisted classification</strong><br />Human review available. This demonstration does not use an AI service or verify the document.</p></section>}{document.warnings?.length ? <section className="intake-warnings"><b>{document.warnings.length} items need review</b><ul>{document.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></section> : null}{document.extractedText && <section className="synthetic-extract" id="extracted-text"><span className="eyebrow">Synthetic extracted text</span><p>{document.extractedText}</p></section>}<Link className="small-action" href="#extracted-text">View extracted text ↓</Link></main>;
}
