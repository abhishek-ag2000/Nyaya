import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import AdvocateOnly from "@/components/AdvocateOnly";
import FreshCaseFiling from "@/components/filing/FreshCaseFiling";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "File a fresh case",
  "9-step Filing Wizard for district-court practice: classify the matter, choose forum, draft parties, facts and prayers, then assemble a plaint. Nothing is submitted to any court.",
  "/file-a-case"
);

export default function FileACasePage() {
  return <>
    <Disclaimer />
    <Header />
    <AdvocateOnly action="Starting a fresh case">
      <FreshCaseFiling />
    </AdvocateOnly>
    <Footer />
  </>;
}
