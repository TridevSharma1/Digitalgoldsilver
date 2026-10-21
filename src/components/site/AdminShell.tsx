import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Receipt, Package, Wallet,
  MessageSquare, LayoutGrid, Settings, LogOut,
} from "lucide-react";
import { adminLogout, isAdmin } from "@/lib/auth";

const tabs = [
  { to: "/admin/dashboard", l: "Overview", I: LayoutDashboard },
  { to: "/admin/users", l: "Users", I: Users },
  { to: "/admin/kyc", l: "KYC", I: ShieldCheck },
  { to: "/admin/transactions", l: "Transactions", I: Receipt },
  { to: "/admin/orders", l: "Orders", I: Package },
  { to: "/admin/wallet", l: "Wallet Requests", I: Wallet },
  { to: "/admin/messages", l: "Messages", I: MessageSquare },
  { to: "/admin/content", l: "Content", I: LayoutGrid },
  { to: "/admin/settings", l: "Settings", I: Settings },
] as const;

/** Guards admin pages and renders the admin sidebar / mobile tab bar. */
export function AdminShell({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!isAdmin()) nav({ to: "/admin/login" });
    else setReady(true);
  }, [nav]);

  if (!ready) return <div className="mx-auto max-w-7xl px-4 py-24"><div className="h-40 animate-pulse rounded-2xl bg-card" /></div>;

  const links = (mobile = false) => tabs.map(({ to, l, I }) => (
    <Link
      key={to}
      to={to}
      onClick={mobile ? undefined : undefined}
      className={
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition whitespace-nowrap " +
        (mobile ? "border hover:border-primary" : "hover:bg-secondary hover:text-primary")
      }
      activeProps={{ className: mobile ? "border-primary bg-accent text-primary" : "bg-accent text-primary font-semibold" }}
    >
      <I className="h-4 w-4" />{l}
    </Link>
  ));

  return (
    <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-8 lg:flex-row">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="card-lux sticky top-24 p-4">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Admin Panel</p>
          <nav className="flex flex-col gap-1" aria-label="Admin">{links()}</nav>
          <button
            onClick={() => { adminLogout(); nav({ to: "/admin/login" }); }}
            className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Admin">{links(true)}</nav>
        {children}
      </main>
    </div>
  );
}
