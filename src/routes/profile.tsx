import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { UserShell } from "@/components/site/UserShell";
import { Badge, Field, statusTone } from "@/components/site/ui";
import type { User } from "@/mock";

export const Route = createFileRoute("/profile")({
  head: () => seo("Profile", "Manage your profile, KYC and bank details."),
  component: Page,
});

function Form({ u }: { u: User }) {
  const [, setUsers] = useStore("users"); const [, setKyc] = useStore("kyc");
  const [f, setF] = useState(u);
  const keys = ["name", "phone", "pan", "aadhaar", "address", "bank"] as const;
  return (
    <form className="card-lux grid gap-4 p-6 md:grid-cols-2" onSubmit={(e) => {
      e.preventDefault();
      const kyc = f.pan && f.aadhaar && u.kyc === "Not Submitted" ? "Pending" : u.kyc;
      setUsers((us) => us.map((x) => x.id === u.id ? { ...f, kyc } : x));
      if (kyc === "Pending" && u.kyc !== "Pending") setKyc((k) => [...k, { id: "K" + Date.now(), userEmail: u.email, pan: f.pan, aadhaar: f.aadhaar, status: "Pending", date: new Date().toISOString().slice(0, 10) }]);
      toast.success("Profile saved");
    }}>
      <div className="md:col-span-2 flex items-center justify-between"><h2 className="font-semibold">{u.email}</h2><span>KYC: <Badge tone={statusTone(u.kyc)}>{u.kyc}</Badge></span></div>
      {keys.map((k) => <Field key={k} label={k.toUpperCase()}><input className="input-lux" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></Field>)}
      <button className="btn-gold md:col-span-2">Save Profile</button>
    </form>
  );
}

function Page() { return <UserShell title="Profile">{(u) => <Form u={u} />}</UserShell>; }
