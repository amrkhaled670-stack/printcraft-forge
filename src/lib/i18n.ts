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
      },
      landing: {
        heroTitle: "Paste. Configure. Print.",
        heroSubtitle:
          "Turn a MakerWorld link or STL upload into a shipped part. Instant multi-material pricing, real-time tracking.",
        pasteUrl: "Paste MakerWorld URL",
        loadModel: "Load model",
        uploadFile: "Upload .stl / .3mf / .obj",
        dropHere: "Drop file here",
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
        orderSummary: "order.summary",
        placeOrder: "Place order",
        placing: "Placing…",
        orderViaWhatsapp: "Order via WhatsApp",
        paymentMethod: "Payment method",
        cod: "Cash on Delivery (COD)",
        vodafoneCash: "Vodafone Cash",
        instapay: "InstaPay",
        vodafoneInstructions:
          "Please transfer the total amount to Vodafone Cash number: 01069198379",
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
      },
      landing: {
        heroTitle: "الصق. اضبط. اطبع.",
        heroSubtitle:
          "حوّل رابط MakerWorld أو ملف STL إلى قطعة مطبوعة تصلك إلى باب البيت. تسعير فوري وتتبع مباشر.",
        pasteUrl: "الصق رابط MakerWorld",
        loadModel: "تحميل النموذج",
        uploadFile: "ارفع ملف .stl / .3mf / .obj",
        dropHere: "أفلت الملف هنا",
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
          "من فضلك حوّل المبلغ الإجمالي على رقم فودافون كاش: 01069198379",
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
