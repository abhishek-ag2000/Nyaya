import { Suspense } from "react";
import { CauseList } from "@/components/operations/CourtOperations";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Daily Cause List",
  "Select a state, district and court complex to view an illustrative daily cause list on Nyaya.",
  "/cause-list"
);

export default function CauseListPage() {
  return (
    <>
      <Disclaimer />
      <Header />
      <Suspense fallback={<main className="wrap operations-page"><p>Loading daily cause list…</p></main>}>
        <CauseList />
      </Suspense>
      <Footer />
    </>
  );
}
