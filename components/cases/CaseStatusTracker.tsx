"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { advanceCaseStage } from "@/data/demo-case-store";
import type { UnifiedCase } from "@/data/unified-case";
import { resolveProceduralStage } from "@/lib/resolve-procedural-stage";

function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export default function CaseStatusTracker({ caseData, onCaseChange }: { caseData: UnifiedCase; onCaseChange: (next: UnifiedCase) => void }) {
  const resolution = useMemo(() => resolveProceduralStage(caseData), [caseData]);
  const map = resolution.map.stages;
  const currentIndex = resolution.currentStageIndex;
  const tracked = currentIndex >= 0;
  const [selectedId, setSelectedId] = useState(resolution.currentStage?.id ?? null);
  useEffect(() => { setSelectedId(resolution.currentStage?.id ?? null); }, [caseData.id, resolution.currentStage?.id]);
  const selected = map.find((stage) => stage.id === selectedId) ?? resolution.currentStage ?? null;

  return <div className="status-tracker">
    <section className="case-panel">
      <span className="eyebrow">{resolution.map.source ?? "Procedural stages"}</span>
      <h2 className="tab-section-title">{resolution.map.label}</h2>
      <ol className="stage-flow">
        {map.map((stage, index) => {
          const completed = resolution.completedStageIds.includes(stage.id);
          const state = !tracked ? "future" : completed ? "done" : index === currentIndex ? "current" : "future";
          return <li key={stage.id}>
            <button aria-current={state === "current" ? "step" : undefined} className={state} onClick={() => setSelectedId(stage.id)} type="button">
              <i>{completed ? <CheckCircle2 aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</i>
              <span>
                <b>{stage.title}</b>
                {stage.provision && <small>{stage.provision}</small>}
              </span>
            </button>
          </li>;
        })}
      </ol>
      {selected && <div className="stage-note">
        <b>{selected.title}{selected.provision ? ` (${selected.provision})` : ""}</b>
        <p>{selected.description}</p>
      </div>}
    </section>
    <section className="case-panel">
      <span className="eyebrow">Where this case stands</span>
      <h2 className="tab-section-title">Current procedural position</h2>
      <dl className="status-stand">
        <div>
          <dt>Current stage</dt>
          <dd>
            <b>{resolution.currentStage?.title ?? "Not specifically identified"}</b>
            <p>{resolution.currentStage ? resolution.currentStage.description : `Latest court-recorded purpose/status: ${resolution.latestCourtActivity?.purpose || caseData.status.label}.`}</p>
          </dd>
        </div>
        {resolution.latestCourtActivity && <div>
          <dt>Latest court activity</dt>
          <dd>{dateLabel(resolution.latestCourtActivity.date)} — {resolution.latestCourtActivity.purpose}</dd>
        </div>}
        <div>
          <dt>Next hearing</dt>
          <dd><b>{dateLabel(resolution.nextHearing.date)}</b></dd>
        </div>
        <div>
          <dt>Purpose</dt>
          <dd>
            {resolution.nextHearing.purpose}
            {resolution.purposeIsGeneric && <p>The available court entry does not specify a more particular procedural purpose.</p>}
          </dd>
        </div>
        <div>
          <dt>{resolution.nextStageConfidence === "COURT_CONFIRMED" ? "Next procedural stage" : "Likely / normal next procedural stage"}</dt>
          <dd>
            {resolution.nextStage ? <>
              <b>{resolution.nextStage.title}</b>
              <p>{resolution.nextStage.description}</p>
            </> : <p>{tracked ? "This proceeding has reached the last recorded stage on this sequence." : "A normal next procedural stage is shown only after the current stage can be identified from the court record."}</p>}
          </dd>
        </div>
      </dl>
    </section>
    {tracked && currentIndex < map.length - 1 && Boolean(caseData.stageMap?.length) && <button className="demo-control" onClick={() => { const updated = advanceCaseStage(caseData.id, caseData); if (updated) { onCaseChange(updated); } }} type="button">
      <small>DEMO CONTROL</small>
      Simulate next stage
    </button>}
  </div>;
}
