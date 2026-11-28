"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The footer crowd video. Nothing downloads until the footer is near the
 * screen; it plays only while on screen, never with reduced motion, and has
 * a pause button (anything that keeps moving needs a way to stop it).
 */
export function CrowdVideo({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    // The still picture loads only when the footer is getting close.
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    nearIo.observe(v);
    if (rm) return () => nearIo.disconnect();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !v.dataset.userStopped) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    v.addEventListener("play", on);
    v.addEventListener("pause", off);
    return () => {
      nearIo.disconnect();
      io.disconnect();
      v.removeEventListener("play", on);
      v.removeEventListener("pause", off);
    };
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      delete v.dataset.userStopped;
      setStopped(false);
      v.play().catch(() => {});
    } else {
      v.dataset.userStopped = "1";
      setStopped(true);
      v.pause();
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="sj-crowd-video"
        muted
        loop
        playsInline
        preload="none"
        poster={near ? "/footer/crowd-poster.webp" : undefined}
        width={1280}
        height={560}
        aria-hidden="true"
      >
        <source src="/footer/crowd.mp4" type="video/mp4" />
      </video>
      {!reduced && (
        <button type="button" className="sj-crowd-toggle" onClick={toggle} aria-label={playing ? pauseLabel : playLabel}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            {playing && !stopped ? (
              <path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z" />
            ) : (
              <path fill="currentColor" d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>
      )}
    </>
  );
}
