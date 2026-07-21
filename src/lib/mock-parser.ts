// Stubbed MakerWorld / upload parser. Returns mock geometry data shaped like
// the `models` table so we can wire the full flow before real STL analysis.

export interface ParsedModel {
  source: "makerworld" | "upload";
  source_url: string | null;
  source_id: string | null;
  name: string;
  thumbnail_url: string | null;
  dimensions_mm: { x: number; y: number; z: number };
  est_weight_g: number;
  est_print_time_min: number;
}

const SAMPLES: Omit<ParsedModel, "source" | "source_url" | "source_id">[] = [
  {
    name: "Articulated Dragon v2",
    thumbnail_url: null,
    dimensions_mm: { x: 220, y: 82, z: 45 },
    est_weight_g: 68,
    est_print_time_min: 412,
  },
  {
    name: "Cable Management Tray",
    thumbnail_url: null,
    dimensions_mm: { x: 180, y: 60, z: 22 },
    est_weight_g: 34,
    est_print_time_min: 168,
  },
  {
    name: "Benchy Test Boat",
    thumbnail_url: null,
    dimensions_mm: { x: 60, y: 31, z: 48 },
    est_weight_g: 15,
    est_print_time_min: 78,
  },
  {
    name: "Modular Desk Organizer",
    thumbnail_url: null,
    dimensions_mm: { x: 150, y: 150, z: 90 },
    est_weight_g: 142,
    est_print_time_min: 620,
  },
];

function pickSample(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return SAMPLES[Math.abs(h) % SAMPLES.length]!;
}

export async function parseMakerWorldUrl(url: string): Promise<ParsedModel> {
  await new Promise((r) => setTimeout(r, 450));
  const idMatch = url.match(/\/models\/(\d+)/);
  const sample = pickSample(url);
  return {
    source: "makerworld",
    source_url: url,
    source_id: idMatch?.[1] ?? null,
    ...sample,
  };
}

export async function parseUpload(file: File): Promise<ParsedModel> {
  await new Promise((r) => setTimeout(r, 350));
  const sample = pickSample(file.name + file.size);
  return {
    source: "upload",
    source_url: null,
    source_id: null,
    ...sample,
    name: file.name.replace(/\.(stl|3mf|obj)$/i, ""),
  };
}
