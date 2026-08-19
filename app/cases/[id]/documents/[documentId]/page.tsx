import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import DocumentDetailPanel from "@/components/cases/DocumentDetailPanel";
import { getUnifiedCase } from "@/data/unified-case";

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string; documentId: string }> }) {
  const { id, documentId } = await params;
  const caseId = decodeURIComponent(id);
  return <><Disclaimer /><Header /><DocumentDetailPanel caseId={caseId} documentId={decodeURIComponent(documentId)} initialCase={getUnifiedCase(caseId)} /><Footer /></>;
}
