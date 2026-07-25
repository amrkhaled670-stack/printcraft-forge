import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Clock, Ruler, Weight, ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { ModelPreview } from "@/components/model-preview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCart } from "@/stores/cart";
import { useMaterials, useSettings } from "@/lib/queries";
import { calcPrice, useMoney, DEFAULT_SETTINGS } from "@/lib/pricing";


export const Route = createFileRoute("/configure")({
  head: () => ({
    meta: [
      { title: "Configure your print — PrintHub" },
      { name: "description", content: "Pick material, color, infill, and finish with live multi-material pricing before you check out." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Configure your print — PrintHub" },
      { property: "og:description", content: "Pick material, color, infill, and finish with live pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Configure your print — PrintHub" },
      { name: "twitter:description", content: "Pick material, color, infill, and finish with live pricing." },
    ],
  }),
  component: Configure,
});

const LAYER_HEIGHTS = [0.1, 0.2, 0.3];
const INFILL_STEPS = [15, 20, 50, 100];
const FINISHING = [
  { id: "sanding", label: "Sanding" },
  { id: "dyeing", label: "Dyeing" },
  { id: "assembly", label: "Assembly" },
];

function Configure() {
  const navigate = useNavigate();
  const model = useCart((s) => s.configuratorModel);
  const setModel = useCart((s) => s.setConfiguratorModel);
  const addItem = useCart((s) => s.addItem);

  const { data: materials = [] } = useMaterials();
  const { data: settings = DEFAULT_SETTINGS } = useSettings();

  const [materialId, setMaterialId] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [layerHeight, setLayerHeight] = useState(0.2);
  const [infillPct, setInfillPct] = useState(20);
  const [finishing, setFinishing] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // No model in state — send them back to the intake page.
  useEffect(() => {
    if (!model) navigate({ to: "/" });
  }, [model, navigate]);

  useEffect(() => {
    if (materials.length && !materialId) {
      setMaterialId(materials[0]!.id);
      setColor(materials[0]!.color_options[0] ?? "Black");
    }
  }, [materials, materialId]);

  const material = materials.find((m) => m.id === materialId);

  const breakdown = useMemo(() => {
    if (!model || !material) return null;
    return calcPrice({
      pricePerGram: Number(material.price_per_gram),
      weightG: model.est_weight_g,
      printTimeMin: model.est_print_time_min,
      infillPct,
      finishing,
      quantity,
      settings,
    });
  }, [model, material, infillPct, finishing, quantity, settings]);

  const addToCart = () => {
    if (!model || !material || !breakdown) return;
    addItem({
      id: crypto.randomUUID(),
      model,
      materialId: material.id,
      materialName: material.name,
      pricePerGram: Number(material.price_per_gram),
      color,
      layerHeight,
      infillPct,
      finishing,
      quantity,
      unitPrice: breakdown.unit,
      lineTotal: breakdown.total,
    });
    toast.success("Added to cart");
    navigate({ to: "/cart" });
  };

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
          <div className="mono text-sm">Loading model…</div>
        </div>
      </div>
    );
  }

  const hours = Math.floor(model.est_print_time_min / 60);
  const mins = model.est_print_time_min % 60;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mono mb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
          02 / configure
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Left: preview + metadata */}
          <div className="space-y-6">
            <Card className="border-border/70 bg-card/60">
              <CardContent className="p-6">
                <ModelPreview
                  dimensions={model.dimensions_mm}
                  thumbnailUrl={model.thumbnail_url}
                  fileUrl={model.file_url}
                  fileFormat={model.file_format}
                />
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/60">
              <CardContent className="p-6">
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  model.metadata
                </div>
                <h2 className="mt-2 text-xl font-semibold">{model.name}</h2>
                <div className="mt-1 mono text-xs text-muted-foreground uppercase tracking-wider">
                  source: {model.source}
                  {model.source_id && ` · #${model.source_id}`}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Stat
                    icon={<Ruler className="h-4 w-4" />}
                    label="Dimensions"
                    value={
                      model.dimensions_mm.x > 0
                        ? `${model.dimensions_mm.x}×${model.dimensions_mm.y}×${model.dimensions_mm.z}`
                        : "—"
                    }
                    unit={model.dimensions_mm.x > 0 ? "mm" : ""}
                  />
                  <Stat
                    icon={<Weight className="h-4 w-4" />}
                    label="Est. weight"
                    value={model.est_weight_g.toString()}
                    unit="g"
                  />
                  <Stat
                    icon={<Clock className="h-4 w-4" />}
                    label="Print time"
                    value={hours ? `${hours}h ${mins}m` : `${mins}m`}
                    unit=""
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: config panel */}
          <div className="space-y-6">
            <Card className="border-border/70 bg-card/60">
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Material
                  </Label>
                  <Select value={materialId} onValueChange={setMaterialId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Pick material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="mono">{m.type}</span> · {m.name} ·{" "}
                          <span className="text-muted-foreground">
                            {money(Number(m.price_per_gram))}/g
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {material && (
                  <div>
                    <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Color
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {material.color_options.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                            color === c
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span
                            className="mr-2 inline-block h-3 w-3 rounded-full border border-border align-middle"
                            style={{ backgroundColor: colorToCss(c) }}
                          />
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Layer height
                    </Label>
                    <span className="mono text-sm text-primary">{layerHeight.toFixed(2)}mm</span>
                  </div>
                  <Slider
                    className="mt-3"
                    min={0}
                    max={2}
                    step={1}
                    value={[LAYER_HEIGHTS.indexOf(layerHeight)]}
                    onValueChange={([v]) => setLayerHeight(LAYER_HEIGHTS[v ?? 1]!)}
                  />
                  <div className="mono mt-2 flex justify-between text-[10px] uppercase text-muted-foreground">
                    <span>0.10 fine</span>
                    <span>0.20 std</span>
                    <span>0.30 fast</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Infill
                    </Label>
                    <span className="mono text-sm text-primary">{infillPct}%</span>
                  </div>
                  <Slider
                    className="mt-3"
                    min={0}
                    max={3}
                    step={1}
                    value={[INFILL_STEPS.indexOf(infillPct)]}
                    onValueChange={([v]) => setInfillPct(INFILL_STEPS[v ?? 1]!)}
                  />
                  <div className="mono mt-2 flex justify-between text-[10px] uppercase text-muted-foreground">
                    {INFILL_STEPS.map((s) => (
                      <span key={s}>{s}%</span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Finishing
                  </Label>
                  <div className="mt-3 space-y-2">
                    {FINISHING.map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={finishing.includes(f.id)}
                            onCheckedChange={(v) =>
                              setFinishing((cur) =>
                                v ? [...cur, f.id] : cur.filter((x) => x !== f.id),
                              )
                            }
                          />
                          {f.label}
                        </div>
                        <span className="mono text-xs text-muted-foreground">
                          +{money(settings.finishingPrices[f.id] ?? 0)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Quantity
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      −
                    </Button>
                    <div className="mono w-12 text-center text-sm">{quantity}</div>
                    <Button variant="outline" size="sm" onClick={() => setQuantity((q) => q + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sticky price */}
            <Card className="sticky top-20 border-primary/40 bg-card/80 glow-cyan">
              <CardContent className="p-6">
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  live estimate
                </div>
                {breakdown ? (
                  <>
                    <div className="mt-2 flex items-baseline justify-between">
                      <div className="mono text-4xl font-semibold text-primary">
                        {money(breakdown.total)}
                      </div>
                      <div className="mono text-xs text-muted-foreground">
                        {money(breakdown.unit)} × {quantity}
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5 mono text-xs text-muted-foreground">
                      <Row label="Material" v={breakdown.material} />
                      <Row label="Print time" v={breakdown.time} />
                      <Row label="Finishing" v={breakdown.finishing} />
                      <Row label="Markup" v={breakdown.markup} />
                    </div>
                    <Button onClick={addToCart} className="mt-6 w-full mono" size="lg">
                      Add to cart <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="mono mt-2 text-sm text-muted-foreground">Loading…</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/50 p-3">
      <div className="flex items-center gap-2 mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mono mt-2 text-sm">
        {value}
        {unit && <span className="ml-1 text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{money(v)}</span>
    </div>
  );
}

function colorToCss(name: string): string {
  const map: Record<string, string> = {
    Black: "#111",
    White: "#f5f5f5",
    Gray: "#7a7a7a",
    Silver: "#c0c0c0",
    Clear: "rgba(200,220,230,0.5)",
    Red: "#e0453a",
    Orange: "#f07a1f",
    Blue: "#2a72d4",
    Cyan: "#22d3ee",
    Green: "#2fb46a",
    "Neon Green": "#39ff14",
  };
  return map[name] ?? "#888";
}
