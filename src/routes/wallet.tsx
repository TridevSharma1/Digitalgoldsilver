import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { UserShell } from "@/components/site/UserShell";
import type { User } from "@/mock";

export const Route = createFileRoute("/wallet")({
  head: () => seo("Wallet", "Add money, withdraw and sell holdings from your wallet."),
  component: Page,
});

function W({ u }: { u: User }) {
  const [, setUsers] = useStore("users"); const [tx, setTx] = useStore("transactions"); const [, setS] = useStore("settings");
  const [amt, setAmt] = useState(1000);
  const today = new Date().toISOString().slice(0, 10);
  const act = (type: "Deposit" | "Withdraw") => {
    if (amt <= 0) return;
    if (type === "Withdraw" && amt > u.wallet) { toast.error("Insufficient balance"); return; }
    if (type === "Deposit") setUsers((us) => us.map((x) => x.id === u.id ? { ...x, wallet: x.wallet + amt } : x));
    else setS((s) => ({ ...s, walletRequests: [...s.walletRequests, { id: "w" + Date.now(), userEmail: u.email, type, amount: amt, status: "Pending", date: today }] }));
    setTx((t) => [{ id: "TX" + Date.now().toString().slice(-6), userEmail: u.email, type, metal: "-", grams: 0, amount: amt, date: today, status: type === "Deposit" ? "Success" : "Pending" }, ...t]);
    toast.success(type === "Deposit" ? "Money added" : "Withdrawal requested");
  };
  return (<div className="grid gap-6 lg:grid-cols-2">
    <div className="card-lux space-y-4 p-6"><p className="text-sm text-muted-foreground">Wallet Balance</p><p className="font-display text-4xl font-bold text-gold-gradient">{inr(u.wallet)}</p>
      <input type="number" aria-label="Amount" className="input-lux" value={amt} onChange={(e) => setAmt(+e.target.value)} />
      <div className="grid grid-cols-2 gap-2"><button className="btn-gold" onClick={() => act("Deposit")}>Add Money</button><button className="btn-outline" onClick={() => act("Withdraw")}>Withdraw</button></div></div>
    <div className="card-lux p-6"><h2 className="mb-3 font-semibold">History</h2>{tx.filter((t) => t.userEmail === u.email && ["Deposit", "Withdraw"].includes(t.type)).map((t) => <div key={t.id} className="flex justify-between border-b py-2 text-sm"><span>{t.type} • {t.date}</span><span>{inr(t.amount)} ({t.status})</span></div>)}</div>
  </div>);
}
function Page() { return <UserShell title="Wallet">{(u) => <W u={u} />}</UserShell>; }
