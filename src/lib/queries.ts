import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS, type PricingSettings } from "@/lib/pricing";

export interface Material {
  id: string;
  name: string;
  type: string;
  price_per_gram: number;
  color_options: string[];
}

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("id, name, type, price_per_gram, color_options")
        .eq("active", true)
        .order("type");
      if (error) throw error;
      return (data ?? []) as unknown as Material[];
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["admin_settings"],
    queryFn: async (): Promise<PricingSettings> => {
      const { data, error } = await supabase.from("admin_settings").select("key, value");
      if (error) throw error;
      const map = new Map<string, unknown>((data ?? []).map((r: any) => [r.key, r.value]));
      return {
        timeRatePerMin: Number(map.get("time_rate_per_min") ?? DEFAULT_SETTINGS.timeRatePerMin),
        infillMultipliers:
          (map.get("infill_multipliers") as Record<string, number>) ??
          DEFAULT_SETTINGS.infillMultipliers,
        finishingPrices:
          (map.get("finishing_prices") as Record<string, number>) ??
          DEFAULT_SETTINGS.finishingPrices,
        markupPct: Number(map.get("markup_pct") ?? DEFAULT_SETTINGS.markupPct),
      };
    },
  });
}
