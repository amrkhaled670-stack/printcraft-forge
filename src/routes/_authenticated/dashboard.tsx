import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { money } from "@/lib/pricing";
import {
  OrderStatusStepper,
  StatusBadge,
  ORDER_STATUSES,
  type OrderStatus,
} from "@/components/order-status-stepper";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — PrintHub" },
      { name: "description", content: "Track your active prints and view order history." },
    ],
  }),
  component: DashboardPage,
});

interface OrderRow {
  id: string;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
  notes: string | null;
  delivery_address: any;
}

interface OrderItemRow {
  id: string;
  model_name: string;
  material_name: string;
  color: string;
  infill_pct: number;
  layer_height: number;
  finishing_options: any;
  quantity: number;
  unit_price: number;
  line_total: number;
}

const ACTIVE: OrderStatus[] = ["pending", "slicing", "printing", "shipped"];

function DashboardPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const ordersQ = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total_price, created_at, updated_at, notes, delivery_address")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderRow[];
    },
  });

  const orders = ordersQ.data ?? [];
  const activeOrders = orders.filter((o) => ACTIVE.includes(o.status));

  const filtered = useMemo(() => {
    let out = [...orders];
    if (statusFilter !== "all") out = out.filter((o) => o.status === statusFilter);
    out.sort((a, b) => {
      const d = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sortDesc ? d : -d;
    });
    return out;
  }, [orders, statusFilter, sortDesc]);

  const openOrder = orders.find((o) => o.id === openOrderId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="mono text-xs uppercase tracking-widest text-primary">/ dashboard</p>
          <h1 className="mt-1 text-3xl font-semibold">Your prints</h1>
          <p className="text-sm text-muted-foreground">
            Track active jobs, review past orders, and open any order for full specs.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="mono mb-4 text-xs uppercase tracking-widest text-muted-foreground">
            Active orders / {activeOrders.length}
          </h2>
          {activeOrders.length === 0 ? (
            <Card className="border-dashed border-border/60 bg-card/40">
              <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
                <Package className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No active prints. Configure a model to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((o) => (
                <Card key={o.id} className="border-border/70 bg-card/60">
                  <CardContent className="p-6">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          order / {o.id.slice(0, 8)}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Placed {format(new Date(o.created_at), "MMM d, yyyy 'at' HH:mm")}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="mono text-lg font-semibold text-primary">
                          {money(Number(o.total_price))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenOrderId(o.id)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                    <OrderStatusStepper status={o.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="mono text-xs uppercase tracking-widest text-muted-foreground">
              Order history / {orders.length}
            </h2>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-border/70 bg-card/40">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="mono text-[10px] uppercase tracking-widest">
                      Order
                    </TableHead>
                    <TableHead>
                      <button
                        className="mono inline-flex items-center gap-1 text-[10px] uppercase tracking-widest"
                        onClick={() => setSortDesc((s) => !s)}
                      >
                        Date
                        {sortDesc ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="mono text-[10px] uppercase tracking-widest">
                      Status
                    </TableHead>
                    <TableHead className="mono text-right text-[10px] uppercase tracking-widest">
                      Total
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersQ.isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        Loading orders…
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        No orders match this filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="mono text-xs">{o.id.slice(0, 8)}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(o.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="mono text-right text-sm">
                          {money(Number(o.total_price))}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpenOrderId(o.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <OrderDetailDialog
        order={openOrder}
        onClose={() => setOpenOrderId(null)}
      />
    </div>
  );
}

function OrderDetailDialog({
  order,
  onClose,
}: {
  order: OrderRow | null;
  onClose: () => void;
}) {
  const itemsQ = useQuery({
    queryKey: ["order-items", order?.id],
    enabled: !!order?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select(
          "id, model_name, material_name, color, infill_pct, layer_height, finishing_options, quantity, unit_price, line_total",
        )
        .eq("order_id", order!.id);
      if (error) throw error;
      return (data ?? []) as OrderItemRow[];
    },
  });

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle className="mono text-sm uppercase tracking-widest text-muted-foreground">
                order / {order.id.slice(0, 8)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              <OrderStatusStepper status={order.status} />

              <div className="grid grid-cols-2 gap-4 rounded-md border border-border/60 bg-background/60 p-4 text-sm">
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Placed
                  </div>
                  <div>{format(new Date(order.created_at), "MMM d, yyyy HH:mm")}</div>
                </div>
                <div>
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Updated
                  </div>
                  <div>{format(new Date(order.updated_at), "MMM d, yyyy HH:mm")}</div>
                </div>
                <div className="col-span-2">
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Delivery
                  </div>
                  <div className="text-sm">
                    {order.delivery_address?.name && (
                      <div>{order.delivery_address.name}</div>
                    )}
                    {order.delivery_address?.line1 && (
                      <div>{order.delivery_address.line1}</div>
                    )}
                    {(order.delivery_address?.city ||
                      order.delivery_address?.postal ||
                      order.delivery_address?.country) && (
                      <div>
                        {[
                          order.delivery_address?.city,
                          order.delivery_address?.postal,
                          order.delivery_address?.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                {order.notes && (
                  <div className="col-span-2">
                    <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Notes
                    </div>
                    <div className="text-sm">{order.notes}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="mono mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Items
                </div>
                <div className="space-y-2">
                  {(itemsQ.data ?? []).map((it) => (
                    <div
                      key={it.id}
                      className="rounded-md border border-border/60 bg-background/60 p-3 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{it.model_name}</div>
                          <div className="mono mt-1 text-[11px] text-muted-foreground">
                            {it.material_name} · {it.color} · {it.infill_pct}% infill ·{" "}
                            {it.layer_height}mm layer · qty {it.quantity}
                          </div>
                          {Array.isArray(it.finishing_options) && it.finishing_options.length > 0 && (
                            <div className="mono mt-1 text-[11px] text-primary">
                              + {(it.finishing_options as string[]).join(", ")}
                            </div>
                          )}
                        </div>
                        <div className="mono text-right">
                          <div>{money(Number(it.line_total))}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {money(Number(it.unit_price))} ea
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
              <div className="flex items-center justify-between">
                <span className="mono text-xs uppercase tracking-widest text-muted-foreground">
                  Total
                </span>
                <span className="mono text-lg font-semibold text-primary">
                  {money(Number(order.total_price))}
                </span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
