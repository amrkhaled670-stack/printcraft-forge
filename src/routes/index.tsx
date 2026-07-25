import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Boxes,
  Gauge,
  Layers,
  Link2,
  Truck,
  Upload,
  Zap,
  Cog,
  FileBox,
  DollarSign,
  MapPin,
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
      { title: "PrintHub — 3D Printing Service in Egypt · MakerWorld & STL" },
      {
        name: "description",
        content:
          "On-demand 3D printing in Egypt. Paste a MakerWorld link or upload an STL, pick material and finish, and we ship to every governorate. Live pricing, real-time tracking.",
      },
      { property: "og:title", content: "PrintHub — 3D Printing Service in Egypt" },
      { property: "og:description", content: "MakerWorld & STL to shipped part. PLA, PETG, ABS, TPU, resin. Nationwide delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PrintHub — 3D Printing Service in Egypt" },
      { name: "twitter:description", content: "MakerWorld & STL to shipped part. Nationwide delivery across Egypt." },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setModel = useCart((s) => s.setConfiguratorModel);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const features = [
    { icon: Zap, title: t("landing.features.instantTitle"), desc: t("landing.features.instantDesc") },
    { icon: Layers, title: t("landing.features.multiTitle"), desc: t("landing.features.multiDesc") },
    { icon: Gauge, title: t("landing.features.trackTitle"), desc: t("landing.features.trackDesc") },
    { icon: Link2, title: t("landing.features.makerTitle"), desc: t("landing.features.makerDesc") },
  ];

  const services = [
    { icon: Cog, title: t("landing.about.servicesTitle"), body: t("landing.about.servicesBody") },
    { icon: FileBox, title: t("landing.about.filesTitle"), body: t("landing.about.filesBody") },
    { icon: DollarSign, title: t("landing.about.pricingTitle"), body: t("landing.about.pricingBody") },
    { icon: MapPin, title: t("landing.about.shippingTitle"), body: t("landing.about.shippingBody") },
  ];

  const handleUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const parsed = await parseMakerWorldUrl(url.trim());
      setModel(parsed);
      toast.success(t("landing.loadedToast", { name: parsed.name }));
      navigate({ to: "/configure" });
    } catch {
      toast.error(t("landing.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!/\.(stl|3mf|obj)$/i.test(file.name)) {
      toast.error(t("landing.fileTypeError"));
      return;
    }
    setLoading(true);
    try {
      const parsed = await parseUpload(file);
      setModel(parsed);
      toast.success(t("landing.loadedToast", { name: parsed.name }));
      navigate({ to: "/configure" });
    } finally {
      setLoading(false);
    }
  };

  // JSON-LD for GEO/LLMO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "PrintHub 3D Printing",
    areaServed: { "@type": "Country", name: "Egypt" },
    serviceType: "3D printing on demand",
    provider: {
      "@type": "Organization",
      name: "PrintHub",
      telephone: "+201069198397",
      areaServed: "EG",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Materials",
      itemListElement: ["PLA", "PETG", "ABS", "TPU", "Resin"].map((m) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: `${m} 3D printing` },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <Badge variant="outline" className="mono text-[10px] uppercase tracking-widest text-primary border-primary/40">
              {t("landing.heroBadge")}
            </Badge>
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl"
            >
              {t("landing.heroHeadline1")}{" "}
              <span className="text-primary">{t("landing.heroHeadline2")}</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg text-muted-foreground"
            >
              {t("landing.heroSubtitle")}
            </motion.p>
          </motion.div>

          {/* Intake card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <Card className="mx-auto mt-12 max-w-3xl border-border/80 bg-card/60 backdrop-blur glow-cyan">
              <CardContent className="p-6 md:p-8">
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("landing.intakeStep")}
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Link2 className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://makerworld.com/en/models/123456"
                      className="ps-9 mono text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleUrl()}
                    />
                  </div>
                  <Button onClick={handleUrl} disabled={loading} className="mono">
                    {loading ? t("landing.parsing") : t("landing.analyzeUrl")}
                  </Button>
                </div>

                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <span className="mono">{t("landing.or")}</span>
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
                  <div className="mt-3 text-sm font-medium">{t("landing.dropHere")}</div>
                  <div className="mono mt-1 text-xs text-muted-foreground">
                    {t("landing.dropHint")}
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
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mono mb-8 text-[11px] uppercase tracking-widest text-muted-foreground">
          {t("landing.capabilitiesStep")}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card className="group h-full border-border/70 bg-card/60 transition-colors hover:border-primary/40">
                <CardContent className="p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Materials strip */}
      <section id="materials" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mono mb-8 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("landing.materialsStep")}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {["PLA", "PETG", "ABS", "TPU", "Resin"].map((m, i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-md border border-border bg-background p-5 text-center"
              >
                <Boxes className="mx-auto h-5 w-5 text-primary" />
                <div className="mono mt-3 text-sm font-medium">{m}</div>
                <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {t("landing.inStock")}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Services — LLMO / GEO-optimized structured section */}
      <section id="about" className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mono mb-6 text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("landing.aboutStep")}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight md:text-3xl"
          >
            {t("landing.about.heading")}
          </motion.h2>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground">
            {t("landing.about.intro")}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-lg border border-border/70 bg-card/40 p-6"
              >
                <div className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <Truck className="mx-auto h-6 w-6 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold">{t("landing.ctaTitle")}</h2>
          <Button
            className="mt-6 mono"
            size="lg"
            onClick={() => navigate({ to: "/configure" })}
          >
            {t("landing.openConfigurator")}
          </Button>
        </div>
      </section>
    </div>
  );
}
