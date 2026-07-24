import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useCart } from "@/stores/cart";
import { money } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — PrintHub" },
      { name: "description", content: "Enter delivery details and place your PrintHub order." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout — PrintHub" },
      { property: "og:description", content: "Enter delivery details and place your PrintHub order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [addr, setAddr] = useState({
    name: "",
    line1: "",
    city: "",
    postal: "",
    country: "",
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = items.length ? 8.5 : 0;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (!items.length) {
      toast.error("Cart is empty");
      return;
    }
    if (!addr.name || !addr.line1 || !addr.city) {
      toast.error("Please complete your delivery address");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("Not signed in");

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: uid,
          status: "pending",
          total_price: total,
          delivery_address: addr,
          notes,
        })
        .select("id")
        .single();
      if (orderErr) throw orderErr;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          material_id: i.materialId,
          layer_height: i.layerHeight,
          infill_pct: i.infillPct,
          color: i.color,
          finishing_options: i.finishing,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          line_total: i.lineTotal,
          model_name: i.model.name,
          material_name: i.materialName,
        })),
      );
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Order placed");
      navigate({ to: "/order-confirmed", search: { id: order.id } });
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mono mb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
          04 / checkout
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-border/70 bg-card/60">
            <CardContent className="space-y-5 p-6">
              <div>
                <h2 className="text-lg font-semibold">Delivery address</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Where should we ship your prints?
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" v={addr.name} on={(v) => setAddr({ ...addr, name: v })} />
                <Field label="Country" v={addr.country} on={(v) => setAddr({ ...addr, country: v })} />
              </div>
              <Field label="Address line" v={addr.line1} on={(v) => setAddr({ ...addr, line1: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" v={addr.city} on={(v) => setAddr({ ...addr, city: v })} />
                <Field label="Postal code" v={addr.postal} on={(v) => setAddr({ ...addr, postal: v })} />
              </div>

              <div>
                <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Order notes (optional)
                </Label>
                <Textarea
                  className="mt-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special handling, deadlines, orientation…"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="sticky top-20 h-fit border-primary/40 bg-card/80 glow-cyan">
            <CardContent className="p-6">
              <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                order.summary
              </div>
              <div className="mt-4 space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2">
                      {i.model.name}{" "}
                      <span className="text-muted-foreground mono text-xs">
                        × {i.quantity}
                      </span>
                    </span>
                    <span className="mono">{money(i.lineTotal)}</span>
                  </div>
                ))}
                <Separator className="my-3" />
                <Row label="Subtotal" v={subtotal} />
                <Row label="Shipping" v={shipping} />
                <Separator className="my-3" />
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="mono text-primary font-semibold">{money(total)}</span>
                </div>
              </div>
              <Button
                onClick={placeOrder}
                disabled={submitting}
                className="mt-6 w-full mono"
                size="lg"
              >
                {submitting ? "Placing…" : "Place order"}
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input className="mt-2" value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex justify-between text-sm mono">
      <span className="text-muted-foreground">{label}</span>
      <span>{money(v)}</span>
    </div>
  );
}
