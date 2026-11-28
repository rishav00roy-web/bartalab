import Link from "next/link";
import { href, t, ui, type Lang } from "@/lib/sj24/i18n";
import { dateTime } from "@/lib/sj24/format";
import {
  byDate,
  categoryOf,
  districtOf,
  districts,
  mostRead,
  stories,
  type Story,
} from "@/lib/sj24/sample";
import { ElasticDivider, LineFigure, NewsletterForm, PrintButton, RotatingWords } from "./client";
import { AdSlot, Kicker, Picture, SectionHead, SiteShell, StoryCard, infoPages } from "./site";

const SITE = "https://www.sj24.in";

function MostRead({ lang, strip }: { lang: Lang; strip?: boolean }) {
  return (
    <section className={strip ? "sj-mostread sj-mostread-strip" : "sj-mostread"} aria-labelledby="mr-h">
      <h2 id="mr-h" className="sj-rail-title">
        {t(ui.mostRead, lang)}
      </h2>
      <ol>
        {mostRead.map((s) => (
          <li key={s.slug}>
            <Link href={href(`/news/${s.slug}`, lang)}>{t(s.headline, lang)}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HomeView({ lang }: { lang: Lang }) {
  // The lead is the newest breaking story; editors will choose it in the newsroom later.
  const lead = byDate.find((s) => s.breaking) ?? byDate[0];
  const rest = byDate.filter((s) => s !== lead);
  const side = rest.slice(0, 4);
  const latest = rest.slice(4, 8);
  const ne = [
    ...stories.filter((s) => s.category === "northeast"),
    ...byDate.filter((s) => s.category === "national"),
  ];
  const districtStories = byDate.filter((s) => s.district).slice(0, 3);
  const videos = byDate.filter((s) => s.kind === "video");
  const photos = byDate.filter((s) => s.kind === "photo");
  const special = stories.filter((s) => s.category === "special-reports");
  const opinion = stories.filter((s) => s.category === "opinion");
  const rural = stories.filter((s) => ["agriculture", "culture"].includes(s.category));
  const regions =
    lang === "as" ? ["অসম", "উত্তৰ-পূব", "ভাৰত", "বিশ্ব"] : ["Assam", "the Northeast", "India", "the world"];

  return (
    <SiteShell lang={lang} path="/" active="home">
      <h1 className="visually-hidden">
        {lang === "as"
          ? "সত্যমেৱ জয়তে ২৪: অসম, উত্তৰ-পূব, ভাৰত আৰু বিশ্বৰ বাতৰি"
          : "SATYAMEV JAYATE 24: news from Assam, the Northeast, India and the world"}
      </h1>
      <div className="sj-wrap">
        <section className="sj-hero" aria-label="Top stories">
          <article className="sj-lead">
            <Link href={href(`/news/${lead.slug}`, lang)} tabIndex={-1} aria-hidden="true">
              <Picture story={lead} lang={lang} size="lg" />
            </Link>
            <Kicker story={lead} lang={lang} />
            <h2 className="sj-lead-title">
              <Link href={href(`/news/${lead.slug}`, lang)}>{t(lead.headline, lang)}</Link>
            </h2>
            <p className="sj-lead-sub">{t(lead.subheadline, lang)}</p>
            <p className="sj-meta">
              {t(ui.by, lang)} {lead.reporter} · <time dateTime={lead.publishedAt}>{dateTime(lead.publishedAt, lang)}</time>
            </p>
          </article>
          <div className="sj-hero-side">
            {side.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} variant="row" />
            ))}
          </div>
        </section>
        <MostRead lang={lang} strip />
      </div>

      <section className="sj-band">
        <div className="sj-wrap">
          <RotatingWords prefix={lang === "as" ? "SJ24 ৰ বাতৰি:" : "SJ24 reports from"} words={regions} />
        </div>
      </section>

      <div className="sj-wrap">
        <SectionHead title={t(ui.latest, lang)} lang={lang} />
        <div className="sj-grid-4">
          {latest.map((s) => (
            <StoryCard key={s.slug} story={s} lang={lang} />
          ))}
        </div>

        <AdSlot lang={lang} />
        <ElasticDivider />

        <section className="sj-districts" aria-labelledby="dist-h">
          <div className="sj-stage sj-districts-figure">
            <LineFigure
              kind="relay"
              label={
                lang === "as"
                  ? "সজ্জাৰ ৰেখাচিত্ৰ: এটা কেন্দ্ৰৰ পৰা শাখাবোৰলৈ সংযোগ।"
                  : "Decorative line drawing: one hub connected to branches of tiles; the route to the one you point at lights up."
              }
            />
            <p className="sj-stage-note">{lang === "as" ? "এটা নিউজৰুম · ৩৫খন জিলা" : "One newsroom · 35 districts"}</p>
          </div>
          <div className="sj-districts-copy">
            <SectionHead id="dist-h" title={t(ui.districts, lang)} more="/districts" lang={lang} />
            <ul className="sj-chips">
              {districts.slice(0, 14).map((d) => (
                <li key={d.slug}>
                  <Link href={href(`/district/${d.slug}`, lang)} className="sj-chip">
                    {t(d.name, lang)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={href("/districts", lang)} className="sj-chip sj-chip-strong">
                  {t(ui.allDistricts, lang)} ({districts.length})
                </Link>
              </li>
            </ul>
            <div className="sj-grid-3">
              {districtStories.map((s) => (
                <StoryCard key={s.slug} story={s} lang={lang} variant="text" />
              ))}
            </div>
          </div>
        </section>

        <ElasticDivider />

        <section aria-labelledby="ne-h">
          <SectionHead id="ne-h" title={t(ui.northeast, lang)} more="/category/northeast" lang={lang} />
          <div className="sj-grid-3">
            {ne.slice(0, 3).map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} />
            ))}
          </div>
        </section>
      </div>

      <section className="sj-video" aria-labelledby="v-h">
        <div className="sj-wrap">
          <SectionHead id="v-h" title={t(ui.video, lang)} lang={lang} />
          <div className="sj-video-grid">
            {videos.map((s, i) => (
              <StoryCard key={s.slug} story={s} lang={lang} variant={i === 0 ? "card" : "row"} />
            ))}
          </div>
        </div>
      </section>

      <div className="sj-wrap">
        <section aria-labelledby="g-h">
          <SectionHead id="g-h" title={t(ui.gallery, lang)} lang={lang} />
          <div className="sj-grid-3">
            {photos.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} />
            ))}
          </div>
        </section>

        <ElasticDivider />

        <div className="sj-two">
          <section aria-labelledby="sp-h">
            <SectionHead id="sp-h" title={t(ui.special, lang)} more="/category/special-reports" lang={lang} />
            {special.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} />
            ))}
          </section>
          <section aria-labelledby="op-h" className="sj-opinion">
            <SectionHead id="op-h" title={t(ui.opinion, lang)} more="/category/opinion" lang={lang} />
            {opinion.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} variant="text" />
            ))}
            <SectionHead title={t(ui.rural, lang)} lang={lang} />
            {rural.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} variant="row" />
            ))}
          </section>
        </div>
      </div>

      <section className="sj-cta" aria-labelledby="cta-h">
        <div className="sj-wrap sj-stage sj-cta-inner">
          <div>
            <p className="sj-eyebrow">{lang === "as" ? "দৈনিক বাতৰি-পত্ৰ" : "Daily newsletter"}</p>
            <h2 id="cta-h">{lang === "as" ? "প্ৰতিদিনে ৰাতিপুৱা SJ24" : "SJ24, every morning"}</h2>
            <p>
              {lang === "as"
                ? "অসম আৰু উত্তৰ-পূবৰ দিনটোৰ আটাইতকৈ গুৰুত্বপূৰ্ণ বাতৰি, প্ৰতিদিনে ৰাতিপুৱা এবাৰ, অসমীয়া বা ইংৰাজীত।"
                : "The day's most important stories from Assam and the Northeast, once every morning, in English or Assamese."}
            </p>
            <NewsletterForm lang={lang} />
            <p className="sj-news-small">
              {lang === "as" ? "বিনামূলীয়া। আপোনাৰ ইমেইল কেৱল বাতৰি-পত্ৰৰ বাবে ব্যৱহাৰ কৰা হ'ব।" : "Free. We use your email only to send the newsletter."}{" "}
              <Link href={href("/p/privacy", lang)}>{lang === "as" ? "গোপনীয়তা নীতি" : "Privacy Policy"}</Link>
            </p>
          </div>
          <div className="sj-cta-figure">
            <LineFigure
              kind="dish"
              label={
                lang === "as"
                  ? "সজ্জাৰ ৰেখাচিত্ৰ: এখন উপগ্ৰহ এণ্টেনা।"
                  : "Decorative line drawing: a satellite dish that turns to follow the pointer."
              }
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export function ArticleView({ story, lang }: { story: Story; lang: Lang }) {
  const dist = districtOf(story.district);
  const related = byDate.filter((s) => s.category === story.category && s.slug !== story.slug).slice(0, 3);
  const more = related.length ? related : byDate.filter((s) => s.slug !== story.slug).slice(0, 3);
  const url = `${SITE}/news/${story.slug}`;
  const title = t(story.headline, lang);
  const shares = [
    ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
    ["X", `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`],
  ];
  return (
    <SiteShell lang={lang} path={`/news/${story.slug}`} active={story.category}>
      <div className="sj-wrap sj-article-layout">
        <article className="sj-article">
          <Kicker story={story} lang={lang} />
          <h1 className="sj-article-title">{title}</h1>
          <p className="sj-article-sub">{t(story.subheadline, lang)}</p>
          <div className="sj-byline">
            <p>
              <strong>
                {t(ui.by, lang)} {story.reporter}
              </strong>
              {dist && <> · {t(dist.name, lang)}</>}
            </p>
            <p className="sj-meta">
              <time dateTime={story.publishedAt}>{dateTime(story.publishedAt, lang)}</time>
              {story.updatedAt && (
                <>
                  {" "}
                  · {lang === "as" ? "আপডেট" : "Updated"}{" "}
                  <time dateTime={story.updatedAt}>{dateTime(story.updatedAt, lang)}</time>
                </>
              )}
            </p>
          </div>

          <figure className="sj-article-figure">
            <Picture story={story} lang={lang} size="lg" />
            <figcaption>
              {story.caption ? t(story.caption, lang) : lang === "as" ? "নমুনা ছবি" : "Sample picture"}
              <span className="sj-credit"> · {lang === "as" ? "ছবি" : "Photo"}: {story.credit ?? "SJ24"}</span>
            </figcaption>
          </figure>

          {story.correction && (
            <aside className="sj-correction" aria-label={t(ui.correction, lang)}>
              <strong>{t(ui.correction, lang)}:</strong> {t(story.correction, lang)}
            </aside>
          )}

          <div className="sj-article-body">
            {story.body.map((p, i) => (
              <p key={i}>{t(p, lang)}</p>
            ))}
          </div>

          <div className="sj-share" aria-label={t(ui.share, lang)}>
            <span>{t(ui.share, lang)}</span>
            {shares.map(([name, link]) => (
              <a key={name} href={link} className="sj-share-btn" target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ))}
            <PrintButton label={t(ui.print, lang)} />
          </div>

          <ul className="sj-tags" aria-label="Tags">
            {story.tags.map((tag) => {
              const c = categoryOf(tag);
              const d = districtOf(tag);
              const name = c ? t(c.name, lang) : d ? t(d.name, lang) : tag;
              const link = c ? `/category/${tag}` : `/district/${tag}`;
              return (
                <li key={tag}>
                  <Link href={href(link, lang)} className="sj-chip">
                    #{name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </article>
        <aside className="sj-rail">
          <AdSlot lang={lang} size="box" />
          <MostRead lang={lang} />
        </aside>
      </div>
      <div className="sj-wrap">
        <ElasticDivider />
        <SectionHead title={t(ui.related, lang)} lang={lang} />
        <div className="sj-grid-3">
          {more.map((s) => (
            <StoryCard key={s.slug} story={s} lang={lang} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

export function ListView({
  lang,
  title,
  path,
  active,
  items,
}: {
  lang: Lang;
  title: string;
  path: string;
  active?: string;
  items: Story[];
}) {
  return (
    <SiteShell lang={lang} path={path} active={active}>
      <div className="sj-wrap">
        <h1 className="sj-page-title">{title}</h1>
        {path === "/search" && (
          <form action="/search" method="get" className="sj-search sj-search-page" role="search">
            <label htmlFor="sj-q2" className="visually-hidden">
              {t(ui.search, lang)}
            </label>
            <input id="sj-q2" name="q" type="search" placeholder={t(ui.search, lang)} className="sj-search-input" />
            {lang === "as" && <input type="hidden" name="lang" value="as" />}
            <button type="submit" className="sj-btn">
              {t(ui.search, lang)}
            </button>
          </form>
        )}
        {path === "/search" && !items.length && (
          <div className="sj-stage sj-search-stage">
            <LineFigure kind="loupe" label={lang === "as" ? "সজ্জাৰ ৰেখাচিত্ৰ: এখন বিবৰ্ধক কাঁচ।" : "Decorative line drawing: a magnifying glass passing over a page."} />
          </div>
        )}
        {items.length ? (
          <div className="sj-grid-3">
            {items.map((s) => (
              <StoryCard key={s.slug} story={s} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="sj-empty">{t(ui.noStories, lang)}</p>
        )}
      </div>
    </SiteShell>
  );
}

export function DistrictsView({ lang }: { lang: Lang }) {
  return (
    <SiteShell lang={lang} path="/districts">
      <div className="sj-wrap">
        <h1 className="sj-page-title">{t(ui.allDistricts, lang)}</h1>
        <ul className="sj-district-grid">
          {districts.map((d) => {
            const count = stories.filter((s) => s.district === d.slug).length;
            return (
              <li key={d.slug}>
                <Link href={href(`/district/${d.slug}`, lang)}>
                  <span>{t(d.name, lang)}</span>
                  <small>{count}</small>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </SiteShell>
  );
}

export function InfoView({ lang, slug }: { lang: Lang; slug: string }) {
  const page = infoPages.find(([s]) => s === slug);
  if (!page) return null;
  return (
    <SiteShell lang={lang} path={`/p/${slug}`}>
      <div className="sj-wrap sj-info">
        <h1 className="sj-page-title">{page[1]}</h1>
        <p>
          The text for this page will come from SJ24. Publisher: Gousamuh Gramaya Foundation (GGF), a Section 8
          company.
        </p>
      </div>
    </SiteShell>
  );
}
