import { ListView } from "@/components/sj24/views";
import { getLang, t, ui } from "@/lib/sj24/i18n";
import { byDate } from "@/lib/sj24/sample";

type Props = { searchParams: Promise<{ lang?: string; q?: string }> };

export default async function Search({ searchParams }: Props) {
  const sp = await searchParams;
  const lang = getLang(sp.lang);
  const q = (sp.q ?? "").trim().toLowerCase().slice(0, 100);
  const items = q
    ? byDate.filter((s) =>
        [s.headline.en, s.headline.as, s.subheadline.en, s.subheadline.as].some((x) => x.toLowerCase().includes(q)),
      )
    : [];
  return <ListView lang={lang} title={`${t(ui.results, lang)}: “${sp.q ?? ""}”`} path="/search" items={items} />;
}
