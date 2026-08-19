import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { syntheticJudges } from "@/data/synthetic-judges";
import { getUserCases } from "@/data/user-cases";

export function generateStaticParams() {
  return syntheticJudges.map(({ id }) => ({ id }));
}

export default function JudgeProfilePage({ params }: { params: { id: string } }) {
  const profileIndex = syntheticJudges.findIndex((item) => item.id === params.id);
  if (profileIndex < 0) notFound();
  const profile = syntheticJudges[profileIndex];
  const cases = getUserCases().filter((item) => profile.caseIds.includes(item.id));

  return <><Disclaimer /><Header /><main className="wrap directory-profile-page">
    <Link className="profile-back-link" href="/judges-directory">← Back to judges directory</Link>
    <section className="directory-profile-hero">
      <div className={`profile-portrait profile-portrait-large judge-portrait portrait-${profileIndex + 1}`} role="img" aria-label={`Synthetic portrait for ${profile.name}`} />
      <div><span className="demo-pill">synthetic judicial profile</span><p className="kicker">Judge profile</p><h1>{profile.name}</h1><p>{profile.designation}</p></div>
    </section>
    <section className="profile-facts" aria-label="Judicial profile details">
      <div><span>District</span><b>{profile.district}, {profile.state}</b></div><div><span>Court</span><b>{profile.court}</b></div><div><span>Jurisdiction</span><b>{profile.jurisdiction.join(" · ")}</b></div><div><span>Courtroom / sitting</span><b>{profile.courtroom} · {profile.sitting}</b></div>
    </section>
    <section className="linked-cases-page"><div><span className="eyebrow">Linked synthetic cases</span><h2>Cases assigned to this judge</h2><p>Illustrative case links for this fictional judicial profile.</p></div>
      <div className="linked-case-list">{cases.map((item) => <Link href={`/cases/${item.id}`} key={item.id}><div><b>{item.title}</b><p>{item.id} · {item.caseType} · {item.court.name}</p></div><span>{item.stage.current} →</span></Link>)}{!cases.length && <p className="empty-state">No bundled cases are linked to this profile.</p>}</div>
    </section>
  </main><Footer /></>;
}
