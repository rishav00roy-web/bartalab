import Link from "next/link";
import { href, t, ui, type Lang } from "@/lib/sj24/i18n";
import { longDate, dateTime } from "@/lib/sj24/format";
import { categories, categoryOf, districtOf, type Story } from "@/lib/sj24/sample";
import { CrowdVideo, FloatingNav, LiveClock, NavMore, ThemeToggle } from "./client";

// Placeholder addresses: replace with SJ24's real accounts before launch.
const social = [
  { name: "Facebook", url: "#", d: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.7-.6Z" },
  { name: "YouTube", url: "#", d: "M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" },
  { name: "X", url: "#", d: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5Z" },
  { name: "Instagram", url: "#", d: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6.3a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Z" },
  { name: "WhatsApp", url: "#", d: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.6 11.6 0 0 1-4.5-4c-.6-.9-1-1.9-1-2.9 0-1 .5-1.6.8-1.9.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.7 1.1 1.5 1.8 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1.2Z" },
];

// The menu shows the sections readers use most; the rest sit under "More".
const PRIMARY = ["assam", "northeast", "national", "international", "politics", "sports"];
const primary = PRIMARY.map((slug) => categories.find((c) => c.slug === slug)!).filter(Boolean);
const secondary = categories.filter((c) => !PRIMARY.includes(c.slug));

export function Picture({ story, lang, size = "md" }: { story: Story; lang: Lang; size?: "sm" | "md" | "lg" }) {
  const cat = categoryOf(story.category);
  return (
    <div className={`sj-pic sj-pic-${size}`} data-tone={story.tone}>
      <span className="sj-pic-fill" aria-hidden="true" />
      {story.kind === "video" && (
        <span className="sj-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
      {story.kind === "photo" && <span className="sj-pic-badge">{t(ui.gallery, lang)}</span>}
      <span className="sj-pic-label" aria-hidden="true">
        {cat ? t(cat.name, lang) : ""}
      </span>
    </div>
  );
}

export function Kicker({ story, lang }: { story: Story; lang: Lang }) {
  const cat = categoryOf(story.category);
  const dist = districtOf(story.district);
  return (
    <p className="sj-kicker">
      {cat && <Link href={href(`/category/${cat.slug}`, lang)}>{t(cat.name, lang)}</Link>}
      {dist && (
        <>
          <span aria-hidden="true"> · </span>
          <Link href={href(`/district/${dist.slug}`, lang)}>{t(dist.name, lang)}</Link>
        </>
      )}
    </p>
  );
}

export function StoryCard({
  story,
  lang,
  variant = "card",
}: {
  story: Story;
  lang: Lang;
  variant?: "card" | "row" | "text";
}) {
  const url = href(`/news/${story.slug}`, lang);
  return (
    <article className={`sj-card sj-card-${variant}`}>
      {variant !== "text" && (
        <Link href={url} tabIndex={-1} aria-hidden="true" className="sj-card-pic">
          <Picture story={story} lang={lang} size={variant === "row" ? "sm" : "md"} />
        </Link>
      )}
      <div className="sj-card-body">
        <Kicker story={story} lang={lang} />
        <h3 className="sj-card-title">
          <Link href={url}>{t(story.headline, lang)}</Link>
        </h3>
        {variant === "card" && <p className="sj-card-sub">{t(story.subheadline, lang)}</p>}
        <p className="sj-meta">
          <time dateTime={story.publishedAt}>{dateTime(story.publishedAt, lang)}</time>
        </p>
      </div>
    </article>
  );
}

export function SectionHead({ title, more, lang, id }: { title: string; more?: string; lang: Lang; id?: string }) {
  return (
    <div className="sj-section-head">
      <h2 id={id}>{title}</h2>
      {more && (
        <Link href={href(more, lang)} className="sj-more">
          {t(ui.readMore, lang)} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export function AdSlot({ lang, size = "wide" }: { lang: Lang; size?: "wide" | "box" }) {
  return (
    <aside className={`sj-ad sj-ad-${size}`} aria-label={t(ui.advert, lang)}>
      <span className="sj-ad-label">{t(ui.advert, lang)}</span>
      <span className="sj-ad-fill">{size === "wide" ? "728 × 90" : "300 × 250"}</span>
    </aside>
  );
}

function Wordmark() {
  return (
    <span className="sj-wordmark">
      Satyamev Jayate <span className="sj-wordmark-24">24</span>
    </span>
  );
}

export function SiteShell({
  lang,
  path,
  active,
  children,
}: {
  lang: Lang;
  /** Current path without the language parameter, for the language switch. */
  path: string;
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sj" lang={lang === "as" ? "as" : "en"}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <p className="sj-preview-bar">{t(ui.preview, lang)}</p>
      <div className="sj-util">
        <div className="sj-wrap sj-util-inner">
          <span className="sj-date">{longDate(new Date(), lang)}</span>
          <LiveClock lang={lang} />
          <span className="sj-spacer" />
          <ul className="sj-social" aria-label="SJ24 on social media">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.url} aria-label={s.name} title={s.name}>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path fill="currentColor" d={s.d} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <nav className="sj-lang" aria-label="Language">
            <Link href={href(path, "en")} aria-current={lang === "en" ? "true" : undefined} hrefLang="en">
              English
            </Link>
            <Link href={href(path, "as")} aria-current={lang === "as" ? "true" : undefined} hrefLang="as" lang="as">
              অসমীয়া
            </Link>
          </nav>
          <ThemeToggle label={t(ui.dark, lang)} />
        </div>
      </div>

      <header className="sj-header">
        <div className="sj-masthead">
          <div className="sj-wrap sj-masthead-inner">
            <Link href={href("/", lang)} className="sj-brand" aria-label="SATYAMEV JAYATE 24, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sj24-icon-96.png" alt="" width={56} height={56} className="sj-badge" />
              <Wordmark />
            </Link>
            <p className="sj-tagline">{t(ui.tagline, lang)}</p>
            <span className="sj-spacer" />
            <form action="/search" method="get" className="sj-search" role="search">
              <label htmlFor="sj-q" className="visually-hidden">
                {t(ui.search, lang)}
              </label>
              <input id="sj-q" name="q" type="search" placeholder={t(ui.search, lang)} className="sj-search-input" />
              {lang === "as" && <input type="hidden" name="lang" value="as" />}
              <button type="submit" className="sj-icon-btn" aria-label={t(ui.search, lang)}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="m20 20-4.5-4.5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <nav className="sj-nav" aria-label="Sections">
          <div className="sj-wrap sj-nav-inner">
            <ul className="sj-nav-list">
              <li>
                <Link href={href("/", lang)} aria-current={active === "home" ? "page" : undefined}>
                  {lang === "as" ? "মুখ্য পৃষ্ঠা" : "Home"}
                </Link>
              </li>
              {primary.map((c, i) => (
                <li key={c.slug} data-wide={i >= 3 || undefined}>
                  <Link
                    href={href(`/category/${c.slug}`, lang)}
                    aria-current={active === c.slug ? "page" : undefined}
                  >
                    {t(c.name, lang)}
                  </Link>
                </li>
              ))}
            </ul>
            <NavMore label={lang === "as" ? "আৰু" : "More"} current={secondary.some((c) => c.slug === active)}>
              <ul className="sj-more-list">
                {primary.slice(3).map((c) => (
                  <li key={c.slug} data-narrow>
                    <Link href={href(`/category/${c.slug}`, lang)} aria-current={active === c.slug ? "page" : undefined}>
                      {t(c.name, lang)}
                    </Link>
                  </li>
                ))}
                {secondary.map((c) => (
                  <li key={c.slug}>
                    <Link href={href(`/category/${c.slug}`, lang)} aria-current={active === c.slug ? "page" : undefined}>
                      {t(c.name, lang)}
                    </Link>
                  </li>
                ))}
                <li className="sj-more-districts">
                  <Link href={href("/districts", lang)}>{t(ui.allDistricts, lang)} →</Link>
                </li>
              </ul>
            </NavMore>
          </div>
        </nav>
      </header>

      <FloatingNav label={lang === "as" ? "শাখা (সৰু)" : "Sections, compact"}>
        <Link href={href("/", lang)} className="sj-float-mark" aria-label="SATYAMEV JAYATE 24, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sj24-icon-96.png" alt="" width={30} height={30} />
        </Link>
        <ul className="sj-float-links">
          {primary.map((c, i) => (
            <li key={c.slug} data-pill-wide={i >= 2 || undefined}>
              <Link href={href(`/category/${c.slug}`, lang)} aria-current={active === c.slug ? "page" : undefined}>
                {t(c.name, lang)}
              </Link>
            </li>
          ))}
        </ul>
        <NavMore label={lang === "as" ? "আৰু" : "More"} current={secondary.some((c) => c.slug === active)}>
          <ul className="sj-more-list">
            {primary.slice(2).map((c) => (
              <li key={c.slug} data-pill-narrow>
                <Link href={href(`/category/${c.slug}`, lang)}>{t(c.name, lang)}</Link>
              </li>
            ))}
            {secondary.map((c) => (
              <li key={c.slug}>
                <Link href={href(`/category/${c.slug}`, lang)} aria-current={active === c.slug ? "page" : undefined}>
                  {t(c.name, lang)}
                </Link>
              </li>
            ))}
            <li className="sj-more-districts">
              <Link href={href("/districts", lang)}>{t(ui.allDistricts, lang)} →</Link>
            </li>
          </ul>
        </NavMore>
        <Link href={href("/search", lang)} className="sj-float-search" aria-label={t(ui.search, lang)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="m20 20-4.5-4.5M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
        </Link>
      </FloatingNav>

      <main id="main" className="sj-main">
        {children}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}

export const infoPages = [
  ["about", "About SJ24"],
  ["publisher", "About the Publisher"],
  ["editorial-policy", "Editorial Policy"],
  ["code-of-ethics", "Code of Ethics"],
  ["contact", "Contact Us"],
  ["advertise", "Advertise With Us"],
  ["join", "Join Our Team"],
  ["reporter-registration", "Reporter Registration"],
  ["privacy", "Privacy Policy"],
  ["terms", "Terms and Conditions"],
  ["disclaimer", "Disclaimer"],
  ["grievance", "Grievance Redressal"],
  ["corrections", "Corrections and Clarifications"],
] as const;

function SiteFooter({ lang }: { lang: Lang }) {
  const as = lang === "as";
  return (
    <footer className="sj-footer">
      <div className="sj-footer-top">
        <div className="sj-wrap sj-footer-grid">
          <div className="sj-footer-brand">
            <p className="sj-footer-name">
              SJ24<span>.</span>
            </p>
            <p>{t(ui.publisher, lang)}</p>
          </div>
          <nav aria-label="Sections" className="sj-footer-col">
            <h2>{as ? "শাখা" : "Sections"}</h2>
            <ul className="sj-footer-inline">
              {categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link href={href(`/category/${c.slug}`, lang)}>{t(c.name, lang)}</Link>
                </li>
              ))}
              <li>
                <Link href={href("/districts", lang)}>{t(ui.allDistricts, lang)}</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="About SJ24" className="sj-footer-col">
            <h2>SJ24</h2>
            <ul className="sj-footer-inline">
              {infoPages.map(([slug, title]) => (
                <li key={slug}>
                  <Link href={href(`/p/${slug}`, lang)}>{title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sj-footer-col">
            <h2>{as ? "অভিযোগ" : "Grievances"}</h2>
            <p>
              Grievance Officer: <em>name to be added</em>
              <br />
              Email: <em>to be added</em>
            </p>
          </div>
        </div>
        <div className="sj-wrap sj-footer-close">
          <p className="sj-footer-statement">
            {as ? "এখন দেশ, অজস্ৰ কণ্ঠ।" : "One country, countless voices."}
          </p>
          <a href="#main" className="sj-totop">
            {as ? "ওপৰলৈ" : "Back to top"} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      <div className="sj-footer-crowd">
        <p className="sj-footer-mark" aria-hidden="true">
          SJ24
        </p>
        <CrowdVideo
          pauseLabel={as ? "ভিডিঅ' ৰখাওক" : "Pause the crowd animation"}
          playLabel={as ? "ভিডিঅ' চলাওক" : "Play the crowd animation"}
        />
      </div>

      <div className="sj-footer-base">
        <p className="sj-wrap">
          © {new Date().getFullYear()} SATYAMEV JAYATE 24 · www.sj24.in · Gousamuh Gramaya Foundation
        </p>
      </div>
    </footer>
  );
}
