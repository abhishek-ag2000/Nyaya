"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
import { getUserCases } from "@/data/user-cases";
import type { UnifiedCase } from "@/data/unified-case";

const dateHeading = (value: string) => new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
const timeKey = (value: string) => {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return value;
  let hour = Number(match[1]);
  if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
};
const intro: Record<Role, string> = {
  citizen: "Hearings in the cases you are following, with the court, courtroom and time from those records.",
  advocate: "Your listed matters: which court they are in, and when they are called. This is not the public daily cause list.",
  judge: "Illustrative docket of matters before you, with courtroom and time from the shared case set.",
  registry: "Listed hearings for matters in this registry workspace, with court and time from the local case records.",
  stenographer: "Proceedings assigned in this workspace, with court, courtroom and time.",
  police: "Court dates for investigation-linked matters, with the court and time from those records."
};

function mattersForRole(role: Role, cases: UnifiedCase[]) {
  const list = role === "judge" ? cases.filter((item) => item.stage.current !== "Decision")
    : role === "registry" ? cases
    : role === "stenographer" ? cases.slice(0, 4)
    : role === "police" ? cases.filter((item) => item.caseCategory.toLowerCase().includes("criminal"))
    : cases;
  return [...list].sort((a, b) => a.nextHearing.date.localeCompare(b.nextHearing.date) || timeKey(a.nextHearing.time).localeCompare(timeKey(b.nextHearing.time)));
}

export default function TodayMatters() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null | undefined>(undefined);
  const [cases, setCases] = useState<UnifiedCase[]>([]);
  useEffect(() => {
    const refresh = () => { setRole(getMockRole()); setCases(getUserCases()); };
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    window.addEventListener("nyaya-demo-case-updated", refresh);
    return () => { window.removeEventListener("nyaya-mock-session", refresh); window.removeEventListener("nyaya-demo-case-updated", refresh); };
  }, []);
  useEffect(() => {
    if (role === null) router.replace("/login");
  }, [role, router]);

  const groups = useMemo(() => {
    if (!role) return [];
    const map = new Map<string, UnifiedCase[]>();
    for (const item of mattersForRole(role, cases)) {
      map.set(item.nextHearing.date, [...(map.get(item.nextHearing.date) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [cases, role]);

  if (role === undefined || !role) return <main className="wrap workspace-loading">Loading today’s matters…</main>;

  const config = roleConfig[role];
  return (
    <main className="wrap operations-page today-matters">
      <p className="kicker">{config.workspace} · today’s matters</p>
      <h1>Today’s Matters</h1>
      <p>{intro[role]}</p>
      <p className="quiet-summary">{groups.reduce((count, [, items]) => count + items.length, 0)} listed matter{groups.length === 1 ? "" : "s"} in this workspace</p>
      {groups.length ? (
        <div className="today-docket">
          {groups.map(([hearingDate, items]) => (
            <section key={hearingDate}>
              <h2>{dateHeading(hearingDate)}</h2>
              {items.map((item) => (
                <Link className="today-matter" href={`/cases/${item.id}`} key={item.id}>
                  <time dateTime={`${item.nextHearing.date}`}>{item.nextHearing.time}</time>
                  <div>
                    <b>{item.shortTitle}</b>
                    <p className="today-matter-court">{item.court.name} · {item.court.courtroom}</p>
                    <p className="today-matter-meta">{item.court.establishment} · {item.court.district}, {item.court.state}</p>
                    <p className="today-matter-meta">{item.caseType} · {item.nextHearing.purpose} · {item.nextHearing.mode} · {item.court.judge}</p>
                    <code>{item.id}</code>
                  </div>
                  <span>Open case →</span>
                </Link>
              ))}
            </section>
          ))}
        </div>
      ) : <p className="calm-empty">No listed hearings are bundled for this workspace.</p>}
    </main>
  );
}
