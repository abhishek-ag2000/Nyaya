import Link from "next/link";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import UnifiedCaseWorkspace from "@/components/cases/UnifiedCaseWorkspace";
import { getUnifiedCase } from "@/data/unified-case";
import { readOnlyDemoCases } from "@/data/user-cases";
export default async function CasePage({ params }: { params: Promise<{ id: string }> }) { const route = await params; const id = decodeURIComponent(route.id); const unified = getUnifiedCase(id) ?? readOnlyDemoCases.find((item) => item.id.toLowerCase() === id.toLowerCase()); return <><Disclaimer /><Header />{unified ? <UnifiedCaseWorkspace caseData={unified} /> : <main className="wrap static-page"><p className="kicker">Unified demo case</p><h1>This prototype opens one shared case workspace.</h1><p>Case search is routed to the bundled synthetic unified case only. No live records or alternate case pages are available.</p><Link className="outline-cta" href="/cases/NYA-WB-DEMO-04821">Open unified case →</Link></main>}<Footer /></>; }
