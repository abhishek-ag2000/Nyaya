import Link from "next/link";

export default function ComingSoon({
  title,
  description,
  backHref,
  backLabel = "Return to case →"
}: {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <main className="wrap static-page">
      <span className="prototype-badge">Coming soon on this site</span>
      <p className="kicker">Designed workflow</p>
      <h1>{title}</h1>
      <p>{description ?? "This action is shown so the case workspace can be complete. It does not submit information to a court or create a real record."}</p>
      <p><Link className="outline-cta" href={backHref}>{backLabel}</Link></p>
    </main>
  );
}
