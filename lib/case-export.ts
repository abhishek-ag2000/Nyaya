import { getHearingsForCase } from "@/data/hearings";
import type { UnifiedCase } from "@/data/unified-case";
import { dedupeCaseHistory } from "@/lib/resolve-procedural-stage";

export type CaseExportSection = { heading: string; lines: string[] };

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function ascii(text: string) {
  return text
    .replace(/\u00b7/g, "-")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

export function buildCaseExportSections(caseData: UnifiedCase): CaseExportSection[] {
  const events = [...caseData.events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id));
  const hearings = getHearingsForCase(caseData.id);
  const orders = (caseData.documents ?? []).filter((document) => document.category === "Order" || (caseData.orders ?? []).includes(document.id));
  const sections: CaseExportSection[] = [
    {
      heading: "Case identity",
      lines: [
        `Title: ${caseData.title}`,
        `Case ID: ${caseData.id}`,
        `Case type: ${caseData.caseType}`,
        `Category: ${caseData.caseCategory}`,
        caseData.identity?.cnr ? `CNR: ${caseData.identity.cnr}` : "",
        caseData.identity?.filingNumber ? `Filing number: ${caseData.identity.filingNumber}` : "",
        caseData.identity?.registrationNumber ? `Registration number: ${caseData.identity.registrationNumber}` : "",
        caseData.identity?.eFilingNumber ? `e-Filing number: ${caseData.identity.eFilingNumber}` : "",
        caseData.transactionId ? `Transaction ID: ${caseData.transactionId}` : "",
      ].filter(Boolean),
    },
    {
      heading: "Court and status",
      lines: [
        `Court: ${caseData.court.name}`,
        `Establishment: ${caseData.court.establishment}`,
        `State / District: ${caseData.court.state} / ${caseData.court.district}`,
        `Courtroom: ${caseData.court.courtroom}`,
        `Presiding judge: ${caseData.court.judge}`,
        `Status: ${caseData.status.label}`,
        `Status note: ${caseData.status.plainLanguage}`,
        `Current stage: ${caseData.stage.current}`,
        `Completed stages: ${caseData.stage.completedStages.join(", ") || "None"}`,
        `Upcoming stages: ${caseData.stage.upcomingStages.join(", ") || "None"}`,
        `Last updated: ${dateLabel(caseData.status.updatedAt)}`,
      ],
    },
    {
      heading: "Important dates",
      lines: [
        caseData.dates?.filingDate ? `Filing date: ${dateLabel(caseData.dates.filingDate)}` : "",
        caseData.dates?.registrationDate ? `Registration date: ${dateLabel(caseData.dates.registrationDate)}` : "",
        caseData.dates?.firstHearingDate ? `First hearing: ${dateLabel(caseData.dates.firstHearingDate)}` : "",
        caseData.dates?.decisionDate ? `Decision date: ${dateLabel(caseData.dates.decisionDate)}` : "",
        `Next hearing: ${dateLabel(caseData.nextHearing.date)} · ${caseData.nextHearing.time} · ${caseData.nextHearing.purpose} · ${caseData.nextHearing.mode}`,
      ].filter(Boolean),
    },
    {
      heading: "Parties and advocates",
      lines: [
        `Petitioners: ${caseData.parties.petitioners.join(", ") || "None"}`,
        `Respondents: ${caseData.parties.respondents.join(", ") || "None"}`,
        `Petitioner advocates: ${caseData.advocates.petitioner.join(", ") || "None"}`,
        `Respondent advocates: ${caseData.advocates.respondent.join(", ") || "None"}`,
      ],
    },
  ];

  if (caseData.provisions?.length) {
    sections.push({
      heading: "Provisions",
      lines: caseData.provisions.map((item) => `${item.act} - ${item.sections.join(", ")}`),
    });
  }

  if (caseData.caseHistory?.length) {
    sections.push({
      heading: "Case history",
      lines: dedupeCaseHistory(caseData.caseHistory).map(
        (row) => `${dateLabel(row.businessDate)} · Judge ${row.judge} · Next ${dateLabel(row.nextHearingDate)} · ${row.purpose}`
      ),
    });
  }

  sections.push({
    heading: "Hearings",
    lines: hearings.length
      ? hearings.map((hearing) => `${dateLabel(hearing.hearingDate)} · ${hearing.hearingTime ?? "Time TBC"} · ${hearing.purpose ?? "Listed"} · ${hearing.status} · ${hearing.mode}`)
      : ["No hearings are recorded on this case."],
  });

  sections.push({
    heading: "Filings",
    lines: (caseData.filings ?? []).length
      ? caseData.filings.map((filing) => `${dateLabel(filing.date)} · ${filing.title} · ${filing.filingType} · ${filing.status} · Filed by ${filing.filedBy}`)
      : ["No filings are recorded on this case."],
  });

  sections.push({
    heading: "Filed documents",
    lines: (caseData.documents ?? []).length
      ? caseData.documents.map((document) => `${dateLabel(document.date)} · ${document.title} · ${document.category} · ${document.pages} pages · ${document.addedBy}`)
      : ["No documents are recorded on this case."],
  });

  sections.push({
    heading: "Orders",
    lines: orders.length
      ? orders.map((document) => `${dateLabel(document.date)} · ${document.title} · ${document.processing?.classification ?? "Order"} · ${document.pages} pages`)
      : ["No orders are recorded on this case."],
  });

  sections.push({
    heading: "Timeline",
    lines: events.length
      ? events.map((event) => `${dateLabel(event.occurredAt)} · ${event.title} · ${event.description}`)
      : ["No timeline events are recorded on this case."],
  });

  if (caseData.actionsRequired?.length) {
    sections.push({
      heading: "Actions required",
      lines: caseData.actionsRequired.map(
        (action) => `${action.status.toUpperCase()} · ${action.priority} · ${action.title}${action.dueDate ? ` · Due ${dateLabel(action.dueDate)}` : ""}`
      ),
    });
  }

  sections.push({
    heading: "Disclosure",
    lines: [
      "Nyaya demo case record. Not a certified copy.",
      "Illustrative synthetic data only. No live court system was queried.",
    ],
  });

  return sections;
}

function escapePdfString(text: string) {
  return ascii(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLine(text: string, maxChars: number) {
  const source = ascii(text);
  if (source.length <= maxChars) return [source];
  const lines: string[] = [];
  let remaining = source;
  while (remaining.length > maxChars) {
    let breakAt = remaining.lastIndexOf(" ", maxChars);
    if (breakAt < Math.floor(maxChars / 2)) breakAt = maxChars;
    lines.push(remaining.slice(0, breakAt).trimEnd());
    remaining = remaining.slice(breakAt).trimStart();
  }
  if (remaining) lines.push(remaining);
  return lines;
}

/** Build a multi-page PDF (Helvetica) from the full case export sections. */
export function buildCasePdfBytes(caseData: UnifiedCase): Uint8Array {
  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 54;
  const marginTop = 54;
  const marginBottom = 54;
  const maxChars = 92;
  const sections = buildCaseExportSections(caseData);

  type PageLine = { text: string; size: number; gapAfter: number };
  const flow: PageLine[] = [
    { text: "Nyaya - demo case record", size: 16, gapAfter: 4 },
    { text: "Not a certified copy. Illustrative synthetic data only.", size: 9, gapAfter: 16 },
  ];
  for (const section of sections) {
    flow.push({ text: section.heading, size: 12, gapAfter: 6 });
    for (const line of section.lines) {
      for (const wrapped of wrapLine(line, maxChars)) {
        flow.push({ text: wrapped, size: 10, gapAfter: 2 });
      }
    }
    flow.push({ text: "", size: 10, gapAfter: 10 });
  }

  const pages: PageLine[][] = [];
  let current: PageLine[] = [];
  let y = pageHeight - marginTop;
  for (const item of flow) {
    const needed = item.size + item.gapAfter;
    if (y - needed < marginBottom && current.length) {
      pages.push(current);
      current = [];
      y = pageHeight - marginTop;
    }
    current.push(item);
    y -= needed;
  }
  if (current.length) pages.push(current);
  if (!pages.length) pages.push([{ text: "No case data.", size: 10, gapAfter: 0 }]);

  const objects: string[] = [];
  const addObject = (body: string) => {
    objects.push(body);
    return objects.length;
  };

  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const pageLines = pages[pageIndex];
    let cursorY = pageHeight - marginTop;
    const ops: string[] = [];
    for (const item of pageLines) {
      if (item.text) {
        ops.push("BT");
        ops.push(`/F1 ${item.size} Tf`);
        ops.push(`1 0 0 1 ${marginX} ${cursorY - item.size} Tm`);
        ops.push(`(${escapePdfString(item.text)}) Tj`);
        ops.push("ET");
      }
      cursorY -= item.size + item.gapAfter;
    }
    const footer = `Page ${pageIndex + 1} of ${pages.length} - ${caseData.id}`;
    ops.push("BT");
    ops.push("/F1 8 Tf");
    ops.push(`1 0 0 1 ${marginX} 28 Tm`);
    ops.push(`(${escapePdfString(footer)}) Tj`);
    ops.push("ET");

    const stream = ops.join("\n");
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
    pageIds.push(pageId);
  }

  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  const pagesId = addObject(`<< /Type /Pages /Kids [${kids}] /Count ${pageIds.length} >>`);
  // Patch page parents to the pages object id
  for (const pageId of pageIds) {
    objects[pageId - 1] = objects[pageId - 1].replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
  }
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  const encoder = new TextEncoder();
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return encoder.encode(pdf);
}

export function downloadCasePdf(caseData: UnifiedCase) {
  const bytes = buildCasePdfBytes(caseData);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = `${caseData.id}-case-record.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
