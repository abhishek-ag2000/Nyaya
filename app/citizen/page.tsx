import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import RoleWorkspace from "@/components/workspaces/RoleWorkspace";
export default function CitizenPage() { return <><Disclaimer /><Header /><RoleWorkspace requiredRole="citizen" /><Footer /></>; }
