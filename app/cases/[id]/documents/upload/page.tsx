import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import DocumentUploadFlow from "@/components/cases/DocumentUploadFlow";
import AdvocateOnly from "@/components/AdvocateOnly";
import { resolveBundledCase } from "@/data/user-cases";

export default async function UploadDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseData = resolveBundledCase(decodeURIComponent(id));
  if (!caseData) return <><Disclaimer /><Header /><main className="wrap static-page"><p className="kicker">No local case</p><h1>We couldn&apos;t open this demo case.</h1><p>This document intake only works with bundled case data.</p></main><Footer /></>;
  return <><Disclaimer /><Header /><AdvocateOnly action="Document upload"><DocumentUploadFlow caseData={caseData} /></AdvocateOnly><Footer /></>;
}
