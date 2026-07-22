import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { Shield, Users, Package, Settings2, Layers } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/use-role";
import { useAuth } from "@/hooks/use-auth";
import { money, DEFAULT_SETTINGS } from "@/lib/pricing";
import { StatusBadge, ORDER_STATUSES, type OrderStatus } from "@/components/order-status-stepper";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — PrintHub" },
      { name: "description", content: "Manage orders, materials, pricing, and users." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useRoles();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-muted-foreground">
          Checking access…
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-6 py-20">
          <Card className="border-destructive/40 bg-card/60">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <Shield className="h-8 w-8 text-destructive" />
              <h1 className="text-xl font-semibold">Admin access required</h1>
              <p className="text-sm text-muted-foreground">
                Your account isn't authorized to view this area.
              </p>
              <Button asChild variant="outline">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="mono text-xs uppercase tracking-widest text-primary">
              / admin console
            </p>
            <h1 className="text-3xl font-semibold">Operations</h1>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mono">
            <TabsTrigger value="orders">
              <Package className="mr-2 h-3.5 w-3.5" /> Orders
            </TabsTrigger>
            <TabsTrigger value="materials">
              <Layers className="mr-2 h-3.5 w-3.5" /> Materials
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings2 className="mr-2 h-3.5 w-3.5" /> Settings
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-3.5 w-3.5" /> Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersPanel />
          </TabsContent>
          <TabsContent value="materials" className="mt-6">
            <MaterialsPanel />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <SettingsPanel />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UsersPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* -------------------------------- Orders --------------------------------- */

function OrdersPanel() {
  const qc = useQueryClient();
  const ordersQ = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total_price, created_at, user_id, delivery_address")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const rows = ordersQ.data ?? [];

  return (
    <Card className="border-border/70 bg-card/40">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Order
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Placed
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Customer
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Status
              </TableHead>
              <TableHead className="mono text-right text-[10px] uppercase tracking-widest">
                Total
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Update
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersQ.isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((o: any) => (
                <TableRow key={o.id}>
                  <TableCell className="mono text-xs">{o.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(o.created_at), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{o.delivery_address?.name ?? "—"}</div>
                    <div className="mono text-[10px] text-muted-foreground">
                      {o.user_id.slice(0, 8)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="mono text-right text-sm">
                    {money(Number(o.total_price))}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(v) =>
                        updateStatus.mutate({ id: o.id, status: v as OrderStatus })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ------------------------------ Materials -------------------------------- */

interface MaterialRow {
  id: string;
  name: string;
  type: string;
  price_per_gram: number;
  active: boolean;
  color_options: any;
}

function MaterialsPanel() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("id, name, type, price_per_gram, active, color_options")
        .order("type");
      if (error) throw error;
      return (data ?? []) as MaterialRow[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: { price_per_gram?: number; active?: boolean } }) => {
      const { error } = await supabase.from("materials").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material updated");
      qc.invalidateQueries({ queryKey: ["admin-materials"] });
      qc.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const rows = q.data ?? [];

  return (
    <Card className="border-border/70 bg-card/40">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Name</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Type</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Colors</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                Price / g (USD)
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((m) => (
              <MaterialRowEditor
                key={m.id}
                row={m}
                onSave={(patch) => update.mutate({ id: m.id, patch })}
              />
            ))}
            {rows.length === 0 && !q.isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No materials.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MaterialRowEditor({
  row,
  onSave,
}: {
  row: MaterialRow;
  onSave: (patch: Partial<MaterialRow>) => void;
}) {
  const [price, setPrice] = useState(String(row.price_per_gram));
  const dirty = Number(price) !== row.price_per_gram;

  return (
    <TableRow>
      <TableCell className="font-medium">{row.name}</TableCell>
      <TableCell className="mono text-xs text-muted-foreground">{row.type}</TableCell>
      <TableCell className="mono text-xs text-muted-foreground">
        {Array.isArray(row.color_options) ? row.color_options.length : 0}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.001"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mono h-8 w-28"
          />
          {dirty && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave({ price_per_gram: Number(price) })}
            >
              Save
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Switch
          checked={row.active}
          onCheckedChange={(v) => onSave({ active: v })}
        />
      </TableCell>
    </TableRow>
  );
}

/* ------------------------------- Settings -------------------------------- */

function SettingsPanel() {
  const qc = useQueryClient();
  const settingsQ = useQuery({
    queryKey: ["admin-settings-raw"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("key, value");
      if (error) throw error;
      const m = new Map<string, any>();
      (data ?? []).forEach((r: any) => m.set(r.key, r.value));
      return m;
    },
  });

  const save = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("admin_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Setting saved");
      qc.invalidateQueries({ queryKey: ["admin-settings-raw"] });
      qc.invalidateQueries({ queryKey: ["admin_settings"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });

  const map = settingsQ.data;
  const timeRate = Number(map?.get("time_rate_per_min") ?? DEFAULT_SETTINGS.timeRatePerMin);
  const markup = Number(map?.get("markup_pct") ?? DEFAULT_SETTINGS.markupPct);
  const infill = (map?.get("infill_multipliers") ?? DEFAULT_SETTINGS.infillMultipliers) as Record<
    string,
    number
  >;

  const [timeRateInput, setTimeRateInput] = useState(String(timeRate));
  const [markupInput, setMarkupInput] = useState(String(markup));
  const [infillInput, setInfillInput] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(infill).map(([k, v]) => [k, String(v)])),
  );

  // Sync inputs when data first arrives
  useMemo(() => {
    if (!map) return;
    setTimeRateInput(String(timeRate));
    setMarkupInput(String(markup));
    setInfillInput(
      Object.fromEntries(Object.entries(infill).map(([k, v]) => [k, String(v)])),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQ.dataUpdatedAt]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/70 bg-card/40">
        <CardContent className="space-y-5 p-6">
          <div>
            <h3 className="mono text-xs uppercase tracking-widest text-muted-foreground">
              Pricing constants
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Applied instantly to every configurator quote.
            </p>
          </div>
          <Separator />
          <div>
            <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Time rate (USD / min)
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                type="number"
                step="0.001"
                min="0"
                value={timeRateInput}
                onChange={(e) => setTimeRateInput(e.target.value)}
                className="mono h-9 w-32"
              />
              <Button
                size="sm"
                onClick={() =>
                  save.mutate({ key: "time_rate_per_min", value: Number(timeRateInput) })
                }
              >
                Save
              </Button>
            </div>
          </div>
          <div>
            <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Markup (%)
            </Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={markupInput}
                onChange={(e) => setMarkupInput(e.target.value)}
                className="mono h-9 w-32"
              />
              <Button
                size="sm"
                onClick={() =>
                  save.mutate({ key: "markup_pct", value: Number(markupInput) })
                }
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/40">
        <CardContent className="space-y-4 p-6">
          <div>
            <h3 className="mono text-xs uppercase tracking-widest text-muted-foreground">
              Infill multipliers
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Material weight × multiplier per infill preset.
            </p>
          </div>
          <Separator />
          <div className="space-y-3">
            {Object.keys(infillInput)
              .sort((a, b) => Number(a) - Number(b))
              .map((pct) => (
                <div key={pct} className="flex items-center gap-3">
                  <div className="mono w-14 text-sm text-muted-foreground">{pct}%</div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="2"
                    value={infillInput[pct]}
                    onChange={(e) =>
                      setInfillInput((s) => ({ ...s, [pct]: e.target.value }))
                    }
                    className="mono h-9 w-32"
                  />
                </div>
              ))}
            <Button
              size="sm"
              className="mt-2"
              onClick={() =>
                save.mutate({
                  key: "infill_multipliers",
                  value: Object.fromEntries(
                    Object.entries(infillInput).map(([k, v]) => [k, Number(v)]),
                  ),
                })
              }
            >
              Save multipliers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------- Users ---------------------------------- */

interface UserRow {
  id: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

function UsersPanel() {
  const qc = useQueryClient();
  const { user: me } = useAuth();

  const q = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<UserRow[]> => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const rolesMap = new Map<string, string[]>();
      (rolesRes.data ?? []).forEach((r: any) => {
        const arr = rolesMap.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesMap.set(r.user_id, arr);
      });

      return (profilesRes.data ?? []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        created_at: p.created_at,
        roles: rolesMap.get(p.id) ?? [],
      }));
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (error && !String(error.message).includes("duplicate")) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const rows = q.data ?? [];

  return (
    <Card className="border-border/70 bg-card/40">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Name</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">
                User ID
              </TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Joined</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Roles</TableHead>
              <TableHead className="mono text-[10px] uppercase tracking-widest">Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {q.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  No users.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isMe = me?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.full_name ?? "—"}
                      {isMe && (
                        <span className="mono ml-2 text-[10px] uppercase tracking-widest text-primary">
                          you
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="mono text-xs text-muted-foreground">
                      {u.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(u.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="mono inline-flex items-center rounded border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
                          >
                            {r}
                          </span>
                        ))}
                        {u.roles.length === 0 && (
                          <span className="mono text-[10px] text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={isAdmin}
                        disabled={isMe}
                        onCheckedChange={(v) =>
                          toggleAdmin.mutate({ userId: u.id, makeAdmin: v })
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
