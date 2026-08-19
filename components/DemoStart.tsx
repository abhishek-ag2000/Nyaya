"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetNyayaDemo } from "@/data/demo-case-store";
export default function DemoStart(){const [confirm,setConfirm]=useState(false);const router=useRouter();return <main className="wrap demo-start"><p className="kicker">Developer/demo control</p><h1>Nyaya demo</h1><p>Restore the bundled synthetic case, events, documents, filings, actions, and notifications before a replay.</p>{!confirm?<button className="login" onClick={()=>setConfirm(true)}>Reset &amp; start demo</button>:<section><p><b>Reset Nyaya demo to its starting state?</b></p><button className="outline-cta" onClick={()=>setConfirm(false)}>Cancel</button><button className="login" onClick={()=>{resetNyayaDemo();router.push("/")}}>Reset demo</button></section>}</main>}
