import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/admin/wallet")({
  head: () => seo("Wallet Requests | Admin", "Approve or reject withdrawal requests."),
  component: Page,
});

function Page() {
  const [s, setS] = useStore("settings");
  const [users, setUsers] = useStore("users");
  const [, setTx] = useStore("transactions");
  const list = [...s.walletRequests].reverse();

  const decide = (id: string, status: "Success" | "Rejected") => {
    const r = s.walletRequests.find((x) => x.id === id);
    if (!r) return;
    if (status === "Success") {
      const u = users.find((x) => x.email === r.userEmail);
      if (!u || u.wallet < r.amount) { toast.error("Customer has insufficient wallet balance"); return; }
      setUsers((us) => us.map((x) => (x.email === r.userEmail ? { ...x, wallet: x.wallet - r.amount } : x)));
      setTx((tx) => tx.map((t) => (t.userEmail === r.userEmail && t.type === "Withdraw" && t.status === "Pending" && t.amount === r.amount ? { ...t, status: "Success" } : t)));
    } else {
      setTx((tx) => tx.map((t) => (t.userEmail === r.userEmail && t.type === "Withdraw" && t.status === "Pending" && t.amount === r.amount ? { ...t, status: "Rejected" } : t)));
    }
    setS((st) => ({ ...st, walletRequests: st.walletRequests.map((x) => (x.id === id ? { ...x, status } : x)) }));
    toast.success(`Withdrawal ${status === "Success" ? "approved" : "rejected"}`);
  };

  return (
    <div className="card-lux p-6">
      <h1 className="mb-4 font-semibold">Wallet Requests</h1>
      {list.length === 0 && <p className="text-sm text-muted-foreground">No requests yet.</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr>{["Customer", "Type", "Amount", "Date", "Status", "Actions"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{list.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="p-3 text-xs">{w.userEmail}</td>
              <td className="p-3">{w.type}</td>
              <td className="p-3">{inr(w.amount)}</td>
              <td className="p-3">{w.date}</td>
              <td className="p-3"><Badge tone={statusTone(w.status)}>{w.status}</Badge></td>
              <td className="p-3">
                {w.status === "Pending" ? (
                  <div className="flex gap-2">
                    <button className="btn-gold px-3 py-1 text-xs" onClick={() => decide(w.id, "Success")}>Approve</button>
                    <button className="btn-outline px-3 py-1 text-xs" onClick={() => decide(w.id, "Rejected")}>Reject</button>
                  </div>
                ) : <span className="text-xs text-muted-foreground">—</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
