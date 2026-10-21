/** Small reusable presentational building blocks. */
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Section({ id, eyebrow, title, desc, children, className = "" }: {
  id?: string; eyebrow?: string; title: string; desc?: string; children: ReactNode; className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-16 md:py-24 ${className}`}>
      <div className="mx-auto mb-12 max-w-2xl text-center fade-up">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>}
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        {desc && <p className="mt-4 text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

export function PageHero({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="relative overflow-hidden border-b bg-card">
      <div className="absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold-gradient opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center md:py-20">
        <h1 className="fade-up text-4xl font-bold md:text-5xl"><span className="text-gold-gradient">{title}</span></h1>
        {desc && <p className="fade-up mx-auto mt-4 max-w-xl text-muted-foreground">{desc}</p>}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="card-lux fade-up w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "success" | "danger" | "muted" }) {
  const map = {
    gold: "bg-accent text-accent-foreground",
    success: "bg-success/15 text-success",
    danger: "bg-destructive/15 text-destructive",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[tone]}`}>{children}</span>;
}

export const statusTone = (s: string) =>
  /success|verified|active|approved|shipped|delivered/i.test(s) ? "success" : /fail|reject|inactive|cancel/i.test(s) ? "danger" : "gold";
