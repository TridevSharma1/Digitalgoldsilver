import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Coins } from "lucide-react";
import { useStore, inr } from "@/lib/store";
import { useSession, logout } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/buy-gold", label: "Buy Gold" },
  { to: "/buy-silver", label: "Buy Silver" },
  { to: "/calculator", label: "Calculator" },
  { to: "/plans", label: "Plans" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Digital Gold And Sale home">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-primary-foreground shadow-gold">
        <Coins className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-bold leading-none">
        Digital <span className="text-gold-gradient">Gold</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">And Sale</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [gold] = useStore("goldPrice");
  const [silver] = useStore("silverPrice");
  const { email } = useSession();

  const ticker = `Today's Gold Price ${inr(gold.today)}/g  •  Today's Silver Price ${inr(silver.today)}/g  •  24K 999.9 Purity  •  100% Insured Vaults  •  `;

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden bg-gold-gradient py-1.5 text-xs font-semibold text-primary-foreground">
        <div className="flex w-max animate-marquee whitespace-pre">
          <span>{ticker.repeat(3)}</span>
          <span>{ticker.repeat(3)}</span>
        </div>
      </div>
      <div className="glass border-x-0 border-t-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {email ? (
              <>
                <Link to="/dashboard" className="btn-gold">Dashboard</Link>
                <button onClick={logout} className="btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/register" className="btn-gold">Register</Link>
              </>
            )}
          </div>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-4 py-4 lg:hidden" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 hover:bg-secondary">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {email ? (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-gold flex-1">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-gold flex-1">Register</Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
