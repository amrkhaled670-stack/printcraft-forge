import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Centralized dictionary — edit values freely. Keys stay the same.
export const resources = {
  en: {
    translation: {
      brand: "printhub",
      nav: {
        configure: "Configure",
        how: "How it works",
        materials: "Materials",
        cart: "Cart",
        dashboard: "Dashboard",
        admin: "Admin",
        signIn: "Sign in",
        signOut: "Sign out",
        language: "Language",
        currency: "Currency",
      },
      landing: {
        heroTitle: "Paste. Configure. Print.",
        heroBadge: "// print-on-demand infrastructure",
        heroHeadline1: "From MakerWorld link to shipped part —",
        heroHeadline2: "without the quote form.",
        heroSubtitle:
          "Paste a model URL or drop an STL. Choose material, color, and finish. See the price update in real time. Order in under a minute.",
        intakeStep: "01 / intake",
        capabilitiesStep: "02 / capabilities",
        materialsStep: "03 / stock materials",
        aboutStep: "04 / about printhub",
        pasteUrl: "Paste MakerWorld URL",
        loadModel: "Load model",
        analyzeUrl: "Analyze URL",
        parsing: "Parsing…",
        or: "or",
        uploadFile: "Upload .stl / .3mf / .obj",
        dropHere: "Drop an STL, 3MF, or OBJ",
        dropHint: "or click to browse — max 100mb",
        inStock: "in stock",
        openConfigurator: "Open configurator →",
        ctaTitle: "Ready to configure your first print?",
        loadedToast: 'Loaded "{{name}}"',
        loadError: "Could not fetch model. Try uploading STL directly.",
        fileTypeError: "Upload an .stl, .3mf, or .obj file",
        features: {
          instantTitle: "Instant pricing",
          instantDesc: "Live cost updates as you tune material, infill, and layer height — no back-and-forth quotes.",
          multiTitle: "Multi-material",
          multiDesc: "PLA, PETG, ABS, TPU, and resin. Pick color, finish, and layer resolution per part.",
          trackTitle: "Real-time tracking",
          trackDesc: "Watch your order move through slicing, printing, and shipping.",
          makerTitle: "MakerWorld integration",
          makerDesc: "Paste any MakerWorld model URL and we handle the rest.",
        },
        about: {
          heading: "3D Printing Service in Egypt — MakerWorld imports, STL uploads, nationwide shipping",
          intro:
            "PrintHub is an on-demand 3D printing service based in Egypt. We turn MakerWorld links and your own STL, 3MF, or OBJ files into finished parts and ship them to every governorate — from Cairo and Giza to Beni Suef, Alexandria, Aswan, and beyond.",
          servicesTitle: "What we print",
          servicesBody:
            "FDM parts in PLA, PETG, ABS, and TPU plus SLA resin prints for detailed models. Choose color, layer height (0.1–0.3 mm), infill density (15–100 %), and optional finishing: sanding, dyeing, and multi-part assembly.",
          filesTitle: "STL & MakerWorld file handling",
          filesBody:
            "Paste any MakerWorld model URL — we pull the real title, estimated weight, and print time server-side. Or upload an STL, 3MF, or OBJ up to 100 MB; the browser previews the true geometry with orbit, zoom, and pan before you commit.",
          pricingTitle: "Transparent live pricing",
          pricingBody:
            "Prices update instantly as you tune material, infill, and finishing. No hidden quote forms. Pay by Cash on Delivery, Vodafone Cash, or InstaPay.",
          shippingTitle: "Shipping across Egypt",
          shippingBody:
            "Flat delivery to Beni Suef and a nationwide flat rate to every other Egyptian governorate. Track each order through pending, slicing, printing, and shipped states from your dashboard.",
        },
      },
      cart: {
        title: "Cart",
        empty: "Cart is empty",
        emptyHint: "Configure a print to add it here.",
        openConfigurator: "Open configurator",
        subtotal: "Subtotal",
        shipping: "Shipping",
        total: "Total",
        checkout: "Checkout",
        remove: "Remove item",
        summary: "order.summary",
        each: "ea",
        layers: "mm layers",
        infill: "% infill",
        finish: "finish",
      },
      checkout: {
        title: "Checkout",
        deliveryAddress: "Delivery address",
        deliveryHint: "Where should we ship your prints?",
        fullName: "Full name",
        country: "Country",
        addressLine: "Address line",
        city: "City",
        postal: "Postal code",
        governorate: "Governorate",
        selectGovernorate: "Select governorate",
        notes: "Order notes (optional)",
        notesPlaceholder: "Special handling, deadlines, orientation…",
        orderSummary: "Order summary",
        placeOrder: "Place order",
        placing: "Placing…",
        orderViaWhatsapp: "Order via WhatsApp",
        paymentMethod: "Payment method",
        cod: "Cash on Delivery (COD)",
        vodafoneCash: "Vodafone Cash",
        instapay: "InstaPay",
        vodafoneInstructions:
          "Please transfer the total amount to Vodafone Cash number: 01069198397",
        uploadReceipt: "Upload payment receipt (optional)",
        receiptUploaded: "Receipt attached",
        cartEmpty: "Cart is empty",
        completeAddress: "Please complete your delivery address",
        selectGovernorateError: "Please select a governorate",
        orderPlaced: "Order placed",
      },
      whatsapp: {
        contact: "Contact us on WhatsApp",
        supportGreeting: "Hi PrintHub, I need help with my order.",
      },
      common: {
        loading: "Loading…",
        error: "Something went wrong",
      },
      footer: {
        refund: "Refund Policy",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
      },
    },
  },
  ar: {
    translation: {
      brand: "برنت هب",
      nav: {
        configure: "إعداد الطلب",
        how: "كيف يعمل",
        materials: "الخامات",
        cart: "السلة",
        dashboard: "لوحتي",
        admin: "الإدارة",
        signIn: "تسجيل الدخول",
        signOut: "تسجيل الخروج",
        language: "اللغة",
        currency: "العملة",
      },
      landing: {
        heroTitle: "الصق. اضبط. اطبع.",
        heroBadge: "// منصة طباعة ثلاثية الأبعاد عند الطلب",
        heroHeadline1: "من رابط MakerWorld إلى قطعة تصلك —",
        heroHeadline2: "بدون نماذج عروض أسعار.",
        heroSubtitle:
          "الصق رابط النموذج أو ارفع ملف STL. اختر الخامة واللون والتشطيب. شاهد السعر يتحدث فورًا واطلب في أقل من دقيقة.",
        intakeStep: "٠١ / استقبال الملف",
        capabilitiesStep: "٠٢ / الإمكانيات",
        materialsStep: "٠٣ / الخامات المتوفرة",
        aboutStep: "٠٤ / عن برنت هب",
        pasteUrl: "الصق رابط MakerWorld",
        loadModel: "تحميل النموذج",
        analyzeUrl: "تحليل الرابط",
        parsing: "جارٍ التحليل…",
        or: "أو",
        uploadFile: "ارفع ملف .stl / .3mf / .obj",
        dropHere: "أفلت ملف STL أو 3MF أو OBJ هنا",
        dropHint: "أو انقر للاستعراض — الحد الأقصى 100 ميجابايت",
        inStock: "متوفر",
        openConfigurator: "افتح الإعداد ←",
        ctaTitle: "جاهز لضبط أول طباعة؟",
        loadedToast: 'تم تحميل "{{name}}"',
        loadError: "تعذّر جلب النموذج. جرب رفع ملف STL مباشرة.",
        fileTypeError: "ارفع ملفًا بامتداد .stl أو .3mf أو .obj",
        features: {
          instantTitle: "تسعير فوري",
          instantDesc: "تحديث حي للسعر أثناء اختيار الخامة والتعبئة وسمك الطبقة — دون انتظار عروض أسعار.",
          multiTitle: "خامات متعددة",
          multiDesc: "PLA و PETG و ABS و TPU وراتنج. اختر اللون والتشطيب ودقة الطبقة لكل قطعة.",
          trackTitle: "تتبع مباشر",
          trackDesc: "تابع طلبك خلال مراحل التقطيع والطباعة والشحن.",
          makerTitle: "تكامل مع MakerWorld",
          makerDesc: "الصق أي رابط لنموذج MakerWorld ونحن نتولى الباقي.",
        },
        about: {
          heading: "خدمة طباعة ثلاثية الأبعاد في مصر — استيراد MakerWorld، رفع STL، شحن لكل المحافظات",
          intro:
            "برنت هب خدمة طباعة ثلاثية الأبعاد عند الطلب مقرها مصر. نحول روابط MakerWorld وملفاتك بصيغة STL و 3MF و OBJ إلى قطع نهائية ونشحنها لكل المحافظات — من القاهرة والجيزة إلى بني سويف والإسكندرية وأسوان وما بعدها.",
          servicesTitle: "ماذا نطبع",
          servicesBody:
            "قطع FDM بخامات PLA و PETG و ABS و TPU، إضافة إلى مطبوعات الراتنج SLA للنماذج التفصيلية. اختر اللون وسمك الطبقة (0.1–0.3 مم)، ونسبة التعبئة (15–100%)، والتشطيبات الاختيارية: صنفرة، تلوين، وتجميع متعدد القطع.",
          filesTitle: "التعامل مع ملفات STL و MakerWorld",
          filesBody:
            "الصق أي رابط لنموذج على MakerWorld — نجلب الاسم والوزن التقديري ومدة الطباعة من الخادم مباشرة. أو ارفع ملف STL أو 3MF أو OBJ حتى 100 ميجابايت، ويعاين المتصفح الشكل الحقيقي مع إمكانية التدوير والتكبير والتحريك قبل الطلب.",
          pricingTitle: "أسعار شفافة ومباشرة",
          pricingBody:
            "الأسعار تتحدث فورًا مع كل تغيير في الخامة أو التعبئة أو التشطيب. بدون نماذج عروض مخفية. ادفع عند الاستلام أو بفودافون كاش أو إنستا باي.",
          shippingTitle: "الشحن داخل مصر",
          shippingBody:
            "سعر ثابت للشحن إلى بني سويف، وسعر ثابت آخر لكل المحافظات المصرية الأخرى. تابع كل طلب في مراحل قيد الانتظار والتقطيع والطباعة والشحن من لوحة التحكم.",
        },
      },
      cart: {
        title: "السلة",
        empty: "السلة فارغة",
        emptyHint: "اضبط طباعة لإضافتها هنا.",
        openConfigurator: "افتح الإعداد",
        subtotal: "المجموع الفرعي",
        shipping: "الشحن",
        total: "الإجمالي",
        checkout: "إتمام الطلب",
        remove: "حذف العنصر",
        summary: "ملخص الطلب",
        each: "للقطعة",
        layers: "مم لكل طبقة",
        infill: "% تعبئة",
        finish: "تشطيب",
      },
      checkout: {
        title: "إتمام الطلب",
        deliveryAddress: "عنوان التوصيل",
        deliveryHint: "أين نرسل مطبوعاتك؟",
        fullName: "الاسم بالكامل",
        country: "الدولة",
        addressLine: "العنوان بالتفصيل",
        city: "المدينة",
        postal: "الرمز البريدي",
        governorate: "المحافظة",
        selectGovernorate: "اختر المحافظة",
        notes: "ملاحظات الطلب (اختياري)",
        notesPlaceholder: "تعليمات خاصة، مواعيد، اتجاه الطباعة…",
        orderSummary: "ملخص الطلب",
        placeOrder: "تأكيد الطلب",
        placing: "جارٍ الإرسال…",
        orderViaWhatsapp: "اطلب عبر واتساب",
        paymentMethod: "طريقة الدفع",
        cod: "الدفع عند الاستلام",
        vodafoneCash: "فودافون كاش",
        instapay: "إنستا باي",
        vodafoneInstructions:
          "من فضلك حوّل المبلغ الإجمالي على رقم فودافون كاش: 01069198397",
        uploadReceipt: "ارفع صورة إيصال الدفع (اختياري)",
        receiptUploaded: "تم رفع الإيصال",
        cartEmpty: "السلة فارغة",
        completeAddress: "من فضلك أكمل عنوان التوصيل",
        selectGovernorateError: "من فضلك اختر المحافظة",
        orderPlaced: "تم استلام الطلب",
      },
      whatsapp: {
        contact: "تواصل معنا عبر واتساب",
        supportGreeting: "مرحباً برنت هب، أحتاج مساعدة في طلبي.",
      },
      common: {
        loading: "جارٍ التحميل…",
        error: "حدث خطأ ما",
      },
      footer: {
        refund: "سياسة الاسترجاع",
        terms: "شروط الخدمة",
        privacy: "سياسة الخصوصية",
      },
    },
  },
} as const;

export const SUPPORTED_LANGS = ["en", "ar"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LANGS as unknown as string[],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "printhub-lang",
      },
    });
}

export function applyDirection(lang: string) {
  if (typeof document === "undefined") return;
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);
}

export default i18n;
