import { HomeView } from "@/components/sj24/views";
import { getLang } from "@/lib/sj24/i18n";

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function Home({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <HomeView lang={getLang(lang)} />;
}
