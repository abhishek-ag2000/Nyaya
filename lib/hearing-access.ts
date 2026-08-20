import type { Hearing } from "@/data/hearings";
import type { Role } from "@/data/roles";

export type HearingExperience =
  | { experience: "DEMO_STREAM"; source: string; isDemo: true }
  | { experience: "EXTERNAL_MEETING"; joinUrl: string; provider?: string }
  | { experience: "RESTRICTED" }
  | { experience: "NOT_YET_AVAILABLE" }
  | { experience: "PHYSICAL_ONLY" };

/** Whether the user may see that a virtual proceeding exists / open the hearing room shell. */
export function canViewHearing(role: Role | null, hearing: Hearing): boolean {
  if (hearing.access === "PUBLIC") return true;
  if (hearing.access === "RESTRICTED") {
    return role === "judge" || role === "registry";
  }
  if (hearing.access === "COURT_ONLY") {
    return role === "judge" || role === "registry" || role === "stenographer";
  }
  if (hearing.access === "ADVOCATES_ONLY") {
    return role === "advocate" || role === "judge" || role === "registry";
  }
  // CASE_PARTICIPANTS — any signed-in mock role may view; guests may see listing but not join video
  return role !== null;
}

/** Whether the user may enter/watch the virtual stream or external meeting. */
export function canJoinHearing(role: Role | null, hearing: Hearing): boolean {
  if (!canViewHearing(role, hearing)) return false;
  if (hearing.mode === "PHYSICAL" && !hearing.videoSource && !hearing.virtualHearing) return false;
  if (hearing.access === "RESTRICTED") return role === "judge" || role === "registry";
  if (hearing.access === "COURT_ONLY") return role === "judge" || role === "registry" || role === "stenographer";
  if (hearing.access === "ADVOCATES_ONLY") return role === "advocate" || role === "judge";
  if (hearing.access === "CASE_PARTICIPANTS") return role !== null;
  return true;
}

/**
 * Normalize how the UI should present this hearing's media.
 * Callers must still check canJoinHearing / canViewHearing before acting on EXTERNAL_MEETING URLs.
 */
export function getHearingExperience(hearing: Hearing): HearingExperience {
  if (hearing.access === "RESTRICTED" && hearing.status === "LIVE") {
    // Experience type still signals restricted; UI gates on canJoinHearing.
  }

  if (hearing.mode === "PHYSICAL" && !hearing.videoSource && !hearing.virtualHearing?.joinUrl) {
    return { experience: "PHYSICAL_ONLY" };
  }

  const source = hearing.videoSource;
  if (source?.type === "DEMO_VIDEO") {
    const path = source.localAsset ?? source.url;
    if (path) return { experience: "DEMO_STREAM", source: path, isDemo: true };
  }

  if (source?.type === "EXTERNAL_MEETING" || hearing.virtualHearing?.joinUrl) {
    const joinUrl = source?.url ?? hearing.virtualHearing?.joinUrl;
    if (joinUrl) {
      return {
        experience: "EXTERNAL_MEETING",
        joinUrl,
        provider: hearing.virtualHearing?.provider,
      };
    }
  }

  if (source?.type === "LIVE_STREAM" && (source.url || source.localAsset)) {
    // Future: map to NYAY_LIVE. For now treat remote stream URLs like demo playback.
    return {
      experience: "DEMO_STREAM",
      source: (source.localAsset ?? source.url) as string,
      isDemo: true,
    };
  }

  if (hearing.status === "LIVE" || hearing.status === "UPCOMING" || hearing.status === "WAITING") {
    if (hearing.mode === "VIRTUAL" || hearing.mode === "HYBRID") {
      return { experience: "NOT_YET_AVAILABLE" };
    }
  }

  return { experience: "PHYSICAL_ONLY" };
}

export function isVirtualCapable(hearing: Hearing) {
  return hearing.mode === "VIRTUAL" || hearing.mode === "HYBRID";
}

export function joinActionLabel(role: Role | null, hearing: Hearing) {
  if (hearing.access === "RESTRICTED" && !canJoinHearing(role, hearing)) {
    return null;
  }
  if (!canJoinHearing(role, hearing)) {
    if (hearing.status === "LIVE" && canViewHearing(role, hearing)) return "View Hearing";
    return null;
  }
  if (hearing.status === "LIVE") {
    return role === "judge" ? "Open Hearing" : role === "citizen" ? "Watch Live Hearing" : "Join Virtual Hearing";
  }
  if (hearing.status === "UPCOMING" || hearing.status === "WAITING") {
    const experience = getHearingExperience(hearing);
    if (experience.experience === "EXTERNAL_MEETING") return "Join Virtual Hearing";
    if (isVirtualCapable(hearing)) return "Join when Live";
  }
  if (role === "judge") return "Open Matter";
  return "View Hearing";
}
