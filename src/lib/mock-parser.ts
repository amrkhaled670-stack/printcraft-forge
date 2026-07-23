// Model intake parsers. MakerWorld URLs are fetched from the real API via a
// server function; STL/3MF uploads still use a lightweight local stub until
// a real geometry parser is added.

import { fetchMakerWorldModel } from "./makerworld.functions";

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

export async function parseMakerWorldUrl(url: string): Promise<ParsedModel> {
  return await fetchMakerWorldModel({ data: { url } });
}

const UPLOAD_SAMPLES = [
  { dimensions_mm: { x: 180, y: 60, z: 22 }, est_weight_g: 34, est_print_time_min: 168 },
  { dimensions_mm: { x: 60, y: 31, z: 48 }, est_weight_g: 15, est_print_time_min: 78 },
  { dimensions_mm: { x: 150, y: 150, z: 90 }, est_weight_g: 142, est_print_time_min: 620 },
];

export async function parseUpload(file: File): Promise<ParsedModel> {
  await new Promise((r) => setTimeout(r, 350));
  let h = 0;
  const seed = file.name + file.size;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const sample = UPLOAD_SAMPLES[Math.abs(h) % UPLOAD_SAMPLES.length]!;
  return {
    source: "upload",
    source_url: null,
    source_id: null,
    name: file.name.replace(/\.(stl|3mf|obj)$/i, ""),
    thumbnail_url: null,
    ...sample,
  };
}
