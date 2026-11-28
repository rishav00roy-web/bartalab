import { DistrictsView } from "@/components/sj24/views";
import { getLang } from "@/lib/sj24/i18n";

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function Districts({ searchParams }: Props) {
  return <DistrictsView lang={getLang((await searchParams).lang)} />;
}
