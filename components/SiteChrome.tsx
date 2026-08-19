import Link from "next/link";

export function Disclaimer() {
  return <aside className="disclaimer" aria-label="Prototype disclaimer">Independent civic-tech prototype — not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All data is synthetic.</aside>;
}

export function Header() {
  return <header className="site-header"><div className="wrap header-inner">
    <Link className="wordmark" href="/"><span lang="hi">न्याय</span> <b>Nyaya</b></Link>
    <nav aria-label="Primary navigation"><Link href="/#services">Services</Link><Link href="/#court-data">Court data</Link><Link href="/about">Resources</Link></nav>
    <div className="header-actions"><Link className="login" href="/login">Sign in</Link><span className="language" aria-label="Language: English">EN⌄</span></div>
  </div></header>;
}

export function Footer() {
  return <footer><div className="wrap footer-inner"><p>Nyaya Unified Interface is an independent civic-tech hackathon prototype. It is not affiliated with or endorsed by the Government of India, e-Committee, Supreme Court of India, or NIC. All cases, people, identifiers, dates, documents, and statistics shown here are synthetic or illustrative.</p><div><Link href="/about">About</Link><Link href="/whats-mocked">What&apos;s mocked</Link><a href="https://ecommitteesci.gov.in/" target="_blank" rel="noreferrer">Public reference <span className="external">↗ external</span></a></div></div></footer>;
}
