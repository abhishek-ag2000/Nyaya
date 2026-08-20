import { Suspense } from "react";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import HearingsPage from "@/components/hearings/HearingsPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Hearings",
  "View today’s court hearings, track listed matters and join virtual proceedings where available on Nyaya.",
  "/hearings"
);

export default function HearingsRoute() {
  return (
    <>
      <Disclaimer />
      <Header />
      <Suspense fallback={<main className="wrap workspace-loading">Loading hearings…</main>}>
        <HearingsPage />
      </Suspense>
      <Footer />
    </>
  );
}
