"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One word at a time on a turning drum (after Annnimate's rotating-words).
 * Runs through the list once and stops. Screen readers get the whole list.
 */
export function RotatingWords({ words, prefix }: { words: string[]; prefix: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // One pass through the list, landing on the last word: nothing keeps moving on its own.
    const id = setInterval(
      () =>
        setI((n) => {
          if (n + 1 >= words.length - 1) clearInterval(id);
          return Math.min(n + 1, words.length - 1);
        }),
      1600,
    );
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <p className="sj-rotate">
      <span className="visually-hidden">
        {prefix} {words.join(", ")}
      </span>
      <span aria-hidden="true">{prefix} </span>
      <span className="sj-rotate-drum" aria-hidden="true">
        <span className="sj-rotate-sizer">{words.reduce((a, b) => (b.length > a.length ? b : a), "")}</span>
        {words.map((w, n) => {
          const offset = (n - i + words.length) % words.length;
          const pos = offset === 0 ? "now" : offset === words.length - 1 ? "past" : "next";
          return (
            <span key={w} className="sj-rotate-word" data-pos={pos}>
              {w}
            </span>
          );
        })}
      </span>
    </p>
  );
}

/**
 * A hairline section divider that springs away from a fast pointer and rings
 * back to rest (after Annnimate's elastic-divider, with a plain spring).
 */
export function ElasticDivider() {
  const box = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = box.current;
    const line = path.current;
    if (!el || !line) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = el.clientWidth;
    const mid = 12;
    const s = { x: width / 2, y: 0, v: 0 };
    let raf = 0;
    let last = { x: 0, y: 0, t: 0 };

    const draw = () => line.setAttribute("d", `M0,${mid} Q${s.x.toFixed(1)},${(mid + s.y * 2).toFixed(1)} ${width},${mid}`);
    const tick = () => {
      // Damped spring back to the rest line.
      s.v += -s.y * 0.12;
      s.v *= 0.86;
      s.y += s.v;
      draw();
      if (Math.abs(s.y) > 0.05 || Math.abs(s.v) > 0.05) raf = requestAnimationFrame(tick);
      else {
        s.y = 0;
        draw();
        raf = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = performance.now();
      const crossed = last.t && (last.y - mid) * (y - mid) < 0;
      if (crossed && !reduced) {
        const speed = Math.hypot(x - last.x, y - last.y) / Math.max(1, now - last.t);
        s.x = Math.min(width * 0.88, Math.max(width * 0.12, x));
        s.v += Math.sign(y - last.y) * Math.min(10, 2 + speed * 4);
        if (!raf) raf = requestAnimationFrame(tick);
      }
      last = { x, y, t: now };
    };
    const onLeave = () => (last = { x: 0, y: 0, t: 0 });
    const onResize = () => {
      width = el.clientWidth;
      el.querySelector("svg")?.setAttribute("viewBox", `0 0 ${width} 24`);
      draw();
    };
    onResize();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <div ref={box} className="sj-divider" aria-hidden="true">
      <svg preserveAspectRatio="none" height="24" width="100%">
        <path ref={path} d="M0,12 L10000,12" />
      </svg>
    </div>
  );
}
