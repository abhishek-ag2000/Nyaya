"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearMockRole, getMockRole, setMockRole } from "@/data/mock-session";
import { roleConfig, roleHome, type Role } from "@/data/roles";
const roles: Role[] = ["citizen", "advocate", "judge", "registry", "stenographer", "police"];
export default function AuthControls() { const [role, setRole] = useState<Role | null>(null); useEffect(() => { const refresh = () => setRole(getMockRole()); refresh(); window.addEventListener("nyaya-mock-session", refresh); return () => window.removeEventListener("nyaya-mock-session", refresh); }, []); return role ? <details className="session-menu"><summary aria-label="Open mock account menu">{roleConfig[role].label}</summary><div><b>{roleConfig[role].workspace}</b><Link href="/profile">Profile</Link><span>Demo Role Switcher</span>{roles.map((item) => <button key={item} onClick={() => { setMockRole(item); window.location.assign(roleHome(item)); }}>{roleConfig[item].label}</button>)}<small>Local synthetic-session switcher only. It grants no real access.</small><button className="logout" onClick={() => clearMockRole()}>Log out</button></div></details> : <><Link className="signup-link" href="/signup">Sign up</Link><Link className="login" href="/login">Log in</Link></>; }
