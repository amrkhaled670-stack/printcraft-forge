import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Boxes } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — PrintHub" },
      { name: "description", content: "Sign in or create your PrintHub account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate({ to: "/" });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background grid-bg px-4">
      <Card className="w-full max-w-md border-border/80 bg-card/80 backdrop-blur glow-cyan">
        <CardContent className="p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" />
            </div>
            <div>
              <div className="mono text-lg font-semibold">printhub</div>
              <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                account access
              </div>
            </div>
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6 space-y-4">
              <FieldLabel label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FieldLabel>
              <FieldLabel label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FieldLabel>
              <Button onClick={signIn} disabled={loading} className="w-full mono">
                {loading ? "…" : "Sign in"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="mt-6 space-y-4">
              <FieldLabel label="Full name">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FieldLabel>
              <FieldLabel label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FieldLabel>
              <FieldLabel label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FieldLabel>
              <Button onClick={signUp} disabled={loading} className="w-full mono">
                {loading ? "…" : "Create account"}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span className="mono">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full mono" onClick={google}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
