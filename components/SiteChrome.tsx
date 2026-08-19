import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import AuthControls from "@/components/AuthControls";
import PrimaryNav from "@/components/PrimaryNav";
import { Orbit, Smartphone, UserRound } from "lucide-react";

export function Disclaimer() {
  return <aside className="disclaimer" aria-label="Prototype disclaimer">Independent civic-tech prototype — not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data is synthetic.</aside>;
}

export function Header() {
  return <header className="site-header"><div className="wrap header-inner">
    <Link className="wordmark" href="/"><span className="wordmark-orbit"><Orbit aria-hidden="true" /></span><span><b>Nyaya</b><small>Digital Courts</small></span></Link>
    <PrimaryNav />
    <div className="header-actions"><span className="system-status"><i /> Prototype online</span><NotificationBell /><Link className="profile-link" href="/profile" aria-label="My profile"><UserRound aria-hidden="true" /></Link><AuthControls /></div>
  </div></header>;
}

export function Footer() {
  return <footer><div className="wrap"><div className="footer-grid"><div><Link className="wordmark" href="/"><span lang="hi">न्याय</span> <b>Nyaya</b></Link><p>A prototype exploring a simpler digital experience for India&apos;s courts.</p></div><div><b>Services</b><Link href="/#track">Case search</Link><Link href="/file-a-case">File a fresh case</Link><Link href="/whats-mocked">Hearings</Link><Link href="/cases/NYA-WB-DEMO-04821">Documents</Link><Link href="/#services">Court services</Link></div><div><b>Court data</b><Link href="/#court-data">India overview</Link><Link href="/#court-data">States &amp; UTs</Link><Link href="/#court-data">Districts</Link><Link href="/#court-data">Courts</Link></div><div><b>Resources</b><Link href="/about">About us</Link><Link href="/whats-mocked">What&apos;s mocked</Link><Link href="/sitemap">Sitemap</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms &amp; conditions</Link><Link href="/copyright">Copyright policy</Link><a href="https://ecommitteesci.gov.in/" target="_blank" rel="noreferrer">Public reference <span className="external">↗ external</span></a></div></div><section className="footer-app-panel" aria-label="Nyaya prototype companion app"><div><p className="eyebrow">Prototype companion</p><h2>Nyaya services app</h2><p>Mobile access is shown as a product concept only. No mobile app is available, and these are not store downloads.</p></div><div className="prototype-store-options" aria-label="Prototype platform concepts"><span><Smartphone aria-hidden="true" /><b>Android</b><small>concept only</small></span><span><Smartphone aria-hidden="true" /><b>iOS</b><small>concept only</small></span></div></section><div className="footer-disclosure"><div><b>Disclaimer · independent prototype</b><p>Nyaya is not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data, case records, identities, statistics, and court activity shown are synthetic or illustrative. No live government or court systems are accessed, connected, or updated through this site.</p></div><small>© 2026 Nyaya Prototype</small></div></div></footer>;
}
