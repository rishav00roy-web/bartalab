"use client";

import { useEffect, useRef, useState } from "react";
import { clock } from "@/lib/sj24/format";
import type { Lang } from "@/lib/sj24/i18n";

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
 * Floating navbar (after Annnimate's floating-navbar, without GSAP). Once the
 * masthead has scrolled away, a bar drops in and its edges close into a
 * floating glass pill. Further down it hides while you scroll down and comes
 * back as soon as you scroll up. Back at the top it opens out and leaves.
 */
export function FloatingNav({ label, children }: { label: string; children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [pill, setPill] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const masthead = document.querySelector<HTMLElement>(".sj-header");
    let lastY = window.scrollY;
    let isDocked = false;
    const dockAt = () => (masthead ? masthead.offsetTop + masthead.offsetHeight : 200);
    // Pill width from its real content, so the edges close exactly onto it.
    const measure = () => {
      const r = row.current;
      if (r && wrap.current) wrap.current.style.setProperty("--pill-w", `${r.scrollWidth + 12}px`);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const at = dockAt();
      // Hysteresis: it docks past the masthead and only undocks a little above it.
      const next = isDocked ? y > at - 24 : y > at;
      if (next !== isDocked) {
        isDocked = next;
        setDocked(next);
        if (next) {
          measure();
          // Show the full-width bar for one frame, then let the edges close in.
          requestAnimationFrame(() => requestAnimationFrame(() => setPill(true)));
        } else {
          setPill(false);
        }
      }
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(isDocked && delta > 0 && y > at + 480);
        lastY = y;
      }
    };
    onScroll();
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="sj-float"
      data-docked={docked || undefined}
      data-pill={pill || undefined}
      data-hidden={hidden || undefined}
      // Out of the tab order and hidden from screen readers until it is on screen.
      inert={!docked}
      aria-hidden={!docked}
    >
      <nav className="sj-float-pill" aria-label={label}>
        <div ref={row} className="sj-float-row">
          {children}
        </div>
      </nav>
    </div>
  );
}

/** "More" sections menu. Closes on Escape or on a click outside it. */
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
