"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
export default function PrimaryNav() { const [role, setRole] = useState<Role | null>(null); useEffect(() => { const refresh = () => setRole(getMockRole()); refresh(); window.addEventListener("nyaya-mock-session", refresh); return () => window.removeEventListener("nyaya-mock-session", refresh); }, []); return <div className="nav-stack"><nav aria-label="Primary navigation" className="public-nav"><Link href="/nyaya-guide">Nyaya Guide</Link><Link href="/find-case">Find a case</Link><Link href="/advocate-directory">Lawyers Directory</Link><Link href="/judges-directory">Judges Directory</Link><Link href="/about">About Us</Link></nav>{role && <nav aria-label="Signed-in workspace navigation" className="workspace-nav"><span>{roleConfig[role].workspace}</span>{roleConfig[role].navigation.slice(0, 4).map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}</nav>}</div>; }
