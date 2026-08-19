"use client";
import { useRouter } from "next/navigation";
import { setMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";
const roles: Role[] = ["citizen", "advocate", "judge", "registry", "stenographer", "police"];
export default function DemoLogin() { const router = useRouter(); return <section className="auth-card"><h2>Open a demo session</h2><p>Select a preconfigured, synthetic role. No authentication code, identity number, or external system is used.</p><div className="demo-role-links">{roles.map((role) => <button key={role} onClick={() => { setMockRole(role); router.push(roleHome(role)); }}>{roleConfig[role].label}<span>→</span></button>)}</div></section>; }
