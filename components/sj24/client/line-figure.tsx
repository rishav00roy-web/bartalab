"use client";

import { useEffect, useRef } from "react";
import { dish, loupe, relay, type Figure } from "@/lib/hairline";

/**
 * A Hairline line figure that answers the pointer. Phones have no pointer, so
 * the first time it scrolls into view it acts out its movement once, for a
 * few seconds, then rests (Hairline itself keeps still under reduced motion).
 */
export function LineFigure({ kind, label }: { kind: "dish" | "relay" | "loupe"; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fig: Figure | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      fig = ({ dish, relay, loupe } as const)[kind](el, { label, intensity: 0.7 });
    } catch {
      return; // Decoration only: if it fails to draw, the box stays empty.
    }
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([e]) => {
              if (!e.isIntersecting) return;
              io?.disconnect();
              fig?.update({ play: true });
              timer = setTimeout(() => fig?.update({ play: false }), 6000);
            },
            { threshold: 0.5 },
          )
        : null;
    io?.observe(el);
    return () => {
      io?.disconnect();
      clearTimeout(timer);
      fig?.destroy();
    };
  }, [kind, label]);
  return <div ref={ref} className={`sj-figure sj-figure-${kind}`} />;
}
