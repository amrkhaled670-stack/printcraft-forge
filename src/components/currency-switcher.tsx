import { Button } from "@/components/ui/button";
import { useCurrency } from "@/stores/currency";

export function CurrencySwitcher() {
  const currency = useCurrency((s) => s.currency);
  const toggle = useCurrency((s) => s.toggle);
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Toggle currency"
      className="mono uppercase text-xs"
      title="Switch USD / EGP"
    >
      {currency}
    </Button>
  );
}
