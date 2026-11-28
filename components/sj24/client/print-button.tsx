"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" className="sj-share-btn" onClick={() => window.print()}>
      {label}
    </button>
  );
}
