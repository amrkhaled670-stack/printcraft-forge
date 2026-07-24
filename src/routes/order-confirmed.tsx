import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) ?? "" }),
  head: () => ({
    meta: [
      { title: "Order confirmed — PrintHub" },
      { name: "description", content: "Your print is queued. Track slicing, printing, and shipping from your dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order confirmed — PrintHub" },
      { property: "og:description", content: "Your print is queued." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Confirmed,
});

function Confirmed() {
  const { id } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-6 py-20">
        <Card className="border-primary/40 bg-card/80 glow-cyan">
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">Order placed</h1>
            <p className="text-sm text-muted-foreground">
              We're queueing your print now. You'll see status updates as it moves
              through slicing, printing, and shipping.
            </p>
            {id && (
              <div className="mono rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                order.id / {id.slice(0, 8)}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline">
                <Link to="/configure">Print another</Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard">Track order</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
