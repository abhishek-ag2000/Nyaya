import AdvocateDirectory from "@/components/AdvocateDirectory"; import { Disclaimer, Footer, Header } from "@/components/SiteChrome"; import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata("Lawyers Directory", "Browse fictional lawyer profiles by district, court, and practice area in this clearly labeled digital-courts prototype.", "/advocate-directory");
export default function Page(){return <><Disclaimer/><Header/><AdvocateDirectory/><Footer/></>}
