import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/sj24/views";
import { getLang, t } from "@/lib/sj24/i18n";
import { storyOf } from "@/lib/sj24/sample";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const story = storyOf((await params).slug);
  if (!story) return {};
  const lang = getLang((await searchParams).lang);
  const title = t(story.headline, lang);
  const description = t(story.subheadline, lang);
  return {
    title,
    description,
    alternates: { canonical: `/news/${story.slug}`, languages: { en: `/news/${story.slug}`, as: `/news/${story.slug}?lang=as` } },
    openGraph: { type: "article", title, description, publishedTime: story.publishedAt, siteName: "SATYAMEV JAYATE 24" },
  };
}

export default async function Article({ params, searchParams }: Props) {
  const story = storyOf((await params).slug);
  if (!story) notFound();
  return <ArticleView story={story} lang={getLang((await searchParams).lang)} />;
}
