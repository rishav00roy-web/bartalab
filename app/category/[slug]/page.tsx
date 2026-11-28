import { notFound } from "next/navigation";
import { ListView } from "@/components/sj24/views";
import { getLang, t } from "@/lib/sj24/i18n";
import { byDate, categoryOf } from "@/lib/sj24/sample";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export default async function Category({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = categoryOf(slug);
  if (!cat) notFound();
  const lang = getLang((await searchParams).lang);
  return (
    <ListView
      lang={lang}
      title={t(cat.name, lang)}
      path={`/category/${slug}`}
      active={slug}
      items={byDate.filter((s) => s.category === slug)}
    />
  );
}
