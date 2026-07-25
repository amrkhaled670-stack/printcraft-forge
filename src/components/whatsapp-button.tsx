import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "201069198397"; // +20 106 919 8397
export const WHATSAPP_DISPLAY = "+20 106 919 8397";

export function buildWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppFloatingButton() {
  const { t } = useTranslation();
  const href = buildWhatsappUrl(t("whatsapp.supportGreeting"));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.contact")}
      title={t("whatsapp.contact")}
      className="fixed bottom-5 end-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 ring-2 ring-black/20 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
