import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import Link from "next/link";
import DemoLogin from "@/components/DemoLogin";
export default function Login() { return <><Disclaimer /><Header /><main className="wrap auth-page"><p className="kicker">Mock access session</p><h1>Welcome to Nyaya.</h1><p className="auth-intro">One account. Your authorized access. This prototype does not collect, validate, or store any personal, identity, or contact information.</p><DemoLogin /><p className="auth-switch">New to the prototype? <Link href="/signup">Create a mock role profile →</Link></p></main><Footer /></>; }
