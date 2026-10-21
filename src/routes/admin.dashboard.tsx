import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { useStore, inr } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, statusTone } from "@/components/site/ui";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => seo("Overview | Admin", "Business overview, pending work and recent activity."),
  component: Page,
});

function Page() {
  const [users] = useStore("users");
  const [tx] = useStore("transactions");
  const [orders] = useStore("orders");
  const [msgs] = useStore("messages");
  const [s] = useStore("settings");

  const invested = users.reduce((a, u) => a + u.invested, 0);
  const gold = +users.reduce((a, u) => a + u.gold, 0).toFixed(2);
  const silver = +users.reduce((a, u) => a + u.silver, 0).toFixed(2);
  const volume = tx.filter((t) => ["Buy", "Sell"].includes(t.type)).reduce((a, t) => a + t.amount, 0);
  const pendingWallet = s.walletRequests.filter((w) => w.status === "Pending").length;
  const pendingKyc = users.filter((u) => u.kyc === "Pending").length;
  const unread = msgs.filter((m) => !m.reply).length;
  const processing = orders.filter((o) => o.status === "Processing").length;

  const stats: [string, string, string][] = [
    ["Customers", `${users.length}`, `${users.filter((u) => u.active).length} active`],
    ["Customer Holdings", `${gold} g Au / ${silver} g Ag`, `${inr(invested)} invested`],
    ["Buy/Sell Volume", inr(volume), `${tx.length} transactions`],
    ["Pending KYC", `${pendingKyc}`, "needs review"],
    ["Wallet Requests", `${pendingWallet}`, "withdrawals pending"],
    ["Open Orders", `${processing}`, `${orders.length} total`],
    ["Unread Messages", `${unread}`, `${msgs.length} total`],
    ["Inactive Accounts", `${users.filter((u) => !u.active).length}`, "deactivated"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([k, v, sub]) => (
          <div key={k} className="card-lux p-5">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-xl font-bold text-primary">{v}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-lux p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground"><tr>{["ID", "Customer", "Type", "Metal", "Amount", "Status"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
              <tbody>{tx.slice(0, 8).map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.id}</td>
                  <td className="p-2 text-xs">{t.userEmail}</td>
                  <td className="p-2">{t.type} {t.metal !== "-" && t.metal}</td>
                  <td className="p-2">{t.grams ? `${t.grams} g` : "-"}</td>
                  <td className="p-2">{inr(t.amount)}</td>
                  <td className="p-2"><Badge tone={statusTone(t.status)}>{t.status}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="card-lux p-6">
          <h2 className="mb-4 font-semibold">Manage</h2>
          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            {[["/admin/users", "Users"], ["/admin/kyc", "KYC"], ["/admin/transactions", "Transactions"], ["/admin/orders", "Orders"], ["/admin/wallet", "Wallet Requests"], ["/admin/messages", "Messages"], ["/admin/content", "Content"], ["/admin/settings", "Settings"]].map(([to, l]) => (
              <Link key={to} to={to} className="btn-outline justify-center">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
