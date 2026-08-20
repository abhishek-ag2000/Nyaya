"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";
import { loadCaseRecord } from "@/data/demo-case-store";

type Receipt = { caseId: string; txn: string; title: string; court: string; filedAt: string };

function readReceipt(caseId: string | null, txn: string | null): Receipt | null {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem("nyaya-filing-receipt");
      if (stored) {
        const parsed = JSON.parse(stored) as Receipt;
        if (parsed.txn && parsed.caseId) return parsed;
      }
    } catch { /* fall through */ }
  }
  if (!caseId || !txn) return null;
  const record = loadCaseRecord(caseId);
  return {
    caseId,
    txn,
    title: record?.title ?? "Filed matter",
    court: record?.court.name ?? "Delhi District Courts",
    filedAt: new Date().toISOString()
  };
}

export default function FilingSuccess() {
  const search = useSearchParams();
  const caseId = search.get("case");
  const txn = search.get("txn");
  const receipt = useMemo(() => readReceipt(caseId, txn), [caseId, txn]);
  const [copied, setCopied] = useState(false);

  if (!receipt) {
    return (
      <main className="filing-success">
        <section className="filing-success-card">
          <p className="filing-stage-kicker">Filing receipt</p>
          <h1>No transaction is waiting on this page.</h1>
          <p>Complete the 9-step Filing Wizard to generate a local tracking ID. Nothing is submitted to any court.</p>
          <Link className="filing-continue" href="/file-a-case">Start a fresh filing →</Link>
        </section>
      </main>
    );
  }

  const filedLabel = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(receipt.filedAt));
  const transactionId = receipt.txn;

  async function copyTxn() {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  }

  return (
    <main className="filing-success">
      <section className="filing-success-card">
        <i aria-hidden="true" className="filing-success-mark"><Check size={28} /></i>
        <p className="filing-stage-kicker">Registry acknowledgement · local only</p>
        <h1>Filing recorded.</h1>
        <p>The plaint has been accepted into this prototype’s local registry. Use the transaction ID below to track the matter on Nyaya. No court has received this filing.</p>
        <div className="filing-txn">
          <span>Transaction ID</span>
          <strong>{receipt.txn}</strong>
          <button onClick={copyTxn} type="button">{copied ? "Copied" : <><Copy size={14} /> Copy ID</>}</button>
        </div>
        <dl className="filing-receipt-meta">
          <div><dt>Cause title</dt><dd>{receipt.title}</dd></div>
          <div><dt>Forum</dt><dd>{receipt.court}</dd></div>
          <div><dt>Filed</dt><dd>{filedLabel}</dd></div>
          <div><dt>Case reference</dt><dd>{receipt.caseId}</dd></div>
        </dl>
        <div className="filing-success-actions">
          <Link className="filing-continue" href="/my-cases?tab=pending">View in My cases →</Link>
          <Link className="ghost-cta" href={`/cases/${receipt.caseId}?tab=Status`}>Open case record</Link>
        </div>
      </section>
    </main>
  );
}
