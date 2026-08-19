"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockRole } from "@/data/mock-session";
import { roleHome } from "@/data/roles";

export default function RoleHomeRedirect() { const router = useRouter(); const [ready, setReady] = useState(false); useEffect(() => { const role = getMockRole(); router.replace(role ? roleHome(role) : "/login"); setReady(true); }, [router]); return <main className="wrap workspace-loading">{ready ? "Opening your local prototype workspace…" : "Loading local prototype workspace…"}</main>; }
