import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";
import type { User } from "@/mock";

export const Route = createFileRoute("/admin/users")({
  head: () => seo("Users | Admin", "Manage customer accounts, balances and access."),
  component: Page,
});

function Row({ u, setUsers }: { u: User; setUsers: (fn: (us: User[]) => User[]) => void }) {
  const [wallet, setWallet] = useState(u.wallet);
  return (
    <tr className="border-t">
      <td className="p-3"><p className="font-semibold">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></td>
      <td className="p-3 text-xs">{u.phone}</td>
      <td className="p-3">
        <input type="number" aria-label={`Wallet balance for ${u.name}`} className="input-lux w-28" value={wallet} onChange={(e) => setWallet(+e.target.value)} />
        <button className="btn-outline mt-1 px-2 py-1 text-xs" onClick={() => { setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, wallet } : x))); toast.success("Wallet updated"); }}>Save</button>
      </td>
      <td className="p-3 whitespace-nowrap">{u.gold} g / {u.silver} g</td>
      <td className="p-3">{inr(u.invested)}</td>
      <td className="p-3"><Badge tone={statusTone(u.kyc)}>{u.kyc}</Badge></td>
      <td className="p-3"><Badge tone={u.active ? "success" : "danger"}>{u.active ? "Active" : "Inactive"}</Badge></td>
      <td className="p-3">
        <button className={u.active ? "btn-outline px-3 py-1 text-xs" : "btn-gold px-3 py-1 text-xs"} onClick={() => { setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))); toast.success(u.active ? "Account deactivated" : "Account activated"); }}>
          {u.active ? "Deactivate" : "Activate"}
        </button>
      </td>
    </tr>
  );
}

function Page() {
  const [users, setUsers] = useStore("users");
  return (
    <div className="card-lux p-6">
      <h1 className="mb-4 font-semibold">Customers</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr>{["Customer", "Phone", "Wallet", "Holdings", "Invested", "KYC", "Status", "Actions"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{users.map((u) => <Row key={u.id} u={u} setUsers={setUsers} />)}</tbody>
        </table>
      </div>
    </div>
  );
}
