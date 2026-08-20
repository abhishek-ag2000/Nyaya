import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import TodayMatters from "@/components/workspaces/TodayMatters";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Today’s Matters",
  "Listed hearings for cases in your signed-in Nyaya workspace, with court, courtroom and time. This is not the public daily cause list.",
  "/today"
);

export default function Today() { return <><Disclaimer /><Header /><TodayMatters /><Footer /></>; }
