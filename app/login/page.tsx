import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import Link from "next/link";
import DemoLogin from "@/components/DemoLogin";
import { ChevronRight, LogIn } from "lucide-react";

export default function Login() {
  return (
    <>
      <Disclaimer />
      <Header />
      <main className="wrap auth-page">
        <p className="kicker auth-kicker">
          <LogIn aria-hidden="true" />
          Mock access session
        </p>
        <h1>Welcome to Nyaya.</h1>
        <p className="auth-intro">One account. Your authorized access. This site does not collect, validate, or store any personal, identity, or contact information.</p>
        <DemoLogin />
        <p className="auth-switch">
          New here?{" "}
          <Link href="/signup">
            Create a mock role profile
            <ChevronRight aria-hidden="true" />
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
