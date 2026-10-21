import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { login } from "@/lib/auth";
import { Field } from "@/components/site/ui";

export const Route = createFileRoute("/login")({
  head: () => seo("Login", "Log in to your digital gold and silver account."),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: "demo@digitalgold.in", password: "demo123", remember: true });
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <form className="card-lux space-y-4 p-8" onSubmit={(e) => { e.preventDefault(); const err = login(f.email, f.password, f.remember); if (err) toast.error(err); else nav({ to: "/dashboard" }); }}>
        <h1 className="text-2xl font-bold">Welcome <span className="text-gold-gradient">back</span></h1>
        <p className="text-xs text-muted-foreground">Demo: demo@digitalgold.in / demo123</p>
        <Field label="Email"><input type="email" required className="input-lux" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Password"><input type="password" required className="input-lux" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
        <div className="flex justify-between text-sm">
          <label className="flex gap-2"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} />Remember me</label>
          <button type="button" className="text-primary" onClick={() => toast.info("Reset link sent (demo)")}>Forgot password?</button>
        </div>
        <button className="btn-gold w-full">Login</button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link to="/register" className="text-primary">Register</Link></p>
      </form>
    </div>
  );
}
