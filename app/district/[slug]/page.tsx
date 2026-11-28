import { notFound } from "next/navigation";
import { ListView } from "@/components/sj24/views";
import { getLang, t } from "@/lib/sj24/i18n";
import { byDate, districtOf } from "@/lib/sj24/sample";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export default async function District({ params, searchParams }: Props) {
  const { slug } = await params;
  const d = districtOf(slug);
  if (!d) notFound();
  const lang = getLang((await searchParams).lang);
  return (
    <ListView
      lang={lang}
      title={t(d.name, lang)}
      path={`/district/${slug}`}
      items={byDate.filter((s) => s.district === slug)}
    />
  );
}
