import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import DocumentUploadFlow from "@/components/cases/DocumentUploadFlow";
import { getUnifiedCase } from "@/data/unified-case";
import AdvocateOnly from "@/components/AdvocateOnly";

export default function UploadDocumentPage({ params }: { params: { id: string } }) {
  const caseData = getUnifiedCase(decodeURIComponent(params.id));
  if (!caseData) return <><Disclaimer /><Header /><main className="wrap static-page"><p className="kicker">No local case</p><h1>We couldn&apos;t open this demo case.</h1><p>This document intake prototype only works with bundled synthetic case data.</p></main><Footer /></>;
  return <><Disclaimer /><Header /><AdvocateOnly action="Document upload"><DocumentUploadFlow caseData={caseData} /></AdvocateOnly><Footer /></>;
}
