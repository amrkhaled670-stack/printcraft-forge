import { createServerFn } from "@tanstack/react-start";

export interface MakerWorldModel {
  source: "makerworld";
  source_url: string;
  source_id: string;
  name: string;
  thumbnail_url: string | null;
  dimensions_mm: { x: number; y: number; z: number };
  est_weight_g: number;
  est_print_time_min: number;
}

function extractId(url: string): string | null {
  const m = url.match(/makerworld\.com\/[^/]+\/models\/(\d+)/i) ?? url.match(/\/models\/(\d+)/);
  return m?.[1] ?? null;
}

export const fetchMakerWorldModel = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }): Promise<MakerWorldModel> => {
    const id = extractId(data.url);
    if (!id) throw new Error("Not a valid MakerWorld model URL");

    const res = await fetch(`https://makerworld.com/api/v1/design-service/design/${id}`, {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`MakerWorld returned ${res.status}`);
    const json = (await res.json()) as {
      id?: number;
      title?: string;
      coverUrl?: string;
      defaultInstanceId?: number;
      instances?: Array<{
        id?: number;
        weight?: number;
        extention?: {
          modelInfo?: {
            plates?: Array<{ weight?: number; prediction?: number; thumbnail?: { url?: string } }>;
          };
        };
      }>;
    };

    if (!json.id || !json.title) throw new Error("MakerWorld model not found");

    const instance =
      json.instances?.find((i) => i.id === json.defaultInstanceId) ?? json.instances?.[0];
    const plates = instance?.extention?.modelInfo?.plates ?? [];

    const totalWeight = plates.reduce((s, p) => s + (Number(p.weight) || 0), 0) || Number(instance?.weight) || 0;
    const totalSeconds = plates.reduce((s, p) => s + (Number(p.prediction) || 0), 0);
    const printMin = Math.round(totalSeconds / 60);

    if (!totalWeight || !printMin) throw new Error("MakerWorld model has no printable data");

    return {
      source: "makerworld",
      source_url: data.url,
      source_id: String(json.id),
      name: json.title,
      thumbnail_url: plates[0]?.thumbnail?.url ?? json.coverUrl ?? null,
      // MakerWorld's public API does not expose XYZ bounding box.
      dimensions_mm: { x: 0, y: 0, z: 0 },
      est_weight_g: totalWeight,
      est_print_time_min: printMin,
    };
  });
