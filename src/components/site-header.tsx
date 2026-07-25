import { Link, useNavigate } from "@tanstack/react-router";
import { Boxes, ShoppingCart, LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-role";
import { useCart } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CurrencySwitcher } from "@/components/currency-switcher";

export function SiteHeader() {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const items = useCart((s) => s.items);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>
          <span className="mono text-lg font-semibold tracking-tight">
            print<span className="text-primary">hub</span>
          </span>
          <Badge variant="outline" className="ms-2 mono text-[10px] uppercase text-muted-foreground">
            v0.1
          </Badge>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/configure"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            {t("nav.configure")}
          </Link>
          <a
            href="/#how"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.how")}
          </a>
          <a
            href="/#materials"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.materials")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <CurrencySwitcher />
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm" aria-label={t("nav.cart")}>
            <Link to="/cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="mono">{items.length}</span>
            </Link>
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("nav.dashboard")}</span>
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("nav.admin")}</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.signOut")}</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">
                <UserIcon className="h-4 w-4" />
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
