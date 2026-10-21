import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { UserShell } from "@/components/site/UserShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/transactions")({
  head: () => seo("Transactions", "Search and filter your transaction history."),
  component: Page,
});

function Page() {
  const [tx] = useStore("transactions");
  const [q, setQ] = useState(""); const [type, setType] = useState("All"); const [date, setDate] = useState("");
  return (
    <UserShell title="Transactions">{(u) => {
      const list = tx.filter((t) => t.userEmail === u.email && (type === "All" || t.type === type) && (!date || t.date === date) && (t.id + t.metal).toLowerCase().includes(q.toLowerCase()));
      return (<div className="card-lux p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <input placeholder="Search" aria-label="Search" className="input-lux max-w-xs" value={q} onChange={(e) => setQ(e.target.value)} />
          <select aria-label="Filter" className="input-lux max-w-40" value={type} onChange={(e) => setType(e.target.value)}>{["All", "Buy", "Sell", "Deposit", "Withdraw"].map((x) => <option key={x}>{x}</option>)}</select>
          <input type="date" aria-label="Date" className="input-lux max-w-44" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn-outline ml-auto" onClick={() => toast.success("Export started (demo)")}>Export</button>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-muted-foreground"><tr>{["ID", "Date", "Type", "Metal", "Grams", "Amount", "Status"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{list.map((t) => <tr key={t.id} className="border-t"><td className="p-3">{t.id}</td><td className="p-3">{t.date}</td><td className="p-3">{t.type}</td><td className="p-3">{t.metal}</td><td className="p-3">{t.grams || "-"}</td><td className="p-3">{inr(t.amount)}</td><td className="p-3"><Badge tone={statusTone(t.status)}>{t.status}</Badge></td></tr>)}</tbody></table></div>
      </div>);
    }}</UserShell>
  );
}
