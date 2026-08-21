import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import AuthControls from "@/components/AuthControls";
import PrimaryNav from "@/components/PrimaryNav";

export function Disclaimer({ home = false }: { home?: boolean }) {
  const text = home
    ? "Independent civic-tech prototype — not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data is synthetic."
    : "Independent civic-tech project — not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC.";
  return (
    <aside className="disclaimer" aria-label={home ? "Prototype disclaimer" : "Disclaimer"}>
      <div className="disclaimer-track">
        {Array.from({ length: 4 }, (_, index) => (
          <p aria-hidden={index > 0 ? true : undefined} key={index}>{text}</p>
        ))}
      </div>
    </aside>
  );
}

function Wordmark() {
  return (
    <Link className="wordmark" href="/">
      <img alt="" className="wordmark-mark" height={40} src="/nyaya-mark.svg" width={40} />
      <span>
        <b>Nyaya</b>
        <small>Digital Courts</small>
      </span>
    </Link>
  );
}

function currentDateLabel() {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date());
}

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Wordmark />
        <PrimaryNav>
          <span className="system-status"><i /> {currentDateLabel()}</span>
          <NotificationBell />
          <AuthControls />
        </PrimaryNav>
      </div>
    </header>
  );
}

export function Footer({ home = false }: { home?: boolean }) {
  return <footer><div className="wrap">
    <div className="footer-grid">
      <div><Wordmark /><p>{home ? "A prototype exploring a simpler digital experience for India\u2019s courts." : "A simpler digital experience for India\u2019s courts."}</p></div>
      <div><b>Services</b><Link href="/find-case">Case search</Link><Link href="/file-a-case">File a fresh case</Link><Link href="/hearings">Hearings</Link><Link href="/cause-list">Daily cause list</Link><Link href="/cases/NYA-WB-DEMO-04821?tab=Filed+documents">Documents</Link><Link href="/courts">Court services</Link></div>
      <div><b>Directories</b><Link href="/advocate-directory">Lawyers directory</Link><Link href="/judges-directory">Judges directory</Link><Link href="/courts">Court information</Link><Link href="/cause-list">Cause list</Link><Link href="/judgments">Judgments &amp; orders</Link></div>
      <div><b>Resources</b><Link href="/nyaya-guide">Nyaya Guide</Link><Link href="/about">About us</Link><Link href="/whats-mocked">What&apos;s mocked</Link><Link href="/sitemap">Sitemap</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms &amp; conditions</Link><Link href="/copyright">Copyright policy</Link><a href="https://ecommitteesci.gov.in/" target="_blank" rel="noreferrer">Public reference <span className="external">↗ external</span></a></div>
    </div>
    <section className="footer-app-panel" aria-label={home ? "Nyaya prototype companion app" : "Nyaya companion app"}><div><p className="eyebrow">{home ? "Prototype companion" : "Companion app"}</p><h2>Nyaya services app</h2><p>Mobile access is shown as a product concept only. No mobile app is available, and these are not store downloads.</p></div><div className="prototype-store-options" aria-label={home ? "Prototype platform concepts" : "Platform concepts"}><img alt="Android app on Google Play" className="store-badge" height={54} src="/google-play-badge.png" width={166} /><img alt="Download on the App Store" className="store-badge" height={54} src="/app-store-badge.png" width={166} /></div></section>
    <div className="footer-disclosure"><div><b>{home ? "Disclaimer · independent prototype" : "Disclaimer"}</b><p>{home ? "Nyaya is not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data, case records, identities, statistics, and court activity shown are synthetic or illustrative. No live government or court systems are accessed, connected, or updated through this site." : "Nyaya is not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data, case records, identities, statistics, and court activity shown are illustrative. No live government or court systems are accessed, connected, or updated through this site."}</p></div><small>{home ? "© 2026 Nyaya Prototype" : "© 2026 Nyaya"}</small></div>
  </div></footer>;
}
