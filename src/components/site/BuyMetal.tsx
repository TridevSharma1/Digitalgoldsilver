import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useStore, inr, GST } from "@/lib/store";
import { useSession } from "@/lib/auth";
import { Field, Modal, PageHero } from "./ui";
import { LivePrices } from "./sections";

/** Shared purchase flow for gold & silver. */
export function BuyMetal({ metal }: { metal: "Gold" | "Silver" }) {
  const [price] = useStore(metal === "Gold" ? "goldPrice" : "silverPrice");
  const [users, setUsers] = useStore("users");
  const [, setTx] = useStore("transactions");
  const { email } = useSession();
  const user = users.find((u) => u.email === email);
  const [mode, setMode] = useState<"amount" | "grams">("amount");
  const [val, setVal] = useState(metal === "Gold" ? 5000 : 1000);
  const [pay, setPay] = useState<"UPI" | "Wallet">("UPI");
  const [done, setDone] = useState<null | { grams: number; total: number }>(null);

  const base = mode === "amount" ? val / (1 + GST) : val * price.today;
  const grams = base / price.today;
  const gst = base * GST;
  const total = base + gst;

  const buy = (): void => {
    if (!user) return;
    if (total < 10) { toast.error("Minimum purchase is ₹10"); return; }
    if (pay === "Wallet" && user.wallet < total) { toast.error("Insufficient wallet balance"); return; }
    const key = metal === "Gold" ? "gold" : "silver";
    setUsers((us) => us.map((u) => u.email === user.email ? { ...u, [key]: +(u[key] + grams).toFixed(4), invested: Math.round(u.invested + total), wallet: pay === "Wallet" ? Math.round(u.wallet - total) : u.wallet } : u));
    setTx((t) => [{ id: "TX" + Date.now().toString().slice(-6), userEmail: user.email, type: "Buy", metal, grams: +grams.toFixed(4), amount: Math.round(total), date: new Date().toISOString().slice(0, 10), status: "Success" }, ...t]);
    setDone({ grams, total });
  };

  return (
    <>
      <PageHero title={`Buy ${metal === "Gold" ? "24K Gold" : "999 Silver"}`} desc={`Live price ${inr(price.today)}/g. Instantly credited to your vault.`} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-5">
        <div className="card-lux space-y-6 p-6 md:p-8 lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Current price</p>
            <p className={`font-display text-2xl font-bold ${metal === "Gold" ? "text-gold-gradient" : "text-silver"}`}>{inr(price.today)}/g</p>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-full bg-secondary p-1">
            {(["amount", "grams"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setVal(m === "amount" ? 5000 : 1); }} className={`rounded-full py-2 text-sm font-semibold ${mode === m ? "bg-gold-gradient text-primary-foreground" : "text-muted-foreground"}`}>
                Buy in {m === "amount" ? "Rupees" : "Grams"}
              </button>
            ))}
          </div>
          <Field label={mode === "amount" ? "Enter amount (₹, incl. GST)" : "Enter grams"}>
            <input type="number" step="any" min={0} value={val} onChange={(e) => setVal(+e.target.value)} className="input-lux text-xl font-semibold" />
          </Field>
          <div className="flex flex-wrap gap-2">
            {(mode === "amount" ? [500, 1000, 5000, 10000] : [0.5, 1, 5, 10]).map((q) => (
              <button key={q} onClick={() => setVal(q)} className="rounded-full border px-4 py-1.5 text-sm hover:border-primary">{mode === "amount" ? inr(q) : `${q} g`}</button>
            ))}
          </div>
          <Field label="Payment method">
            <select value={pay} onChange={(e) => setPay(e.target.value as "UPI" | "Wallet")} className="input-lux">
              <option value="UPI">UPI / Card / Net Banking</option>
              <option value="Wallet">Wallet {user ? `(${inr(user.wallet)})` : ""}</option>
            </select>
          </Field>
        </div>
        <aside className="card-lux h-fit space-y-4 p-6 md:p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold">Purchase Summary</h2>
          {[["Metal", `${metal} (${metal === "Gold" ? "24K" : "999"})`], ["Weight", `${grams.toFixed(4)} g`], ["Metal value", inr(+base.toFixed(2))], ["GST (3%)", inr(+gst.toFixed(2))]].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>
          ))}
          <div className="flex justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span className="text-primary">{inr(+total.toFixed(2))}</span></div>
          {user ? (
            <button onClick={buy} className="btn-gold w-full">Buy {metal} Now</button>
          ) : (
            <Link to="/login" className="btn-gold w-full">Login to Buy</Link>
          )}
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />100% secure, insured vault storage</p>
        </aside>
      </div>
      <div className="mx-auto max-w-6xl px-4"><LivePrices /></div>
      <Modal open={!!done} onClose={() => setDone(null)} title="Purchase successful">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="mt-4 text-lg">You bought <b className="text-primary">{done?.grams.toFixed(4)} g</b> of {metal}</p>
          <p className="text-muted-foreground">for {inr(+(done?.total ?? 0).toFixed(2))}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link to="/dashboard" className="btn-gold">View Portfolio</Link>
            <button onClick={() => setDone(null)} className="btn-outline">Buy More</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
