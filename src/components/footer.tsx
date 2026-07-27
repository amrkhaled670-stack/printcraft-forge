import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 bg-background/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <p className="mono">© {new Date().getFullYear()} Print Forge</p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link to="/refund-policy" className="transition-colors hover:text-foreground">
            {t("footer.refund")}
          </Link>
          <Link to="/terms-of-service" className="transition-colors hover:text-foreground">
            {t("footer.terms")}
          </Link>
          <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
            {t("footer.privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
