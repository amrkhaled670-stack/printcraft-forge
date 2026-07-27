import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | Print Forge" },
      { name: "description", content: "كيف نحمي بياناتك وتصميماتك في Print Forge — سرية ملفات STL والاستخدام المحدود للبيانات الشخصية." },
      { property: "og:title", content: "سياسة الخصوصية | Print Forge" },
      { property: "og:description", content: "كيف نحمي بياناتك وتصميماتك في Print Forge — سرية ملفات STL والاستخدام المحدود للبيانات الشخصية." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main dir="rtl" className="mx-auto max-w-3xl px-6 py-12 text-right">
        <h1 className="text-3xl font-semibold text-foreground">سياسة الخصوصية</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">سرية التصاميم</h2>
            <p className="mt-2">
              نضمن الحفاظ على سرية ملفاتك وتصميماتك التي ترفعها، ولا يتم مشاركتها أو استخدامها لأي غرض تجاري دون إذنك.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">البيانات الشخصية</h2>
            <p className="mt-2">
              يتم جمع بياناتك الأساسية فقط بغرض إنهاء الأوردر وتوصيله لك بنجاح.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
