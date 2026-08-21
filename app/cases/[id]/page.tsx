import { Suspense } from "react";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import CaseWorkspaceLoader from "@/components/cases/CaseWorkspaceLoader";
import { resolveBundledCase } from "@/data/user-cases";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const route = await params;
  const id = decodeURIComponent(route.id);
  return <><Disclaimer /><Header /><Suspense fallback={<main className="wrap workspace-loading">Loading the case workspace…</main>}><CaseWorkspaceLoader caseId={id} initialCase={resolveBundledCase(id)} /></Suspense><Footer /></>;
}
