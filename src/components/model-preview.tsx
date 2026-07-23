import { useEffect, useRef } from "react";

// Lightweight canvas placeholder: a slowly rotating wireframe cube with
// dimension overlays. Not a real STL viewer — a stand-in until three.js.
export function ModelPreview({
  dimensions,
  thumbnailUrl,
}: {
  dimensions: { x: number; y: number; z: number };
  thumbnailUrl?: string | null;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hasDims = dimensions.x > 0 && dimensions.y > 0 && dimensions.z > 0;

  useEffect(() => {
    if (!hasDims) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let angle = 0;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();

    const draw = () => {
      angle += 0.006;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) / 4;

      const max = Math.max(dimensions.x, dimensions.y, dimensions.z);
      const sx = (dimensions.x / max) * scale;
      const sy = (dimensions.z / max) * scale;
      const sz = (dimensions.y / max) * scale;

      const verts: [number, number, number][] = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ];
      const proj = verts.map(([x, y, z]) => {
        const X = x * sx;
        const Y = y * sy;
        const Z = z * sz;
        const rx = X * Math.cos(angle) - Z * Math.sin(angle);
        const rz = X * Math.sin(angle) + Z * Math.cos(angle);
        const persp = 1 / (1 + rz / (scale * 3));
        return [cx + rx * persp, cy + Y * persp * 0.9] as const;
      });

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeStyle = "oklch(0.78 0.16 210 / 0.9)";
      ctx.shadowColor = "oklch(0.78 0.16 210 / 0.6)";
      ctx.shadowBlur = 8 * dpr;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(proj[a]![0], proj[a]![1]);
        ctx.lineTo(proj[b]![0], proj[b]![1]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [dimensions.x, dimensions.y, dimensions.z, hasDims]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-background grid-bg">
      {hasDims ? (
        <canvas ref={ref} className="h-full w-full" />
      ) : thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="Model preview"
          className="h-full w-full object-contain"
          loading="lazy"
        />
      ) : (
        <div className="grid h-full w-full place-items-center mono text-xs uppercase tracking-widest text-muted-foreground">
          no preview
        </div>
      )}
      <div className="pointer-events-none absolute inset-4 flex flex-col justify-between mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <div className="flex justify-between">
          <span>X {hasDims ? `${dimensions.x}mm` : "—"}</span>
          <span>Z {hasDims ? `${dimensions.z}mm` : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span>Y {hasDims ? `${dimensions.y}mm` : "—"}</span>
          <span className="text-primary">// preview</span>
        </div>
      </div>
    </div>
  );
}
