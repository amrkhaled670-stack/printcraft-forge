import { lazy, Suspense, useEffect, useState } from "react";

const ModelViewer3D = lazy(() => import("./model-viewer-3d"));

// 3D preview: renders uploaded STL via react-three-fiber when a file_url is
// present. Falls back to thumbnail (MakerWorld) or empty state. Dimensions
// are overlaid on top of the canvas.
export function ModelPreview({
  dimensions,
  thumbnailUrl,
  fileUrl,
  fileFormat,
}: {
  dimensions: { x: number; y: number; z: number };
  thumbnailUrl?: string | null;
  fileUrl?: string | null;
  fileFormat?: "stl" | "3mf" | "obj" | null;
}) {
  const hasDims = dimensions.x > 0 && dimensions.y > 0 && dimensions.z > 0;
  const canRender3D = !!fileUrl && fileFormat === "stl";

  // Only render the r3f Canvas after client mount to avoid SSR issues.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-background grid-bg">
      {canRender3D && mounted ? (
        <Suspense
          fallback={
            <div className="grid h-full w-full place-items-center mono text-xs uppercase tracking-widest text-muted-foreground">
              loading 3d viewer…
            </div>
          }
        >
          <ModelViewer3D url={fileUrl!} />
        </Suspense>
      ) : thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Model preview"
          className="h-full w-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="grid h-full w-full place-items-center mono text-xs uppercase tracking-widest text-muted-foreground">
          {fileFormat && fileFormat !== "stl"
            ? `${fileFormat.toUpperCase()} preview not supported yet`
            : "no preview"}
        </div>
      )}

      {/* Dimension overlay */}
      <div className="pointer-events-none absolute inset-4 flex flex-col justify-between mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <div className="flex justify-between">
          <span className="rounded bg-background/70 px-1.5 py-0.5 backdrop-blur">
            X {hasDims ? `${dimensions.x}mm` : "—"}
          </span>
          <span className="rounded bg-background/70 px-1.5 py-0.5 backdrop-blur">
            Z {hasDims ? `${dimensions.z}mm` : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="rounded bg-background/70 px-1.5 py-0.5 backdrop-blur">
            Y {hasDims ? `${dimensions.y}mm` : "—"}
          </span>
          <span className="rounded bg-background/70 px-1.5 py-0.5 text-primary backdrop-blur">
            {canRender3D ? "drag · scroll · pan" : "// preview"}
          </span>
        </div>
      </div>
    </div>
  );
}
