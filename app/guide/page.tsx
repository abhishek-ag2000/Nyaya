import Link from "next/link";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";

const topics = [
  ["What happens at a hearing?", "/nyaya-guide/what-happens-during-a-hearing"],
  ["What does the case stage mean?", "/nyaya-guide/what-happens-after-filing"],
  ["How do court documents work?", "/nyaya-guide/how-certified-copies-work"],
  ["What can I prepare before a hearing?", "/visit-court"]
];

export default function GuidePage() {
  return <><Disclaimer /><Header /><main className="guide-page">
    <section className="wrap guide-hero"><p className="kicker">Nyaya Guide</p><h1>Understand the process.<br /><em>Not just the status.</em></h1><p>Plain-language, educational prototype guidance for navigating common court concepts. It is not legal advice and never replaces a lawyer or court record.</p><div className="guide-search">⌕ <span>What do you want to understand?</span></div></section>
    <section className="wrap guide-topics"><h2>Start with a question</h2><div>{topics.map(([topic, href]) => <Link key={topic} href={href}>{topic}<span>→</span></Link>)}</div></section>
    <section className="guide-note"><div className="wrap"><p className="kicker">Contextual learning</p><h2>Information that meets you at the right stage.</h2><p>When viewing a synthetic case, Nyaya can point to relevant explanations like “What happens during a hearing?” or “What does this stage mean?” All learning content in this prototype is designed-only.</p><Link className="outline-cta" href="/cases/NYA-WB-DEMO-04821">View the unified demo case <span>→</span></Link></div></section>
  </main><Footer /></>;
}
