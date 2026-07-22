import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ORDER_STATUSES = [
  "pending",
  "slicing",
  "printing",
  "shipped",
  "delivered",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  slicing: "Slicing",
  printing: "Printing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const currentIdx = ORDER_STATUSES.indexOf(status);
  return (
    <div className="flex items-center gap-2">
      {ORDER_STATUSES.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border text-[10px] mono transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active &&
                    "border-primary text-primary bg-primary/10 glow-cyan",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "mono text-[10px] uppercase tracking-widest",
                  (done || active) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {LABELS[s]}
              </span>
            </div>
            {i < ORDER_STATUSES.length - 1 && (
              <div
                className={cn(
                  "mb-4 h-px flex-1 transition-colors",
                  i < currentIdx ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    pending: "border-muted-foreground/40 text-muted-foreground",
    slicing: "border-yellow-500/40 text-yellow-400",
    printing: "border-primary/50 text-primary",
    shipped: "border-blue-500/40 text-blue-400",
    delivered: "border-emerald-500/40 text-emerald-400",
  };
  return (
    <span
      className={cn(
        "mono inline-flex items-center rounded border px-2 py-0.5 text-[10px] uppercase tracking-widest",
        colors[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
