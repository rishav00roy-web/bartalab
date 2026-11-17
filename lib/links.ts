// Accepts "example.com" or a full URL; returns a normalized URL, null for blank, or throws.
export function normalizeLink(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  const raw = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  return new URL(raw).toString();
}
