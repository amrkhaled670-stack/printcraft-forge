import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyDirection, SUPPORTED_LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "en").slice(0, 2);

  const toggle = () => {
    const next = current === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
    applyDirection(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Toggle language"
      className="mono"
      title={SUPPORTED_LANGS.join(" / ")}
    >
      <Languages className="h-4 w-4" />
      <span className="uppercase text-xs">{current === "ar" ? "EN" : "ع"}</span>
    </Button>
  );
}
