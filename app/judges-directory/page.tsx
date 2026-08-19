import JudgesDirectory from "@/components/JudgesDirectory";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("Judges Directory", "Browse fictional judicial profiles by state, district, court, designation, and jurisdiction in this clearly labeled digital-courts prototype.", "/judges-directory");

export default function Page() {
  return <><Disclaimer /><Header /><JudgesDirectory /><Footer /></>;
}
