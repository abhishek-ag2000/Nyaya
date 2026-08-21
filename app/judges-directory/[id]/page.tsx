import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { IdentityVerifiedBadge, dateLabel, toLinkedCaseItems } from "@/components/directory/PublicProfileShared";
import { LinkedCasesPanel } from "@/components/directory/LinkedCasesPanel";
import { syntheticJudges } from "@/data/synthetic-judges";
import { getUserCases } from "@/data/user-cases";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return syntheticJudges.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = syntheticJudges.find((item) => item.id === id);
  if (!profile) return createPageMetadata("Judge profile", "Judge profile on Nyaya.", "/judges-directory");
  return createPageMetadata(`${profile.displayName} · Judges directory`, `Public profile for ${profile.displayName} at ${profile.court}.`, `/judges-directory/${profile.id}`);
}

export default async function JudgeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileIndex = syntheticJudges.findIndex((item) => item.id === id);
  if (profileIndex < 0) notFound();
  const profile = syntheticJudges[profileIndex];
  const cases = getUserCases();
  const linked = toLinkedCaseItems(profile.caseIds, cases);
  const portrait = (profileIndex % 6) + 1;
  const orders = [...profile.caseHistory].sort((a, b) => b.date.localeCompare(a.date) || a.caseId.localeCompare(b.caseId));

  return <>
    <Disclaimer />
    <Header />
    <main className="wrap directory-profile-page">
      <BackLink className="profile-back-link" href="/judges-directory">Back to judges directory</BackLink>

      <div className="directory-profile-top">
      <section className="directory-profile-hero">
        <div className={`profile-portrait profile-portrait-large judge-portrait portrait-${portrait}`} role="img" aria-label={`Portrait for ${profile.displayName}`} />
        <div className="profile-hero-copy">
          <p className="kicker">Public judicial profile</p>
          <h1>{profile.displayName}</h1>
          <p className="profile-synthetic-label">{profile.syntheticLabel}</p>
          <p className="profile-hero-role">{profile.designation}</p>
          <p className="profile-hero-court">{profile.court}</p>
          <p className="profile-hero-place">{profile.district}, {profile.state}</p>
          {profile.identityVerified && <IdentityVerifiedBadge />}
        </div>
      </section>

      <section className="profile-facts" aria-label="Court posting">
        <div><span>Jurisdiction</span><b>{profile.jurisdiction.join(" · ")}</b></div>
        <div><span>Courtroom</span><b>{profile.courtroom}</b></div>
        <div><span>Sitting hours</span><b>{profile.sitting}</b></div>
        <div><span>Presiding since</span><b>{profile.appointedSince}</b></div>
      </section>
      </div>

      <section className="profile-contact-strip" aria-label="Public contact">
        <div><span>Registry office</span><b>{profile.contact.registryOffice}</b></div>
        <div><span>Enquiry telephone</span><b>{profile.contact.publicEnquiryPhone}</b></div>
        <p>{profile.contact.note}</p>
      </section>

      <section className="profile-panel">
        <LinkedCasesPanel items={linked} empty="No bundled cases are linked to this profile." />
      </section>

      <section className="profile-panel">
        <span className="eyebrow">Court record</span>
        <h2>Recent orders</h2>
        {orders.length ? <ol className="recent-orders">{orders.map((entry) => <li key={`${entry.caseId}-${entry.date}`}>
          <time dateTime={entry.date}>{dateLabel(entry.date)}</time>
          <div>
            <Link href={`/cases/${entry.caseId}`}>{entry.caseId}</Link>
            <p>{entry.summary}</p>
          </div>
        </li>)}</ol> : <p className="empty-state">No recent public orders are bundled for this profile.</p>}
      </section>
    </main>
    <Footer />
  </>;
}
