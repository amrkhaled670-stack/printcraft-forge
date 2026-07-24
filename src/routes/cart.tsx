import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, ArrowRight, PackageOpen } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";
import { money } from "@/lib/pricing";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — PrintHub" },
      { name: "description", content: "Review your configured prints before checkout." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Cart — PrintHub" },
      { property: "og:description", content: "Review your configured prints before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Cart — PrintHub" },
      { name: "twitter:description", content: "Review your configured prints before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateItem = useCart((s) => s.updateItem);
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = items.length ? 8.5 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mono mb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
          03 / cart
        </div>

        {items.length === 0 ? (
          <Card className="mx-auto max-w-lg border-border/70 bg-card/60">
            <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
              <PackageOpen className="h-8 w-8 text-primary" />
              <h2 className="text-xl font-semibold">Cart is empty</h2>
              <p className="text-sm text-muted-foreground">
                Configure a print to add it here.
              </p>
              <Button asChild className="mono">
                <Link to="/configure">Open configurator</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-border/70 bg-card/60">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{item.model.name}</h3>
                        <div className="mono mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                          <span>{item.materialName}</span>
                          <span>· {item.color}</span>
                          <span>· {item.layerHeight}mm layers</span>
                          <span>· {item.infillPct}% infill</span>
                          {item.finishing.length > 0 && (
                            <span>· finish: {item.finishing.join(", ")}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateItem(item.id, {
                              quantity: Math.max(1, item.quantity - 1),
                              lineTotal: Math.max(1, item.quantity - 1) * item.unitPrice,
                            })
                          }
                        >
                          −
                        </Button>
                        <span className="mono w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateItem(item.id, {
                              quantity: item.quantity + 1,
                              lineTotal: (item.quantity + 1) * item.unitPrice,
                            })
                          }
                        >
                          +
                        </Button>
                        <span className="mono ml-3 text-xs text-muted-foreground">
                          {money(item.unitPrice)} ea
                        </span>
                      </div>
                      <div className="mono text-lg font-semibold text-primary">
                        {money(item.lineTotal)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="sticky top-20 h-fit border-primary/40 bg-card/80 glow-cyan">
              <CardContent className="p-6">
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  order.summary
                </div>
                <div className="mt-4 space-y-2 mono text-sm">
                  <Row label="Subtotal" v={subtotal} />
                  <Row label="Shipping" v={shipping} />
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg">
                    <span>Total</span>
                    <span className="text-primary font-semibold">{money(total)}</span>
                  </div>
                </div>
                <Button
                  className="mt-6 w-full mono"
                  size="lg"
                  onClick={() => navigate({ to: "/checkout" })}
                >
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{money(v)}</span>
    </div>
  );
}
