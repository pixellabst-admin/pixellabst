import { QuotePanel } from "@/components/quote-panel";
import { getSettings } from "@/lib/settings";
import { isValidWhatsapp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function QuotePage() {
  const settings = await getSettings();
  const showWhatsapp = settings.whatsappEnabled !== "0" && isValidWhatsapp(settings.whatsapp);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black">Solicitar cotización</h1>
      <p className="mt-1 text-slate-500">
        Arma tu lista y te enviamos los precios finales por WhatsApp.
      </p>
      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <QuotePanel
          whatsapp={showWhatsapp ? settings.whatsapp : undefined}
          storeName={settings.storeName}
        />
      </div>
    </div>
  );
}
