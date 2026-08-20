import { Suspense } from "react";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import AdvocateOnly from "@/components/AdvocateOnly";
import FilingSuccess from "@/components/filing/FilingSuccess";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Filing recorded",
  "Local filing receipt with a transaction ID you can use to track the matter on Nyaya. Nothing is submitted to any court.",
  "/file-a-case/success"
);

export default function FilingSuccessPage() {
  return <>
    <Disclaimer />
    <Header />
    <AdvocateOnly action="Viewing a filing receipt">
      <Suspense fallback={<main className="filing-success"><p className="filing-success-loading">Loading receipt…</p></main>}>
        <FilingSuccess />
      </Suspense>
    </AdvocateOnly>
    <Footer />
  </>;
}
