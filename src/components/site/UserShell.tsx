import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LayoutDashboard, User, Receipt, Wallet, LogOut } from "lucide-react";
import { useSession, logout } from "@/lib/auth";
import { useStore } from "@/lib/store";
import type { User as U } from "@/mock";

/** Guards user pages and renders the account sub-navigation. */
export function UserShell({ title, children }: { title: string; children: (u: U) => ReactNode }) {
  const { email, ready } = useSession();
  const [users] = useStore("users");
  const nav = useNavigate();
  const user = users.find((u) => u.email === email);
  useEffect(() => { if (ready && !email) nav({ to: "/login" }); }, [ready, email, nav]);

  if (!user) return <div className="mx-auto max-w-7xl px-4 py-24"><div className="h-40 animate-pulse rounded-2xl bg-card" /></div>;

  const links = [
    { to: "/dashboard", l: "Dashboard", I: LayoutDashboard },
    { to: "/profile", l: "Profile", I: User },
    { to: "/transactions", l: "Transactions", I: Receipt },
    { to: "/wallet", l: "Wallet", I: Wallet },
  ] as const;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-bold">{user.name.split(" ")[0]} <span className="text-gold-gradient">• {title}</span></h1>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Account">
          {links.map(({ to, l, I }) => (
            <Link key={to} to={to} className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition hover:border-primary" activeProps={{ className: "border-primary bg-accent text-primary" }}>
              <I className="h-4 w-4" />{l}
            </Link>
          ))}
          <button onClick={() => { logout(); nav({ to: "/" }); }} className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm hover:border-destructive hover:text-destructive"><LogOut className="h-4 w-4" />Logout</button>
        </nav>
      </div>
      {children(user)}
    </div>
  );
}
