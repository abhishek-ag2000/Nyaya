"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Hearing } from "@/data/hearings";
import { canJoinHearing, getHearingExperience } from "@/lib/hearing-access";
import type { Role } from "@/data/roles";

const FALLBACK_DEMO = "/videos/demo-hearing-01.mp4";

/** Compact muted preview for case Hearings tab rows. */
export default function HearingPreviewVideo({
  hearing,
  role,
}: {
  hearing: Hearing;
  role: Role | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const experience = getHearingExperience(hearing);
  const canJoin = canJoinHearing(role, hearing);
  const restricted = hearing.access === "RESTRICTED" && !canJoin;

  const source =
    experience.experience === "DEMO_STREAM"
      ? experience.source
      : hearing.videoSource?.localAsset ?? hearing.videoSource?.url ?? FALLBACK_DEMO;

  useEffect(() => {
    setFailed(false);
    const video = videoRef.current;
    if (!video || restricted) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [source, restricted]);

  if (restricted) {
    return (
      <div className="hearing-preview-video is-restricted" role="status">
        <span>Restricted</span>
      </div>
    );
  }

  if (experience.experience === "EXTERNAL_MEETING") {
    return (
      <div className="hearing-preview-video is-external">
        <span>External meeting</span>
        <a href={experience.joinUrl} target="_blank" rel="noreferrer">
          Join →
        </a>
      </div>
    );
  }

  return (
    <div className="hearing-preview-video">
      {failed ? (
        <div className="hearing-preview-missing">
          <span>Demo recording not available in this build</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={source}
          muted
          playsInline
          loop
          autoPlay
          controls={false}
          preload="metadata"
          onError={() => setFailed(true)}
          aria-label={`Demo preview for ${hearing.caseNumber}`}
        />
      )}
      {(hearing.status === "LIVE" || experience.experience === "DEMO_STREAM") && (
        <Link className="hearing-preview-open" href={`/hearings/${hearing.id}`}>
          Open →
        </Link>
      )}
      {hearing.isDemo && <span className="hearing-preview-demo">Demo</span>}
    </div>
  );
}
