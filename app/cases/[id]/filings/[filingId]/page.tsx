import Link from "next/link";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { getUnifiedCase } from "@/data/unified-case";

function dateLabel(date: string) { return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)); }

export default function FilingDetailPage({ params }: { params: { id: string; filingId: string } }) {
  const caseData = getUnifiedCase(decodeURIComponent(params.id));
  const filing = caseData?.filings.find((item) => item.id === decodeURIComponent(params.filingId));
  if (!caseData || !filing) return <><Disclaimer /><Header /><main className="wrap static-page"><p className="kicker">No local filing</p><h1>We couldn&apos;t find this demo filing.</h1><p>This prototype only opens filings bundled with its synthetic case data.</p><Link className="outline-cta" href={`/cases/${params.id}`}>Return to case →</Link></main><Footer /></>;
  const documents = filing.documentIds.map((documentId) => caseData.documents.find((document) => document.id === documentId)).filter(Boolean);
  return <><Disclaimer /><Header /><main className="wrap filing-detail"><Link className="back-link" href={`/cases/${caseData.id}`}>← Back to case</Link><span className="demo-pill">Synthetic filing</span><p className="kicker">Filing detail</p><h1>{filing.title}</h1><p className="filing-detail-summary">{filing.detail}</p><dl className="document-meta"><div><dt>Filing type</dt><dd>{filing.filingType}</dd></div><div><dt>Filed</dt><dd><time dateTime={filing.date}>{dateLabel(filing.date)}</time></dd></div><div><dt>Filed by</dt><dd>{filing.filedBy}</dd></div><div><dt>Procedural status</dt><dd>{filing.status}</dd></div></dl><section className="filing-decision"><span className="eyebrow">Prototype registry status</span><h2>{filing.status}</h2><p>{filing.statusDescription}</p><small>Updated <time dateTime={filing.statusUpdatedAt}>{dateLabel(filing.statusUpdatedAt)}</time> · No live court, authority, or registry decision is accessed or represented.</small></section><section className="filing-documents"><span className="eyebrow">Documents in this filing</span>{documents.length ? <ul>{documents.map((document) => document && <li key={document.id}><Link href={`/cases/${caseData.id}/documents/${document.id}`}><span>{document.title}<small className="uploaded-by">Uploaded by {document.addedBy}</small></span><Chevron /></Link></li>)}</ul> : <p>No synthetic documents are attached to this filing.</p>}</section><Link className="small-action" href={`/cases/${caseData.id}/filings/${filing.id}/readiness`}>Check filing readiness →</Link></main><Footer /></>;
}

function Chevron() { return <span aria-hidden="true">→</span>; }
