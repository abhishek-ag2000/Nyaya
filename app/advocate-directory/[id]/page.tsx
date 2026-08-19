import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { syntheticAdvocates } from "@/data/synthetic-advocates";
import { getUserCases } from "@/data/user-cases";

export function generateStaticParams() {
  return syntheticAdvocates.map(({ id }) => ({ id }));
}

export default async function AdvocateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profileIndex = syntheticAdvocates.findIndex((item) => item.id === id);
  if (profileIndex < 0) notFound();
  const profile = syntheticAdvocates[profileIndex];
  const cases = getUserCases().filter((item) => profile.caseIds.includes(item.id));

  return <><Disclaimer /><Header /><main className="wrap directory-profile-page">
    <Link className="profile-back-link" href="/advocate-directory">← Back to lawyers directory</Link>
    <section className="directory-profile-hero">
      <div className={`profile-portrait profile-portrait-large lawyer-portrait portrait-${profileIndex + 1}`} role="img" aria-label={`Synthetic portrait for ${profile.name}`} />
      <div><span className="demo-pill">synthetic professional profile</span><p className="kicker">Lawyer profile</p><h1>{profile.name}</h1><p>{profile.practiceAreas.join(" · ")}</p></div>
    </section>
    <section className="profile-facts" aria-label="Professional profile details">
      <div><span>District</span><b>{profile.district}</b></div><div><span>Court</span><b>{profile.court}</b></div><div><span>Registration</span><b>{profile.registrationStatus}</b></div><div><span>Document review</span><b>{profile.documentReview}</b></div>
    </section>
    <section className="linked-cases-page"><div><span className="eyebrow">Linked synthetic cases</span><h2>Cases under selected counsel</h2><p>Illustrative case links for this fictional profile.</p></div>
      <div className="linked-case-list">{cases.map((item) => <Link href={`/cases/${item.id}`} key={item.id}><div><b>{item.title}</b><p>{item.id} · {item.caseType} · {item.court.name}</p></div><span>{item.stage.current} →</span></Link>)}{!cases.length && <p className="empty-state">No bundled cases are linked to this profile.</p>}</div>
    </section>
  </main><Footer /></>;
}
