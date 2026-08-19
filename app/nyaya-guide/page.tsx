import { GuideIndex } from "@/components/tier-c/TierCSurfaces"; import { Disclaimer, Footer, Header } from "@/components/SiteChrome"; import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata("Nyaya Guide to Court Processes", "Understand filing, hearings, cause lists, court documents, judgments, appeals, and common legal procedures in plain language.", "/nyaya-guide");
export default function Page(){return <><Disclaimer/><Header/><GuideIndex/><Footer/></>}
