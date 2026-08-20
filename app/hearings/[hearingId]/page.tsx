import { notFound } from "next/navigation";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import HearingRoom from "@/components/hearings/HearingRoom";
import { getAllHearings, getHearingById } from "@/data/hearings";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllHearings().map((hearing) => ({ hearingId: hearing.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ hearingId: string }> }) {
  const { hearingId } = await params;
  const hearing = getHearingById(decodeURIComponent(hearingId));
  if (!hearing) return createPageMetadata("Hearing", "Virtual hearing room on Nyaya.", "/hearings");
  return createPageMetadata(
    `${hearing.caseNumber} · Hearing`,
    `Virtual courtroom view for ${hearing.caseTitle}.`,
    `/hearings/${hearing.id}`
  );
}

export default async function HearingRoomPage({ params }: { params: Promise<{ hearingId: string }> }) {
  const { hearingId } = await params;
  const hearing = getHearingById(decodeURIComponent(hearingId));
  if (!hearing) notFound();
  return (
    <>
      <Disclaimer />
      <Header />
      <HearingRoom hearing={hearing} />
      <Footer />
    </>
  );
}
