"use client";

import { useEffect, useRef, useState } from "react";
import { clock } from "@/lib/sj24/format";
import type { Lang } from "@/lib/sj24/i18n";
import { dish, terrain, type Figure } from "@/lib/hairline";

/** Live Indian Standard Time. Renders an empty slot until mounted so server and client agree. */
export function LiveClock({ lang }: { lang: Lang }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="sj-clock" aria-label="Indian Standard Time">
      {now ? `${clock(now, lang)} IST` : " "}
    </span>
  );
}

function readTheme(): "light" | "dark" {
  try {
    const saved = localStorage.getItem("sj24-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Light and dark reading modes, remembered on this device. */
export function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  useEffect(() => setTheme(readTheme()), []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("sj24-theme", next);
    } catch {}
  }
  return (
    <button
      type="button"
      className="sj-icon-btn"
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        {theme === "dark" ? (
          <path
            fill="currentColor"
            d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5 1 3h-2l1-3Zm0 20-1-3h2l-1 3ZM2 12l3-1v2l-3-1Zm20 0-3 1v-2l3 1ZM4.9 4.9l2.8 1.4-1.4 1.4-1.4-2.8Zm14.2 14.2-2.8-1.4 1.4-1.4 1.4 2.8Zm0-14.2-1.4 2.8-1.4-1.4 2.8-1.4ZM4.9 19.1l1.4-2.8 1.4 1.4-2.8 1.4Z"
          />
        ) : (
          <path fill="currentColor" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        )}
      </svg>
    </button>
  );
}

/**
 * The header folds into a slim bar once the reader scrolls past the masthead,
 * and opens again at the top (after Annnimate's floating-navbar, without GSAP).
 */
export function FoldingHeader({ children }: { children: React.ReactNode }) {
  const [folded, setFolded] = useState(false);
  useEffect(() => {
    // Two thresholds, so the header doesn't flicker at the boundary.
    const onScroll = () => setFolded((was) => (was ? window.scrollY > 60 : window.scrollY > 160));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="sj-header" data-folded={folded || undefined}>
      {children}
    </header>
  );
}

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

/** "More" sections menu. Closes on Escape, on an outside click, or after a link is chosen. */
export function NavMore({ label, current, children }: { label: string; current: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <details ref={ref} className="sj-more-menu" data-current={current || undefined}>
      <summary>
        {label}
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </summary>
      <div className="sj-more-panel">{children}</div>
    </details>
  );
}

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="sj-share-btn" onClick={() => window.print()}>
      {label}
    </button>
  );
}

/** A Hairline line figure that answers the pointer. */
export function LineFigure({ kind, label, play }: { kind: "dish" | "terrain"; label: string; play?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let fig: Figure | null = null;
    try {
      fig = (kind === "dish" ? dish : terrain)(ref.current, { label, play, intensity: 0.6 });
    } catch {
      // Decoration only: if it fails to draw, the box stays empty.
    }
    return () => fig?.destroy();
  }, [kind, label, play]);
  return <div ref={ref} className="sj-figure" />;
}
