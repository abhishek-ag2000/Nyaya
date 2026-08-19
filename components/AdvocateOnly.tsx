"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMockRole } from "@/data/mock-session";
export default function AdvocateOnly({children, action}:{children:React.ReactNode;action:string}){const [role,setRole]=useState<"advocate"|null>(null);useEffect(()=>{const refresh=()=>setRole(getMockRole()==="advocate"?"advocate":null);refresh();window.addEventListener("nyaya-mock-session",refresh);return()=>window.removeEventListener("nyaya-mock-session",refresh)},[]);if(role==="advocate")return <>{children}</>;return <main className="wrap static-page access-gate"><p className="kicker">Advocate workspace · mock access</p><h1>Advocate demo access required.</h1><p>{action} is available only when the synthetic Advocate role is selected. This is a local prototype access rule, not real professional verification.</p><Link className="login" href="/login">Log in as Advocate →</Link></main>}
