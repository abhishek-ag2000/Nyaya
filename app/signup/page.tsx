"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Disclaimer, Footer, Header } from "@/components/SiteChrome";
import { setMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";

const roles: Array<[Role, string, boolean]> = [["citizen", "Track a case, understand updates, and follow next steps.", false], ["advocate", "Manage matters, hearings, deadlines, and case documents.", true], ["judge", "View docket and readiness context. Decisions remain human.", true], ["registry", "Work with filing intake, scrutiny, and registration queues.", true], ["stenographer", "Review assigned proceedings and synthetic draft workflows.", true], ["police", "View authorised case-linkage and document-status workflows.", true]];
export default function Signup() {
  const router = useRouter();

  function selectRole(name: Role) {
    setMockRole(name);
    router.push(roleHome(name));
  }

  return <><Disclaimer /><Header /><main className="wrap auth-page">
    <p className="kicker">Role onboarding · mock only</p>
    <h1>Set up your Nyaya profile.</h1>
    <p className="auth-intro">Choose how you would primarily use Nyaya. Your synthetic local profile will open immediately—no form, real account, or verification is created.</p>
    <section className="role-select full-role-grid" aria-label="Choose a mock role">
      {roles.map(([name, description, requiresReview]) => <button type="button" onClick={() => selectRole(name)} key={name} aria-label={`Continue as ${roleConfig[name].label}`}>
        <span>{requiresReview ? "Authorised role · simulated" : "Public role"}</span>
        <b>{roleConfig[name].label}</b>
        <small>{description}</small>
        <strong>Sign up &amp; open dashboard →</strong>
      </button>)}
    </section>
    <p className="auth-switch">Already exploring? <Link href="/login">Open a demo session →</Link></p>
  </main><Footer /></>;
}
