import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { UserShell } from "@/components/site/UserShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("Dashboard", "Your gold and silver portfolio at a glance."),
  component: Page,
});

function Page() {
  const [g] = useStore("goldPrice"); const [s] = useStore("silverPrice"); const [tx] = useStore("transactions");
  return (
    <UserShell title="Dashboard">{(u) => {
      const value = u.gold * g.today + u.silver * s.today; const pl = value - u.invested;
      const mine = tx.filter((t) => t.userEmail === u.email);
      const gv = u.gold * g.today, sv = u.silver * s.today;
      return (<div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[["Wallet", inr(u.wallet)], ["Gold", `${u.gold} g`], ["Silver", `${u.silver} g`], ["Invested", inr(u.invested)], ["Current Value", inr(Math.round(value))], ["Profit/Loss", inr(Math.round(pl))]].map(([k, v]) => (
            <div key={k} className="card-lux p-5"><p className="text-xs text-muted-foreground">{k}</p><p className={`mt-1 font-display text-lg font-bold ${k === "Profit/Loss" ? (pl >= 0 ? "text-success" : "text-destructive") : "text-primary"}`}>{v}</p></div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card-lux p-6"><h2 className="mb-4 font-semibold">Portfolio</h2>
            <div className="flex h-4 overflow-hidden rounded-full bg-muted"><div className="bg-gold-gradient" style={{ width: `${(gv / (value || 1)) * 100}%` }} /><div className="bg-silver-gradient flex-1" /></div>
            <p className="mt-3 text-sm text-muted-foreground">Gold {inr(Math.round(gv))} • Silver {inr(Math.round(sv))}</p>
            <div className="mt-6 grid grid-cols-2 gap-2"><Link to="/buy-gold" className="btn-gold">Buy Gold</Link><Link to="/buy-silver" className="btn-outline">Buy Silver</Link><Link to="/wallet" className="btn-outline">Sell / Wallet</Link><Link to="/profile" className="btn-outline">Profile</Link></div>
          </div>
          <div className="card-lux p-6 lg:col-span-2"><h2 className="mb-4 font-semibold">Recent Transactions</h2>
            {mine.slice(0, 5).map((t) => <div key={t.id} className="flex justify-between border-b py-3 text-sm last:border-0"><span>{t.type} {t.metal !== "-" && t.metal} <span className="text-muted-foreground">• {t.date}</span></span><span className="flex gap-2">{inr(t.amount)}<Badge tone={statusTone(t.status)}>{t.status}</Badge></span></div>)}
          </div>
        </div>
      </div>);
    }}</UserShell>
  );
}
