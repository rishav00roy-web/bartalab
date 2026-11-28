import { notFound } from "next/navigation";
import { InfoView } from "@/components/sj24/views";
import { infoPages } from "@/components/sj24/site";
import { getLang } from "@/lib/sj24/i18n";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };

export default async function InfoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!infoPages.some(([s]) => s === slug)) notFound();
  return <InfoView lang={getLang((await searchParams).lang)} slug={slug} />;
}
