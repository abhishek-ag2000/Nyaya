"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { demoUnifiedCase } from "@/data/unified-case";

export default function CaseLookup() {
  const [query, setQuery] = useState(""); const router = useRouter();
  function submit(event: FormEvent) { event.preventDefault(); router.push(`/cases/${demoUnifiedCase.id}`); }
  return <form className="lookup" onSubmit={submit}><label htmlFor="case-id">Search by case number, CNR, party or advocate <span>synthetic demo</span></label><div><input id="case-id" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. NYA-WB-DEMO-04821" aria-describedby="case-help" /><button type="submit">Search your case <span aria-hidden="true">→</span></button></div><p id="case-help">Searches only local synthetic data. No sign-in or live court system is used.</p><details className="search-help"><summary>Need help searching?</summary><ul><li>Enter the 16 digit alphanumeric CNR Number without any hyphen or space.</li><li>Click Search to view the current status and history of the case.</li><li>If you don&apos;t know the CNR number, search using a case registration number, party name, or advocate name instead.</li></ul><p>For this prototype, use only the synthetic demo case details shown on this site.</p></details></form>;
}
