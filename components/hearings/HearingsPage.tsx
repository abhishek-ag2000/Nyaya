"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DEMO_HEARING_DAY,
  filterHearingsByDateRange,
  formatHearingDateLong,
  getAllHearings,
  getHearingsForRole,
  groupHearingsByStatus,
  setHearingLocalStatus,
  sortHearingsChronologically,
  type Hearing,
} from "@/data/hearings";
import { getMockRole } from "@/data/mock-session";
import { roleConfig, type Role } from "@/data/roles";
import { isVirtualCapable } from "@/lib/hearing-access";
import HearingList from "@/components/hearings/HearingList";
import HearingSummary from "@/components/hearings/HearingSummary";
import LiveHearingsSection from "@/components/hearings/LiveHearingsSection";

type DateRange = "today" | "tomorrow" | "week" | "custom";
type StatusFilter = "all" | "live" | "upcoming" | "completed" | "virtual";

export default function HearingsPage() {
  const [role, setRole] = useState<Role | null | undefined>(undefined);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const [customDate, setCustomDate] = useState(DEMO_HEARING_DAY);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [myMattersOnly, setMyMattersOnly] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setRole(getMockRole());
      setHearings(getAllHearings());
    };
    refresh();
    window.addEventListener("nyaya-mock-session", refresh);
    window.addEventListener("nyaya-hearing-updated", refresh);
    return () => {
      window.removeEventListener("nyaya-mock-session", refresh);
      window.removeEventListener("nyaya-hearing-updated", refresh);
    };
  }, []);

  const scoped = useMemo(() => {
    if (role === undefined) return [];
    let list = getHearingsForRole(role, hearings);
    list = filterHearingsByDateRange(list, dateRange, customDate, DEMO_HEARING_DAY);
    if (myMattersOnly && role === "advocate") {
      // Shared demo dataset: "my matters" keeps Court No. 4 + virtual-capable items as a stand-in ownership filter.
      list = list.filter((item) => item.courtNumber === "4" || item.courtNumber === "3");
    }
    if (statusFilter === "live") list = list.filter((item) => item.status === "LIVE");
    if (statusFilter === "upcoming") list = list.filter((item) => item.status === "UPCOMING" || item.status === "WAITING");
    if (statusFilter === "completed") list = list.filter((item) => item.status === "COMPLETED");
    if (statusFilter === "virtual") list = list.filter((item) => isVirtualCapable(item));
    return sortHearingsChronologically(list);
  }, [customDate, dateRange, hearings, myMattersOnly, role, statusFilter]);

  const groups = useMemo(() => groupHearingsByStatus(scoped), [scoped]);

  if (role === undefined) {
    return <main className="wrap workspace-loading">Loading hearings…</main>;
  }

  const headingDate =
    dateRange === "custom"
      ? formatHearingDateLong(customDate)
      : dateRange === "tomorrow"
        ? formatHearingDateLong(
            new Date(new Date(`${DEMO_HEARING_DAY}T12:00:00`).getTime() + 86400000).toISOString().slice(0, 10)
          )
        : formatHearingDateLong(DEMO_HEARING_DAY);

  const onJudgeAction = (hearing: Hearing, action: "start" | "resume" | "end" | "adjourn") => {
    if (action === "start" || action === "resume") setHearingLocalStatus(hearing.id, "LIVE");
    if (action === "end") setHearingLocalStatus(hearing.id, "COMPLETED");
    if (action === "adjourn") setHearingLocalStatus(hearing.id, "ADJOURNED");
  };

  return (
    <main className="wrap operations-page hearings-page">
      <p className="kicker">{role ? `${roleConfig[role].workspace} · hearings` : "Hearings · demo board"}</p>
      <h1>Hearings</h1>
      <p>View today’s court hearings, track listed matters and join virtual proceedings where available.</p>
      <p className="hearings-date-line">
        <strong>{headingDate}</strong>
        <span>Demo board date · Asia/Kolkata</span>
      </p>

      <div className="hearings-controls">
        <div role="group" aria-label="Date range">
          {(
            [
              ["today", "Today"],
              ["tomorrow", "Tomorrow"],
              ["week", "This Week"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={dateRange === value ? "active" : ""}
              aria-pressed={dateRange === value}
              onClick={() => setDateRange(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          Date
          <input
            type="date"
            value={customDate}
            onChange={(event) => {
              setCustomDate(event.target.value);
              setDateRange("custom");
            }}
          />
        </label>
        <div role="group" aria-label="Filter hearings">
          {(
            [
              ["all", "All"],
              ["live", "Live"],
              ["upcoming", "Upcoming"],
              ["completed", "Completed"],
              ["virtual", "Virtual"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={statusFilter === value ? "active" : ""}
              aria-pressed={statusFilter === value}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {role === "advocate" && (
          <label className="hearings-toggle">
            <input
              type="checkbox"
              checked={myMattersOnly}
              onChange={(event) => setMyMattersOnly(event.target.checked)}
            />
            My Matters Only
          </label>
        )}
      </div>

      {!role && (
        <p className="hearings-guest-note">
          You are browsing the public demo board.{" "}
          <Link href="/login">Choose a mock role</Link> for citizen, advocate, or judge actions.
        </p>
      )}

      <HearingSummary hearings={scoped} role={role} />

      {!scoped.length ? (
        <section className="hearings-empty">
          <p>No hearings are listed for today.</p>
          <button type="button" className="login" onClick={() => { setDateRange("week"); setStatusFilter("all"); }}>
            View upcoming hearings
          </button>
        </section>
      ) : (
        <>
          {(statusFilter === "all" || statusFilter === "live") && (
            <LiveHearingsSection hearings={groups.live} role={role} />
          )}

          {(statusFilter === "all" || statusFilter === "upcoming") && (
            <section className="hearings-section" aria-label="Upcoming hearings">
              <div className="workspace-section-heading">
                <div>
                  <span>Listed</span>
                  <h2>Upcoming Today</h2>
                </div>
              </div>
              <HearingList
                hearings={groups.upcoming}
                role={role}
                dense
                empty="No upcoming hearings in this view."
                onJudgeAction={onJudgeAction}
              />
            </section>
          )}

          {(statusFilter === "all" || statusFilter === "completed") && (
            <section className="hearings-section" aria-label="Completed hearings">
              <div className="workspace-section-heading">
                <div>
                  <span>Disposed today</span>
                  <h2>Completed Today</h2>
                </div>
              </div>
              <HearingList
                hearings={[...groups.completed, ...groups.adjourned]}
                role={role}
                dense
                empty="No completed hearings in this view."
              />
            </section>
          )}

          {statusFilter === "virtual" && (
            <section className="hearings-section" aria-label="Virtual hearings">
              <div className="workspace-section-heading">
                <div>
                  <span>Mode</span>
                  <h2>Virtual &amp; hybrid hearings</h2>
                </div>
              </div>
              <HearingList hearings={scoped} role={role} onJudgeAction={onJudgeAction} empty="No virtual hearings in this view." />
            </section>
          )}
        </>
      )}
    </main>
  );
}
