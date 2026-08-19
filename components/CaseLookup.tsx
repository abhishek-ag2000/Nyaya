"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CaseLookup() {
  const [id, setId] = useState("NYOS-2026-DL-000482"); const router = useRouter();
  function submit(event: FormEvent) { event.preventDefault(); router.push(`/cases/${encodeURIComponent(id.trim() || "NYOS-2026-DL-000482")}`); }
  return <form className="lookup" onSubmit={submit}><label htmlFor="case-id">CNR / unified case ID <span>synthetic demo</span></label><div><input id="case-id" value={id} onChange={(event) => setId(event.target.value)} aria-describedby="case-help" /><button type="submit">Track case <span aria-hidden="true">→</span></button></div><p id="case-help">Try the pre-filled demonstration ID. No live court systems are queried.</p></form>;
}
