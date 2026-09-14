import { TrackQuote } from "@/components/track-quote";
import { getSettings } from "@/lib/settings";
import { isValidWhatsapp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function TrackQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const settings = await getSettings();
  const showWhatsapp = settings.whatsappEnabled !== "0" && isValidWhatsapp(settings.whatsapp);
  return (
    <TrackQuote
      initialCode={code ?? ""}
      whatsapp={showWhatsapp ? settings.whatsapp : undefined}
      storeName={settings.storeName}
    />
  );
}
