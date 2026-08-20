import { Suspense } from "react";
import MyCasesList from "@/components/cases/MyCasesList";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";

export default function MyCasesPage() {
  return <>
    <Disclaimer />
    <Header />
    <Suspense fallback={<main className="wrap cases-page"><p>Loading cases…</p></main>}>
      <MyCasesList />
    </Suspense>
    <Footer />
  </>;
}
