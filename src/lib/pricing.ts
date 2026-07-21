// Live-updating price calculator. Constants come from admin_settings and
// materials tables so admins can tune everything without a redeploy.

export interface PricingSettings {
  timeRatePerMin: number;
  infillMultipliers: Record<string, number>;
  finishingPrices: Record<string, number>;
  markupPct: number;
}

export const DEFAULT_SETTINGS: PricingSettings = {
  timeRatePerMin: 0.08,
  infillMultipliers: { "15": 0.6, "20": 0.7, "50": 0.85, "100": 1.0 },
  finishingPrices: { sanding: 4, dyeing: 6.5, assembly: 12 },
  markupPct: 0.15,
};

export interface PriceInput {
  pricePerGram: number;
  weightG: number;
  printTimeMin: number;
  infillPct: number;
  finishing: string[];
  quantity: number;
  settings: PricingSettings;
}

export interface PriceBreakdown {
  material: number;
  time: number;
  finishing: number;
  subtotal: number;
  markup: number;
  unit: number;
  total: number;
}

export function calcPrice(input: PriceInput): PriceBreakdown {
  const mult = input.settings.infillMultipliers[String(input.infillPct)] ?? 0.7;
  const material = input.pricePerGram * input.weightG * mult;
  const time = input.printTimeMin * input.settings.timeRatePerMin;
  const finishing = input.finishing.reduce(
    (sum, f) => sum + (input.settings.finishingPrices[f] ?? 0),
    0,
  );
  const subtotal = material + time + finishing;
  const markup = subtotal * input.settings.markupPct;
  const unit = subtotal + markup;
  return {
    material,
    time,
    finishing,
    subtotal,
    markup,
    unit,
    total: unit * input.quantity,
  };
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
