"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BackLink } from "@/components/BackLink";
import { loadCaseRecord } from "@/data/demo-case-store";
import type { CaseDocument, UnifiedCase } from "@/data/unified-case";

function dateLabel(date: string, style: "long" | "short" = "long") {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function stripExtractPrefix(text: string) {
  return text.replace(/^Extract:\s*/i, "").trim();
}

function documentKicker(document: CaseDocument) {
  return (document.processing?.classification ?? document.category).toUpperCase();
}

function isCourtRecord(document: CaseDocument) {
  return document.category === "Order" || document.source === "court";
}

function caseNumber(caseData: UnifiedCase) {
  return caseData.identity?.registrationNumber ?? caseData.identity?.filingNumber ?? caseData.id;
}

function authenticityLine(caseData: UnifiedCase, document: CaseDocument) {
  if (caseData.demo) return "Demo record — not an authenticated certified copy.";
  if (document.source === "upload") return "User submitted copy";
  return "Source: Court Record";
}

function sourceLabel(document: CaseDocument) {
  if (document.source === "upload") return "User submitted copy";
  if (document.source === "filing") return "Filing";
  if (document.source === "court" || document.category === "Order") return "Court Record";
  return document.addedBy;
}

function downloadExtractedText(document: CaseDocument, body: string) {
  const header = [
    document.title,
    "Not a certified copy.",
    "—",
    "",
  ].join("\n");
  const blob = new Blob([`${header}${body || "(No extracted text available.)"}\n`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = `${document.id}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function DocumentDetailPanel({
  caseId,
  documentId,
  initialCase,
}: {
  caseId: string;
  documentId: string;
  initialCase?: UnifiedCase;
}) {
  const [caseData, setCaseData] = useState(initialCase);
  const [ready, setReady] = useState(Boolean(initialCase));
  useEffect(() => {
    setCaseData(loadCaseRecord(caseId, initialCase));
    setReady(true);
  }, [caseId, initialCase]);

  const document = caseData?.documents.find((item) => item.id === documentId);
  const cleanedText = useMemo(
    () => (document?.extractedText ? stripExtractPrefix(document.extractedText) : ""),
    [document?.extractedText]
  );

  if (!ready) {
    return (
      <main className="wrap static-page">
        <p className="kicker">Loading local document</p>
        <h1>Opening this case record…</h1>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="wrap static-page">
        <p className="kicker">No local case</p>
        <h1>We couldn&apos;t open this demo case.</h1>
        <Link className="outline-cta" href={`/cases/${caseId}`}>Return to case →</Link>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="wrap static-page">
        <p className="kicker">No local document</p>
        <h1>This document is not on the case record.</h1>
        <p>If this document is not available after the demo state loads, it may have been reset.</p>
        <Link className="outline-cta" href={`/cases/${caseId}`}>Return to case →</Link>
      </main>
    );
  }

  const number = caseNumber(caseData);
  const metaDate = dateLabel(document.date, "short");
  const courtMeta = isCourtRecord(document);
  const metaLine = courtMeta
    ? `${metaDate} • ${document.pages} pages • ${document.addedBy}`
    : `Filed ${metaDate} • ${document.pages} pages • ${document.addedBy}`;

  return (
    <main className="wrap doc-record">
      <BackLink className="back-link doc-back" href={`/cases/${caseData.id}`}>
        Back to {caseData.shortTitle || "case"}
      </BackLink>

      <header className="doc-header">
        <p className="doc-kicker">{documentKicker(document)}</p>
        <h1>{document.title}</h1>
        <div className="doc-case-context">
          <p className="doc-case-number">
            {number}
            {caseData.caseType ? ` • ${caseData.caseType}` : ""}
          </p>
          <p className="doc-case-title">{caseData.title}</p>
          <p className="doc-court-line">
            {caseData.court.judge}
            {caseData.court.name ? `, ${caseData.court.name}` : ""}
          </p>
        </div>
        <p className="doc-meta-line">{metaLine}</p>
        <p className="doc-authenticity">{authenticityLine(caseData, document)}</p>
      </header>

      <article className="doc-paper" data-print-target="true">
        <header className="doc-paper-caption">
          <p>{caseData.court.name}</p>
          <p>{number}</p>
          <p>{caseData.title}</p>
        </header>
        <div className="doc-paper-body">
          {cleanedText ? (
            <p>{cleanedText}</p>
          ) : (
            <p className="doc-paper-empty">No page preview is available for this record.</p>
          )}
        </div>
        <footer className="doc-paper-footer">
          Page 1 of {document.pages}
        </footer>
      </article>

      <div className="doc-toolbar">
        <button type="button" className="doc-toolbar-btn" onClick={() => window.print()}>
          Print
        </button>
        <button
          type="button"
          className="doc-toolbar-btn"
          onClick={() => downloadExtractedText(document, cleanedText)}
        >
          Download
        </button>
      </div>

      {document.extractedText ? (
        <details className="doc-details">
          <summary>View extracted text</summary>
          <div className="doc-details-body">
            <h2 className="visually-hidden">Extracted text</h2>
            <pre>{document.extractedText}</pre>
          </div>
        </details>
      ) : null}

      <details className="doc-details">
        <summary>Document details</summary>
        <dl className="doc-details-list">
          <div>
            <dt>Type</dt>
            <dd>{document.processing?.classification ?? document.category}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{sourceLabel(document)}</dd>
          </div>
          <div>
            <dt>Pages</dt>
            <dd>{document.pages}</dd>
          </div>
          <div>
            <dt>Added</dt>
            <dd>
              <time dateTime={document.date}>{dateLabel(document.date)}</time>
            </dd>
          </div>
          {caseData.demo ? (
            <div>
              <dt>Record status</dt>
              <dd>Demo</dd>
            </div>
          ) : null}
        </dl>
      </details>

      {process.env.NODE_ENV === "development" && document.processing ? (
        <details className="doc-details doc-details-dev">
          <summary>Developer / Processing details</summary>
          <dl className="doc-details-list">
            <div>
              <dt>Status</dt>
              <dd>{document.processing.status}</dd>
            </div>
            <div>
              <dt>Classification</dt>
              <dd>{document.processing.classification}</dd>
            </div>
            {typeof document.processing.confidence === "number" ? (
              <div>
                <dt>Confidence</dt>
                <dd>{document.processing.confidence}</dd>
              </div>
            ) : null}
            {typeof document.processing.aiAssisted === "boolean" ? (
              <div>
                <dt>AI assisted</dt>
                <dd>{document.processing.aiAssisted ? "yes" : "no"}</dd>
              </div>
            ) : null}
            {typeof document.processing.ocrComplete === "boolean" ? (
              <div>
                <dt>OCR complete</dt>
                <dd>{document.processing.ocrComplete ? "yes" : "no"}</dd>
              </div>
            ) : null}
          </dl>
        </details>
      ) : null}
    </main>
  );
}
