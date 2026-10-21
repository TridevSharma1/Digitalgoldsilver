/** Home-page sections, reused across content pages. */
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Star, TrendingUp, TrendingDown, Check, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { useStore, inr, GST, uid } from "@/lib/store";
import b1 from "@/assets/banner-1.jpg";
import b2 from "@/assets/banner-2.jpg";
import b3 from "@/assets/banner-3.jpg";
import b4 from "@/assets/banner-4.jpg";
import { Field } from "./ui";

export const bannerImages: Record<string, string> = { "banner-1": b1, "banner-2": b2, "banner-3": b3, "banner-4": b4 };

export function HeroSlider() {
  const [banners] = useStore("banners");
  const list = banners.filter((b) => b.enabled);
  const [i, setI] = useState(0);
  const n = list.length || 1;
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);
  if (!list.length) return null;
  return (
    <section className="relative h-[88vh] min-h-[560px] overflow-hidden" aria-roledescription="carousel" aria-label="Featured">
      {list.map((b, idx) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i % n ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={idx !== i % n}>
          <img src={bannerImages[b.image] ?? b.image} alt="" width={1920} height={1088} className={`h-full w-full object-cover transition-transform duration-[6000ms] ${idx === i % n ? "scale-105" : "scale-100"}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-4">
            {idx === i % n && (
              <div className="max-w-xl fade-up">
                <p className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">24K • 999.9 Pure</p>
                <h1 className="text-4xl font-bold leading-tight md:text-6xl">{b.title.split(" ").slice(0, -2).join(" ")} <span className="text-gold-gradient">{b.title.split(" ").slice(-2).join(" ")}</span></h1>
                <p className="mt-5 text-lg text-muted-foreground">{b.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/buy-gold" className="btn-gold">Buy Gold</Link>
                  <Link to="/buy-silver" className="btn-outline">Buy Silver</Link>
                  <Link to="/plans" className="btn-outline">View Plans</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous slide" className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full glass hover:text-primary md:grid"><ChevronLeft /></button>
      <button onClick={() => setI((i + 1) % n)} aria-label="Next slide" className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full glass hover:text-primary md:grid"><ChevronRight /></button>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {list.map((b, idx) => (
          <button key={b.id} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === i % n ? "w-8 bg-primary" : "w-2 bg-foreground/40"}`} />
        ))}
      </div>
    </section>
  );
}

export function LivePrices() {
  const [gold] = useStore("goldPrice");
  const [silver] = useStore("silverPrice");
  const card = (name: string, p: typeof gold, silverTone: boolean) => {
    const ch = ((p.today - p.yesterday) / p.yesterday) * 100;
    const up = ch >= 0;
    const max = Math.max(...p.history.map((h) => h.price));
    const min = Math.min(...p.history.map((h) => h.price));
    return (
      <div className="card-lux card-hover p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{name} • per gram</p>
            <p className={`mt-2 font-display text-4xl font-bold ${silverTone ? "text-silver" : "text-gold-gradient"}`}>{inr(p.today)}</p>
          </div>
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{ch.toFixed(2)}%
          </span>
        </div>
        <div className="mt-6 flex h-24 items-end gap-2" aria-hidden>
          {p.history.map((h) => (
            <div key={h.date} className={`flex-1 rounded-t-md ${silverTone ? "bg-silver-gradient" : "bg-gold-gradient"} opacity-80`} style={{ height: `${20 + ((h.price - min) / (max - min || 1)) * 80}%` }} title={`${h.date}: ${inr(h.price)}`} />
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-2 text-sm">
          <div><dt className="text-muted-foreground">Today</dt><dd className="font-semibold">{inr(p.today)}</dd></div>
          <div><dt className="text-muted-foreground">Yesterday</dt><dd className="font-semibold">{inr(p.yesterday)}</dd></div>
          <div><dt className="text-muted-foreground">Updated</dt><dd className="font-semibold">{new Date(p.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</dd></div>
        </dl>
      </div>
    );
  };
  return <div className="grid gap-6 md:grid-cols-2">{card("24K Gold", gold, false)}{card("999 Silver", silver, true)}</div>;
}

export function Calculator() {
  const [gold] = useStore("goldPrice");
  const [silver] = useStore("silverPrice");
  const [amount, setAmount] = useState(10000);
  const [metal, setMetal] = useState<"Gold" | "Silver">("Gold");
  const [res, setRes] = useState<null | { w: number; gst: number; total: number; growth: number }>(null);
  const calc = () => {
    const price = metal === "Gold" ? gold.today : silver.today;
    const base = amount / (1 + GST);
    setRes({ w: base / price, gst: amount - base, total: amount, growth: amount * (metal === "Gold" ? 1.11 : 1.09) ** 5 });
  };
  return (
    <div className="card-lux mx-auto grid max-w-4xl gap-8 p-6 md:grid-cols-2 md:p-10">
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); calc(); }}>
        <Field label="Investment amount (₹)">
          <input type="number" min={10} value={amount} onChange={(e) => setAmount(+e.target.value)} className="input-lux" />
        </Field>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Metal">
          {(["Gold", "Silver"] as const).map((m) => (
            <button type="button" role="radio" aria-checked={metal === m} key={m} onClick={() => setMetal(m)} className={`rounded-xl border py-3 font-semibold transition ${metal === m ? "border-primary bg-accent text-primary" : "hover:border-primary/50"}`}>{m}</button>
          ))}
        </div>
        <button className="btn-gold w-full">Calculate</button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        {[
          ["Weight", res ? `${res.w.toFixed(4)} g` : "—"],
          ["GST (3%)", res ? inr(+res.gst.toFixed(2)) : "—"],
          ["Total Value", res ? inr(res.total) : "—"],
          ["Est. in 5 yrs", res ? inr(Math.round(res.growth)) : "—"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-secondary p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-lg font-bold text-primary">{v}</p>
          </div>
        ))}
        <p className="col-span-2 text-xs text-muted-foreground">Growth is an estimate based on historical averages and is not guaranteed.</p>
      </div>
    </div>
  );
}

export function PlansGrid() {
  const [plans] = useStore("plans");
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {plans.map((p) => (
        <div key={p.id} className={`card-lux card-hover relative flex flex-col p-6 ${p.popular ? "border-primary shadow-gold" : ""}`}>
          {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-primary-foreground">Popular</span>}
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.metal}</p>
          <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
          <p className="mt-4 font-display text-3xl font-bold text-gold-gradient">{inr(p.price)}</p>
          <p className="text-xs text-muted-foreground">per {p.period}</p>
          <ul className="my-6 flex-1 space-y-2 text-sm">
            {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-primary" />{f}</li>)}
          </ul>
          <Link to="/register" className={p.popular ? "btn-gold" : "btn-outline"}>Choose Plan</Link>
        </div>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [list] = useStore("testimonials");
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % Math.max(list.length, 1)), 5000);
    return () => clearInterval(t);
  }, [list.length]);
  const t = list[i % list.length];
  if (!t) return null;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div key={t.id} className="card-lux fade-up p-8 md:p-12">
        <img src={t.photo} alt={t.name} loading="lazy" className="mx-auto h-20 w-20 rounded-full border-2 border-primary object-cover" />
        <div className="mt-4 flex justify-center gap-1" aria-label={`${t.rating} of 5 stars`}>
          {Array.from({ length: 5 }).map((_, k) => <Star key={k} className={`h-4 w-4 ${k < t.rating ? "fill-primary text-primary" : "text-muted"}`} />)}
        </div>
        <blockquote className="mt-6 text-lg md:text-xl">“{t.review}”</blockquote>
        <p className="mt-6 font-semibold">{t.name}</p>
        <p className="text-sm text-muted-foreground">{t.city}</p>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {list.map((x, k) => <button key={x.id} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className={`h-2 rounded-full transition-all ${k === i % list.length ? "w-8 bg-primary" : "w-2 bg-muted"}`} />)}
      </div>
    </div>
  );
}

export function NewsGrid({ limit }: { limit?: number }) {
  const [news] = useStore("news");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(news.map((n) => n.category))];
  const list = news.filter((n) => cat === "All" || n.category === cat).slice(0, limit);
  return (
    <>
      {!limit && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary text-primary" : ""}`}>{c}</button>)}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {list.map((n) => (
          <article key={n.id} className="card-lux card-hover overflow-hidden">
            <div className={`h-2 ${n.category.includes("Silver") ? "bg-silver-gradient" : "bg-gold-gradient"}`} />
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{n.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{n.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{n.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function FaqList({ limit }: { limit?: number }) {
  const [faq] = useStore("faq");
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faq.slice(0, limit).map((f) => (
        <div key={f.id} className="card-lux">
          <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" aria-expanded={open === f.id} onClick={() => setOpen(open === f.id ? null : f.id)}>
            {f.q}
            <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === f.id ? "rotate-180" : ""}`} />
          </button>
          {open === f.id && <p className="fade-up px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export function ContactBlock() {
  const [s] = useStore("settings");
  const [, setMsgs] = useStore("messages");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="card-lux space-y-4 p-6 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setMsgs((m) => [{ id: uid(), ...form, date: new Date().toISOString().slice(0, 10) }, ...m]);
          setForm({ name: "", email: "", subject: "", message: "" });
          toast.success("Message sent! We'll get back to you soon.");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input required className="input-lux" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><input required type="email" className="input-lux" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        </div>
        <Field label="Subject"><input required className="input-lux" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></Field>
        <Field label="Message"><textarea required rows={5} className="input-lux" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
        <button className="btn-gold w-full">Send Message</button>
      </form>
      <div className="space-y-4">
        <div className="card-lux relative grid h-56 place-items-center overflow-hidden" aria-label="Map placeholder">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative text-center"><MapPin className="mx-auto h-10 w-10 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Pune, Maharashtra</p></div>
        </div>
        {[[MapPin, "Address", s.address], [Phone, "Phone", s.phone], [Mail, "Email", s.email]].map(([I, k, v]) => {
          const Icon = I as typeof MapPin;
          return (
            <div key={k as string} className="card-lux flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-primary"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0"><p className="text-xs text-muted-foreground">{k as string}</p><p className="break-all font-semibold">{v as string}</p></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
