import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Field } from "@/components/site/ui";
import type { Settings } from "@/mock";

export const Route = createFileRoute("/admin/settings")({
  head: () => seo("Settings | Admin", "Business contact details and footer settings."),
  component: Page,
});

function Page() {
  const [s, setS] = useStore("settings");
  const [f, setF] = useState<Settings>(s);
  const keys = ["businessName", "address", "phone", "email", "footer"] as const;
  return (
    <form className="card-lux grid gap-4 p-6 md:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setS(f); toast.success("Settings saved"); }}>
      <h1 className="font-semibold md:col-span-2">Business Settings</h1>
      {keys.map((k) => <Field key={k} label={k === "footer" ? "Footer tagline" : k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1")}><input className="input-lux" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></Field>)}
      {(["facebook", "instagram", "twitter", "youtube"] as const).map((k) => (
        <Field key={k} label={`Social — ${k.charAt(0).toUpperCase() + k.slice(1)}`}><input className="input-lux" value={f.social[k]} onChange={(e) => setF({ ...f, social: { ...f.social, [k]: e.target.value } })} /></Field>
      ))}
      <button className="btn-gold md:col-span-2">Save Settings</button>
    </form>
  );
}
