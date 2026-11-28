import type { Lang } from "./i18n";

const zone = "Asia/Kolkata";

function locale(lang: Lang) {
  return lang === "as" ? "as-IN" : "en-IN";
}

export function longDate(iso: string | Date, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: zone,
  }).format(new Date(iso));
}

export function dateTime(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: zone,
  }).format(new Date(iso));
}

export function clock(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(locale(lang), {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: zone,
  }).format(date);
}
