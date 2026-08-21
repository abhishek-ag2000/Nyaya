import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { IdentityVerifiedBadge, ProfileChips, toLinkedCaseItems } from "@/components/directory/PublicProfileShared";
import { LinkedCasesPanel } from "@/components/directory/LinkedCasesPanel";
import { syntheticAdvocates } from "@/data/synthetic-advocates";
import { getUserCases } from "@/data/user-cases";
import { createPageMetadata } from "@/lib/seo";

const currentYear = 2026;

export function generateStaticParams() {
  return syntheticAdvocates.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = syntheticAdvocates.find((item) => item.id === id);
  if (!profile) return createPageMetadata("Lawyer profile", "Lawyer profile on Nyaya.", "/advocate-directory");
  return createPageMetadata(`${profile.displayName} · Lawyers directory`, `Public profile for ${profile.displayName} at ${profile.court}.`, `/advocate-directory/${profile.id}`);
}

export default async function AdvocateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileIndex = syntheticAdvocates.findIndex((item) => item.id === id);
  if (profileIndex < 0) notFound();
  const profile = syntheticAdvocates[profileIndex];
  const cases = getUserCases();
  const linked = toLinkedCaseItems(profile.caseIds, cases, profile.caseRoles);
  const portrait = (profileIndex % 6) + 1;
  const yearsPracticing = currentYear - profile.practicingSince;

  return <>
    <Disclaimer />
    <Header />
    <main className="wrap directory-profile-page">
      <BackLink className="profile-back-link" href="/advocate-directory">Back to lawyers directory</BackLink>

      <div className="directory-profile-top">
      <section className="directory-profile-hero">
        <div className={`profile-portrait profile-portrait-large lawyer-portrait portrait-${portrait}`} role="img" aria-label={`Portrait for ${profile.displayName}`} />
        <div className="profile-hero-copy">
          <p className="kicker">Public advocate profile</p>
          <h1>{profile.displayName}</h1>
          <p className="profile-synthetic-label">{profile.syntheticLabel}</p>
          <p className="profile-hero-role">Bar enrolment <code>{profile.barEnrollmentId}</code></p>
          <p className="profile-hero-court">{profile.court}</p>
          <p className="profile-hero-place">{profile.district}, {profile.state}</p>
          {profile.identityVerified && <IdentityVerifiedBadge />}
        </div>
      </section>

      <section className="profile-facts advocate-profile-facts" aria-label="Practice details">
          <div><span>Years practicing</span><b>{`${yearsPracticing} years`}</b><small>Since {profile.practicingSince} (illustrative)</small></div>
        <div className="profile-fact-chips"><span>Practice areas</span><ProfileChips items={profile.practiceAreas} label="Practice areas" /></div>
        <div className="profile-fact-chips"><span>Languages</span><ProfileChips items={profile.languages} label="Languages" /></div>
      </section>
      </div>

      <section className="profile-panel">
        <LinkedCasesPanel items={linked} empty="No bundled cases are linked to this profile." roleLabel />
      </section>
    </main>
    <Footer />
  </>;
}
