import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Boxes,
  Gauge,
  Layers,
  Link2,
  Truck,
  Upload,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/stores/cart";
import { parseMakerWorldUrl, parseUpload } from "@/lib/mock-parser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrintHub — Paste. Configure. Print." },
      {
        name: "description",
        content:
          "PrintHub turns a MakerWorld link or STL upload into a shipped part. Instant multi-material pricing, real-time tracking.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Zap,
    title: "Instant pricing",
    desc: "Live cost updates as you tune material, infill, and layer height — no back-and-forth quotes.",
  },
  {
    icon: Layers,
    title: "Multi-material",
    desc: "PLA, PETG, ABS, TPU, and resin. Pick color, finish, and layer resolution per part.",
  },
  {
    icon: Gauge,
    title: "Real-time tracking",
    desc: "Watch your order move through slicing, printing, and shipping.",
  },
  {
    icon: Link2,
    title: "MakerWorld integration",
    desc: "Paste any MakerWorld model URL and we handle the rest.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const setModel = useCart((s) => s.setConfiguratorModel);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const parsed = await parseMakerWorldUrl(url.trim());
      setModel(parsed);
      toast.success(`Loaded "${parsed.name}"`);
      navigate({ to: "/configure" });
    } catch {
      toast.error("Couldn't parse that link");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!/\.(stl|3mf|obj)$/i.test(file.name)) {
      toast.error("Upload an .stl, .3mf, or .obj file");
      return;
    }
    setLoading(true);
    try {
      const parsed = await parseUpload(file);
      setModel(parsed);
      toast.success(`Loaded "${parsed.name}"`);
      navigate({ to: "/configure" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mono text-[10px] uppercase tracking-widest text-primary border-primary/40">
              // print-on-demand infrastructure
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              From MakerWorld link to shipped part —{" "}
              <span className="text-primary">without the quote form.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Paste a model URL or drop an STL. Choose material, color, and finish.
              See the price update in real time. Order in under a minute.
            </p>
          </div>

          {/* Intake card */}
          <Card className="mx-auto mt-12 max-w-3xl border-border/80 bg-card/60 backdrop-blur glow-cyan">
            <CardContent className="p-6 md:p-8">
              <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                01 / intake
              </div>

              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://makerworld.com/en/models/123456"
                    className="pl-9 mono text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleUrl()}
                  />
                </div>
                <Button onClick={handleUrl} disabled={loading} className="mono">
                  {loading ? "Parsing…" : "Analyze URL"}
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span className="mono">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/60 hover:bg-muted/30"
                }`}
              >
                <Upload className="h-6 w-6 text-primary" />
                <div className="mt-3 text-sm font-medium">Drop an STL, 3MF, or OBJ</div>
                <div className="mono mt-1 text-xs text-muted-foreground">
                  or click to browse — max 100mb
                </div>
                <input
                  type="file"
                  accept=".stl,.3mf,.obj"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mono mb-8 text-[11px] uppercase tracking-widest text-muted-foreground">
          02 / capabilities
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group border-border/70 bg-card/60 transition-colors hover:border-primary/40"
            >
              <CardContent className="p-6">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-5 font-medium">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Materials strip */}
      <section id="materials" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mono mb-8 text-[11px] uppercase tracking-widest text-muted-foreground">
            03 / stock materials
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {["PLA", "PETG", "ABS", "TPU", "Resin"].map((m) => (
              <div
                key={m}
                className="rounded-md border border-border bg-background p-5 text-center"
              >
                <Boxes className="mx-auto h-5 w-5 text-primary" />
                <div className="mono mt-3 text-sm font-medium">{m}</div>
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  in stock
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <Truck className="mx-auto h-6 w-6 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold">Ready to configure your first print?</h2>
          <Button
            className="mt-6 mono"
            size="lg"
            onClick={() => navigate({ to: "/configure" })}
          >
            Open configurator →
          </Button>
        </div>
      </section>
    </div>
  );
}
