// Model intake parsers. MakerWorld URLs are fetched from the real API via a
// server function. STL uploads are parsed with three.js STLLoader to compute
// a real bounding box, then handed off to the 3D viewer via a blob URL.

import { fetchMakerWorldModel } from "./makerworld.functions";

export interface ParsedModel {
  source: "makerworld" | "upload";
  source_url: string | null;
  source_id: string | null;
  name: string;
  thumbnail_url: string | null;
  file_url: string | null; // blob: URL for uploaded STL, when available
  file_format: "stl" | "3mf" | "obj" | null;
  dimensions_mm: { x: number; y: number; z: number };
  est_weight_g: number;
  est_print_time_min: number;
}

export async function parseMakerWorldUrl(url: string): Promise<ParsedModel> {
  const res = await fetchMakerWorldModel({ data: { url } });
  return {
    file_url: null,
    file_format: null,
    ...res,
  } as ParsedModel;
}

// PLA density ~1.24 g/cm^3. Assume 20% infill baseline for weight estimate.
const PLA_DENSITY_G_CM3 = 1.24;
const BASELINE_INFILL = 0.2;
// Rough print-time estimate: 15 min per cm^3 of bounding box volume, floor 20.
const MIN_PER_CM3 = 15;

export async function parseUpload(file: File): Promise<ParsedModel> {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const format = (ext === "stl" || ext === "3mf" || ext === "obj" ? ext : null) as
    | "stl"
    | "3mf"
    | "obj"
    | null;
  const name = file.name.replace(/\.(stl|3mf|obj)$/i, "");
  const fileUrl = URL.createObjectURL(file);

  let dims = { x: 0, y: 0, z: 0 };
  let volumeCm3 = 0;

  if (format === "stl") {
    try {
      const buf = await file.arrayBuffer();
      const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
      const geom = new STLLoader().parse(buf);
      geom.computeBoundingBox();
      const bb = geom.boundingBox!;
      dims = {
        x: Math.round((bb.max.x - bb.min.x) * 10) / 10,
        y: Math.round((bb.max.y - bb.min.y) * 10) / 10,
        z: Math.round((bb.max.z - bb.min.z) * 10) / 10,
      };
      // Approximate solid volume: bbox volume scaled by a fudge factor.
      volumeCm3 = (dims.x * dims.y * dims.z) / 1000 * 0.35;
    } catch (e) {
      console.error("STL parse failed", e);
    }
  }

  const estWeight = Math.max(
    1,
    Math.round(volumeCm3 * PLA_DENSITY_G_CM3 * (BASELINE_INFILL + 0.2)),
  );
  const estTime = Math.max(20, Math.round(volumeCm3 * MIN_PER_CM3));

  return {
    source: "upload",
    source_url: null,
    source_id: null,
    name,
    thumbnail_url: null,
    file_url: fileUrl,
    file_format: format,
    dimensions_mm: dims,
    est_weight_g: estWeight,
    est_print_time_min: estTime,
  };
}
