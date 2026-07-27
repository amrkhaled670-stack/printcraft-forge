import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "سياسة الاسترجاع | Print Forge" },
      { name: "description", content: "سياسة الاسترجاع والاستبدال لمنتجات الطباعة ثلاثية الأبعاد في Print Forge." },
      { property: "og:title", content: "سياسة الاسترجاع | Print Forge" },
      { property: "og:description", content: "سياسة الاسترجاع والاستبدال لمنتجات الطباعة ثلاثية الأبعاد في Print Forge." },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main dir="rtl" className="mx-auto max-w-3xl px-6 py-12 text-right">
        <h1 className="text-3xl font-semibold text-foreground">سياسة الاسترجاع</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">طبيعة المنتجات</h2>
            <p className="mt-2">
              نظرًا لأن جميع المنتجات يتم تصنيعها وطباعتها خصيصاً بناءً على طلب مسبق لكل عميل (Custom-made)، فلا يمكن الاسترجاع أو الاستبدال لمجرد تغيير الرأي بعد بدء عملية الطباعة.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">حالات الاسترجاع المقبولة</h2>
            <p className="mt-2">
              إذا وصل الموديل للعميل به عيب صناعة واضح أو كسر تام ناتج عن عملية الشحن، أو إذا كان هناك اختلاف جذري بين المقاسات المطلوبة وما تم تنفيذه.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">آلية الحل</h2>
            <p className="mt-2">
              يتم التواصل خلال 48 ساعة من الاستلام مع إرفاق صور، وسيتم إعادة طباعة الجزء التالف أو رد المبلغ.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
