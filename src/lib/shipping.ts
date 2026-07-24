// Egyptian governorate shipping rates (EGP or same currency as the rest of the app).
// Beni Suef gets a preferential rate; all other governorates share a flat rate.
export const BENI_SUEF_SHIPPING = 40;
export const OTHER_GOV_SHIPPING = 80;

export interface Governorate {
  key: string;
  en: string;
  ar: string;
}

export const GOVERNORATES: Governorate[] = [
  { key: "beni_suef", en: "Beni Suef", ar: "بني سويف" },
  { key: "cairo", en: "Cairo", ar: "القاهرة" },
  { key: "giza", en: "Giza", ar: "الجيزة" },
  { key: "alexandria", en: "Alexandria", ar: "الإسكندرية" },
  { key: "qalyubia", en: "Qalyubia", ar: "القليوبية" },
  { key: "sharqia", en: "Sharqia", ar: "الشرقية" },
  { key: "dakahlia", en: "Dakahlia", ar: "الدقهلية" },
  { key: "gharbia", en: "Gharbia", ar: "الغربية" },
  { key: "monufia", en: "Monufia", ar: "المنوفية" },
  { key: "kafr_el_sheikh", en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { key: "beheira", en: "Beheira", ar: "البحيرة" },
  { key: "damietta", en: "Damietta", ar: "دمياط" },
  { key: "port_said", en: "Port Said", ar: "بورسعيد" },
  { key: "ismailia", en: "Ismailia", ar: "الإسماعيلية" },
  { key: "suez", en: "Suez", ar: "السويس" },
  { key: "faiyum", en: "Faiyum", ar: "الفيوم" },
  { key: "minya", en: "Minya", ar: "المنيا" },
  { key: "asyut", en: "Asyut", ar: "أسيوط" },
  { key: "sohag", en: "Sohag", ar: "سوهاج" },
  { key: "qena", en: "Qena", ar: "قنا" },
  { key: "luxor", en: "Luxor", ar: "الأقصر" },
  { key: "aswan", en: "Aswan", ar: "أسوان" },
  { key: "red_sea", en: "Red Sea", ar: "البحر الأحمر" },
  { key: "new_valley", en: "New Valley", ar: "الوادي الجديد" },
  { key: "matrouh", en: "Matrouh", ar: "مطروح" },
  { key: "north_sinai", en: "North Sinai", ar: "شمال سيناء" },
  { key: "south_sinai", en: "South Sinai", ar: "جنوب سيناء" },
];

export function shippingFor(governorateKey: string | null | undefined): number {
  if (!governorateKey) return 0;
  return governorateKey === "beni_suef" ? BENI_SUEF_SHIPPING : OTHER_GOV_SHIPPING;
}

export function governorateLabel(key: string, lang: string): string {
  const g = GOVERNORATES.find((g) => g.key === key);
  if (!g) return key;
  return lang === "ar" ? g.ar : g.en;
}
