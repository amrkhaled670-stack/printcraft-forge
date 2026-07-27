import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "شروط الخدمة | Print Forge" },
      { name: "description", content: "شروط استخدام خدمة الطباعة ثلاثية الأبعاد في Print Forge والملكية الفكرية للملفات." },
      { property: "og:title", content: "شروط الخدمة | Print Forge" },
      { property: "og:description", content: "شروط استخدام خدمة الطباعة ثلاثية الأبعاد في Print Forge والملكية الفكرية للملفات." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main dir="rtl" className="mx-auto max-w-3xl px-6 py-12 text-right">
        <h1 className="text-3xl font-semibold text-foreground">شروط الخدمة</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">الملكية الفكرية</h2>
            <p className="mt-2">
              العميل هو المسؤول الكامل عن ملفات الـ (STL) التي يقوم برفعها ويقر بأنه يملك حقوق طباعتها.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">المحتوى المرفوض</h2>
            <p className="mt-2">
              يحق للموقع رفض طباعة أي مجسمات تحتوي على محتوى مخالف للقانون أو أسلحة.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">دقة الطباعة</h2>
            <p className="mt-2">
              يوافق العميل على أن عمليات الطباعة 3D قد ترتبط بحدود تقنية في درجات تحمل المواد (Tolerances).
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
