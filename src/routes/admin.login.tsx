import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { adminLogin } from "@/lib/auth";
import { Field } from "@/components/site/ui";

export const Route = createFileRoute("/admin/login")({
  head: () => seo("Admin Login", "Admin panel sign in."),
  component: Page,
});
function Page() {
  const nav = useNavigate();
  const [u, setU] = useState(""); const [p, setP] = useState("");
  return (<div className="grid min-h-screen place-items-center px-4">
    <form className="card-lux w-full max-w-sm space-y-4 p-8" onSubmit={(e) => { e.preventDefault(); if (adminLogin(u, p)) nav({ to: "/admin/dashboard" }); else toast.error("Invalid credentials"); }}>
      <h1 className="text-2xl font-bold">Admin <span className="text-gold-gradient">Panel</span></h1>
      <p className="text-xs text-muted-foreground">Demo: admin / admin123</p>
      <Field label="Username"><input className="input-lux" value={u} onChange={(e) => setU(e.target.value)} /></Field>
      <Field label="Password"><input type="password" className="input-lux" value={p} onChange={(e) => setP(e.target.value)} /></Field>
      <button className="btn-gold w-full">Login</button>
    </form></div>);
}
