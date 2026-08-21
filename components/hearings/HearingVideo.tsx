"use client";

import { useEffect, useRef, useState } from "react";
import { Expand, Minimize2, Volume2, VolumeX } from "lucide-react";
import type { Hearing } from "@/data/hearings";
import { initialsFromName, participantRoleLabel } from "@/data/hearings";
import type { HearingExperience } from "@/lib/hearing-access";

export default function HearingVideo({
  hearing,
  experience,
  canJoin,
}: {
  hearing: Hearing;
  experience: HearingExperience;
  canJoin: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || experience.experience !== "DEMO_STREAM") return;
    video.muted = muted;
    video.volume = volume;
    const tryPlay = async () => {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };
    void tryPlay();
  }, [experience, muted, volume]);

  useEffect(() => {
    function onFullscreen() {
      setExpanded(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  if (!canJoin) {
    return (
      <div className="hearing-video-stage is-restricted" role="status">
        <p>Virtual proceeding restricted</p>
        <small>This hearing is not available to join from your current role.</small>
      </div>
    );
  }

  if (experience.experience === "EXTERNAL_MEETING") {
    return (
      <div className="hearing-video-stage is-external">
        <p className="eyebrow">Virtual Hearing Available</p>
        <h2>Join via {experience.provider?.replaceAll("_", " ") ?? "external meeting"}</h2>
        <p>This matter uses an external meeting link. Nyaya does not embed third-party video in this prototype.</p>
        <a className="login" href={experience.joinUrl} target="_blank" rel="noreferrer">
          Join Virtual Hearing
        </a>
      </div>
    );
  }

  if (experience.experience === "PHYSICAL_ONLY" || experience.experience === "NOT_YET_AVAILABLE") {
    return (
      <div className="hearing-video-stage is-unavailable" role="status">
        <p>{experience.experience === "PHYSICAL_ONLY" ? "Physical court listing" : "Virtual hearing not yet available"}</p>
        <small>No stream is configured for this matter in the demo.</small>
      </div>
    );
  }

  if (experience.experience === "RESTRICTED") {
    return (
      <div className="hearing-video-stage is-restricted" role="status">
        <p>Virtual proceeding restricted</p>
      </div>
    );
  }

  const tiles = (hearing.participants ?? []).filter((item) => item.role !== "JUDGE").slice(0, 2);

  return (
    <div className="hearing-video-layout">
      <div className="hearing-video-stage" ref={stageRef}>
        {failed ? (
          <div className="hearing-video-missing" role="status">
            <p>Demo recording not available in this build</p>
            <small>Virtual hearing playback is illustrative only for this prototype.</small>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="hearing-video-element"
            src={experience.source}
            playsInline
            loop
            muted={muted}
            autoPlay
            controls={false}
            onError={() => setFailed(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label={`Demo court video for ${hearing.caseNumber}`}
          />
        )}
        <div className="hearing-video-overlay" aria-hidden={failed}>
          <span className="hearing-live-chip">
            <i /> LIVE
          </span>
          {!failed && (
            <div className="hearing-video-controls">
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => {
                  const next = !muted;
                  setMuted(next);
                  if (videoRef.current) videoRef.current.muted = next;
                }}
              >
                {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
              </button>
              <label className="hearing-volume">
                <span className="sr-only">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setVolume(next);
                    setMuted(next === 0);
                    if (videoRef.current) {
                      videoRef.current.volume = next;
                      videoRef.current.muted = next === 0;
                    }
                  }}
                />
              </label>
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => {
                  const video = videoRef.current;
                  if (!video) return;
                  if (video.paused) void video.play();
                  else video.pause();
                }}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                aria-label={expanded ? "Exit full screen" : "Expand video"}
                onClick={async () => {
                  const stage = stageRef.current;
                  if (!stage) return;
                  if (!document.fullscreenElement) await stage.requestFullscreen?.();
                  else await document.exitFullscreen?.();
                }}
              >
                {expanded ? <Minimize2 aria-hidden="true" /> : <Expand aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>
      </div>
      {tiles.length > 0 && (
        <div className="hearing-video-tiles" aria-label="Participant tiles">
          {tiles.map((person) => (
            <article key={person.id}>
              <span aria-hidden="true">{initialsFromName(person.name)}</span>
              <b>{person.name}</b>
              <small>{participantRoleLabel(person.role)}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
