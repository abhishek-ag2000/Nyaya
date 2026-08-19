import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import DocumentDetailPanel from "@/components/cases/DocumentDetailPanel";
import { getUnifiedCase } from "@/data/unified-case";

export default function DocumentDetailPage({ params }: { params: { id: string; documentId: string } }) {
  const caseId = decodeURIComponent(params.id);
  return <><Disclaimer /><Header /><DocumentDetailPanel caseId={caseId} documentId={decodeURIComponent(params.documentId)} initialCase={getUnifiedCase(caseId)} /><Footer /></>;
}
