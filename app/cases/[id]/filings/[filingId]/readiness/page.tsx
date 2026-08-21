import Link from "next/link";
import FilingReadinessChecker from "@/components/filing/FilingReadinessChecker";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { resolveBundledCase } from "@/data/user-cases";
import { rulesFromCaseFiling } from "@/lib/filing-readiness";

export default async function FilingReadinessPage({ params }: { params: Promise<{ id: string; filingId: string }> }) {
  const { id, filingId } = await params;
  const caseId = decodeURIComponent(id);
  const filingKey = decodeURIComponent(filingId);
  const caseData = resolveBundledCase(caseId);
  const filing = caseData?.filings.find((item) => item.id === filingKey);
  const rules = caseData && filing ? rulesFromCaseFiling(caseData, filing) : [];

  return (
    <>
      <Disclaimer />
      <Header />
      <main className="wrap static-page">
        <p className="kicker">filing readiness</p>
        <h1>{filing ? `Readiness for ${filing.title}` : "Filing Readiness Checker"}</h1>
        {caseData && filing ? (
          <FilingReadinessChecker rules={rules} />
        ) : (
          <p>No filing was found for this identifier. Bundled demo cases and filings created in this browser remain available.</p>
        )}
        <Link className="outline-cta" href={filing ? `/cases/${caseId}/filings/${filing.id}` : `/cases/${caseId}`}>
          Return to filing →
        </Link>
      </main>
      <Footer />
    </>
  );
}
