import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/admin/transactions")({
  head: () => seo("Transactions | Admin", "All customer transactions with filters."),
  component: Page,
});

function Page() {
  const [tx, setTx] = useStore("transactions");
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const list = tx.filter((t) => (type === "All" || t.type === type) && (t.id + t.userEmail + t.metal).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="card-lux p-6">
      <h1 className="mb-4 font-semibold">All Transactions</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input placeholder="Search customer or ID" aria-label="Search" className="input-lux max-w-xs" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Type filter" className="input-lux max-w-40" value={type} onChange={(e) => setType(e.target.value)}>
          {["All", "Buy", "Sell", "Deposit", "Withdraw"].map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr>{["ID", "Customer", "Date", "Type", "Metal", "Grams", "Amount", "Status", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{list.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.id}</td>
              <td className="p-3 text-xs">{t.userEmail}</td>
              <td className="p-3">{t.date}</td>
              <td className="p-3">{t.type}</td>
              <td className="p-3">{t.metal}</td>
              <td className="p-3">{t.grams || "-"}</td>
              <td className="p-3">{inr(t.amount)}</td>
              <td className="p-3"><Badge tone={statusTone(t.status)}>{t.status}</Badge></td>
              <td className="p-3">{t.status === "Pending" && <button className="btn-gold px-3 py-1 text-xs" onClick={() => { setTx(tx.map((x) => (x.id === t.id ? { ...x, status: "Success" } : x))); toast.success("Marked Success"); }}>Mark Success</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
