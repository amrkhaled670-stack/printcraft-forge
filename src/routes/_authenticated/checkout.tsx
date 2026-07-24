import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "@/stores/cart";
import { money } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { GOVERNORATES, governorateLabel, shippingFor } from "@/lib/shipping";
import { buildWhatsappUrl } from "@/components/whatsapp-button";

type PaymentMethod = "cod" | "vodafone_cash" | "instapay";

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
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "en").slice(0, 2);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();

  const [addr, setAddr] = useState({
    name: "",
    line1: "",
    city: "",
    postal: "",
    country: "Egypt",
  });
  const [governorate, setGovernorate] = useState<string>("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = useMemo(() => shippingFor(governorate), [governorate]);
  const total = subtotal + shipping;

  const uploadReceipt = async (uid: string, orderId: string): Promise<string | null> => {
    if (!receipt) return null;
    const ext = receipt.name.split(".").pop() ?? "bin";
    const path = `${uid}/${orderId}.${ext}`;
    const { error } = await supabase.storage
      .from("payment-receipts")
      .upload(path, receipt, { upsert: true, contentType: receipt.type });
    if (error) throw error;
    return path;
  };

  const validate = (): boolean => {
    if (!items.length) {
      toast.error(t("checkout.cartEmpty"));
      return false;
    }
    if (!addr.name || !addr.line1 || !addr.city) {
      toast.error(t("checkout.completeAddress"));
      return false;
    }
    if (!governorate) {
      toast.error(t("checkout.selectGovernorateError"));
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validate()) return;
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
          delivery_address: { ...addr, governorate: governorateLabel(governorate, "en") },
          notes,
          governorate,
          payment_method: payment,
          shipping_cost: shipping,
        } as any)
        .select("id")
        .single();
      if (orderErr) throw orderErr;

      const receiptPath = await uploadReceipt(uid, order.id);
      if (receiptPath) {
        await supabase
          .from("orders")
          .update({ receipt_url: receiptPath } as any)
          .eq("id", order.id);
      }

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
      toast.success(t("checkout.orderPlaced"));
      navigate({ to: "/order-confirmed", search: { id: order.id } });
    } catch (e: any) {
      toast.error(e.message ?? t("common.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const orderViaWhatsapp = () => {
    if (!validate()) return;
    const paymentLabel =
      payment === "cod" ? t("checkout.cod")
      : payment === "vodafone_cash" ? t("checkout.vodafoneCash")
      : t("checkout.instapay");
    const lines: string[] = [];
    lines.push(`*PrintHub — ${t("checkout.title")}*`);
    lines.push("");
    lines.push(`*${t("checkout.fullName")}:* ${addr.name}`);
    lines.push(`*${t("checkout.addressLine")}:* ${addr.line1}`);
    lines.push(`*${t("checkout.city")}:* ${addr.city}`);
    lines.push(`*${t("checkout.governorate")}:* ${governorateLabel(governorate, lang)}`);
    if (addr.postal) lines.push(`*${t("checkout.postal")}:* ${addr.postal}`);
    lines.push(`*${t("checkout.country")}:* ${addr.country}`);
    lines.push(`*${t("checkout.paymentMethod")}:* ${paymentLabel}`);
    lines.push("");
    lines.push(`*${t("cart.title")}:*`);
    for (const it of items) {
      lines.push(
        `• ${it.model.name} × ${it.quantity} — ${it.materialName} / ${it.color} / ${it.infillPct}% — ${money(it.lineTotal)}`,
      );
    }
    lines.push("");
    lines.push(`*${t("cart.subtotal")}:* ${money(subtotal)}`);
    lines.push(`*${t("cart.shipping")}:* ${money(shipping)}`);
    lines.push(`*${t("cart.total")}:* ${money(total)}`);
    if (notes) {
      lines.push("");
      lines.push(`*${t("checkout.notes")}:* ${notes}`);
    }
    window.open(buildWhatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mono mb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
          04 / {t("checkout.title").toLowerCase()}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border-border/70 bg-card/60">
            <CardContent className="space-y-5 p-6">
              <div>
                <h2 className="text-lg font-semibold">{t("checkout.deliveryAddress")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("checkout.deliveryHint")}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("checkout.fullName")} v={addr.name} on={(v) => setAddr({ ...addr, name: v })} />
                <Field label={t("checkout.country")} v={addr.country} on={(v) => setAddr({ ...addr, country: v })} />
              </div>
              <Field label={t("checkout.addressLine")} v={addr.line1} on={(v) => setAddr({ ...addr, line1: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("checkout.city")} v={addr.city} on={(v) => setAddr({ ...addr, city: v })} />
                <Field label={t("checkout.postal")} v={addr.postal} on={(v) => setAddr({ ...addr, postal: v })} />
              </div>

              <div>
                <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("checkout.governorate")}
                </Label>
                <Select value={governorate} onValueChange={setGovernorate}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t("checkout.selectGovernorate")} />
                  </SelectTrigger>
                  <SelectContent>
                    {GOVERNORATES.map((g) => (
                      <SelectItem key={g.key} value={g.key}>
                        {lang === "ar" ? g.ar : g.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-base font-semibold">{t("checkout.paymentMethod")}</h3>
                <RadioGroup
                  value={payment}
                  onValueChange={(v) => setPayment(v as PaymentMethod)}
                  className="mt-3 gap-2"
                >
                  {(["cod", "vodafone_cash", "instapay"] as PaymentMethod[]).map((m) => (
                    <label
                      key={m}
                      htmlFor={`pm-${m}`}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-border/70 p-3 hover:bg-accent/40"
                    >
                      <RadioGroupItem id={`pm-${m}`} value={m} />
                      <span className="text-sm">
                        {m === "cod" ? t("checkout.cod") : m === "vodafone_cash" ? t("checkout.vodafoneCash") : t("checkout.instapay")}
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                {payment === "vodafone_cash" && (
                  <div className="mt-3 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">
                    {t("checkout.vodafoneInstructions")}
                  </div>
                )}

                <div className="mt-4">
                  <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {t("checkout.uploadReceipt")}
                  </Label>
                  <div className="mt-2 flex items-center gap-3">
                    <label
                      htmlFor="receipt-upload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      {receipt ? receipt.name : t("checkout.uploadReceipt")}
                    </label>
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                    />
                    {receipt && (
                      <span className="mono text-xs text-primary">{t("checkout.receiptUploaded")}</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("checkout.notes")}
                </Label>
                <Textarea
                  className="mt-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("checkout.notesPlaceholder")}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="sticky top-20 h-fit border-primary/40 bg-card/80 glow-cyan">
            <CardContent className="p-6">
              <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {t("checkout.orderSummary")}
              </div>
              <div className="mt-4 space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="truncate pe-2">
                      {i.model.name}{" "}
                      <span className="text-muted-foreground mono text-xs">× {i.quantity}</span>
                    </span>
                    <span className="mono">{money(i.lineTotal)}</span>
                  </div>
                ))}
                <Separator className="my-3" />
                <Row label={t("cart.subtotal")} v={subtotal} />
                <Row label={t("cart.shipping")} v={shipping} />
                <Separator className="my-3" />
                <div className="flex justify-between text-lg">
                  <span>{t("cart.total")}</span>
                  <span className="mono text-primary font-semibold">{money(total)}</span>
                </div>
              </div>
              <Button
                onClick={placeOrder}
                disabled={submitting}
                className="mt-6 w-full mono"
                size="lg"
              >
                {submitting ? t("checkout.placing") : t("checkout.placeOrder")}
                <CheckCircle2 className="ms-2 h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={orderViaWhatsapp}
                variant="outline"
                className="mt-3 w-full mono border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
                size="lg"
              >
                <MessageCircle className="me-2 h-4 w-4" />
                {t("checkout.orderViaWhatsapp")}
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
