import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { AdminShell } from "@/components/site/AdminShell";
import { Badge, Field } from "@/components/site/ui";
import type { Price } from "@/mock";

export const Route = createFileRoute("/admin/content")({
  head: () => seo("Content | Admin", "Edit prices, banners, plans, FAQ, news and testimonials."),
  component: Page,
});

const TABS = ["Prices", "Banners", "Plans", "FAQ", "News", "Testimonials"] as const;

function Page() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Prices");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={tab === t ? "btn-gold" : "btn-outline"}>{t}</button>)}
      </div>
      {tab === "Prices" && <Prices />}
      {tab === "Banners" && <Banners />}
      {tab === "Plans" && <Plans />}
      {tab === "FAQ" && <Faq />}
      {tab === "News" && <News />}
      {tab === "Testimonials" && <Testimonials />}
    </div>
  );
}

function PriceForm({ title, price, onSave }: { title: string; price: Price; onSave: (p: Price) => void }) {
  const [f, setF] = useState(price);
  return (
    <form className="card-lux space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, updatedAt: new Date().toISOString() }); toast.success(`${title} price saved`); }}>
      <h2 className="font-semibold">{title} (₹/g)</h2>
      <Field label="Today"><input type="number" className="input-lux" value={f.today} onChange={(e) => setF({ ...f, today: +e.target.value })} /></Field>
      <Field label="Yesterday"><input type="number" className="input-lux" value={f.yesterday} onChange={(e) => setF({ ...f, yesterday: +e.target.value })} /></Field>
      <button className="btn-gold w-full">Save</button>
      <p className="text-xs text-muted-foreground">Last updated: {new Date(price.updatedAt).toLocaleString()}</p>
    </form>
  );
}

function Prices() {
  const [g, setG] = useStore("goldPrice");
  const [s, setS] = useStore("silverPrice");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PriceForm title="Gold" price={g} onSave={setG} />
      <PriceForm title="Silver" price={s} onSave={setS} />
    </div>
  );
}

function Banners() {
  const [banners, setBanners] = useStore("banners");
  const upd = (id: string, patch: Partial<(typeof banners)[number]>) => setBanners(banners.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  return (
    <div className="space-y-4">
      {banners.map((b) => (
        <div key={b.id} className="card-lux space-y-3 p-5">
          <div className="flex items-center justify-between">
            <Badge tone={b.enabled ? "success" : "muted"}>{b.enabled ? "Enabled" : "Disabled"}</Badge>
            <div className="flex gap-2">
              <button className={b.enabled ? "btn-outline px-3 py-1 text-xs" : "btn-gold px-3 py-1 text-xs"} onClick={() => upd(b.id, { enabled: !b.enabled })}>{b.enabled ? "Disable" : "Enable"}</button>
              <button className="btn-outline px-3 py-1 text-xs" onClick={() => { setBanners(banners.filter((x) => x.id !== b.id)); toast.success("Banner removed"); }}>Delete</button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title"><input className="input-lux" value={b.title} onChange={(e) => upd(b.id, { title: e.target.value })} /></Field>
            <Field label="Subtitle"><input className="input-lux" value={b.subtitle} onChange={(e) => upd(b.id, { subtitle: e.target.value })} /></Field>
          </div>
        </div>
      ))}
      <button className="btn-outline" onClick={() => setBanners([...banners, { id: "b" + Date.now(), image: "banner-1", title: "New Banner", subtitle: "Edit this banner", enabled: false }])}>Add Banner</button>
    </div>
  );
}

function Plans() {
  const [plans, setPlans] = useStore("plans");
  const upd = (id: string, patch: Partial<(typeof plans)[number]>) => setPlans(plans.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.id} className="card-lux space-y-3 p-5">
            <div className="flex items-center justify-between">
              <Badge tone={p.popular ? "gold" : "muted"}>{p.popular ? "Popular" : p.metal}</Badge>
              <button className="btn-outline px-3 py-1 text-xs" onClick={() => { setPlans(plans.filter((x) => x.id !== p.id)); toast.success("Plan removed"); }}>Delete</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name"><input className="input-lux" value={p.name} onChange={(e) => upd(p.id, { name: e.target.value })} /></Field>
              <Field label="Price (₹)"><input type="number" className="input-lux" value={p.price} onChange={(e) => upd(p.id, { price: +e.target.value })} /></Field>
              <Field label="Metal"><input className="input-lux" value={p.metal} onChange={(e) => upd(p.id, { metal: e.target.value })} /></Field>
              <Field label="Period"><input className="input-lux" value={p.period} onChange={(e) => upd(p.id, { period: e.target.value })} /></Field>
            </div>
            <Field label="Features (one per line)"><textarea className="input-lux min-h-24" value={p.features.join("\n")} onChange={(e) => upd(p.id, { features: e.target.value.split("\n") })} /></Field>
            <button className={p.popular ? "btn-outline" : "btn-gold"} onClick={() => upd(p.id, { popular: !p.popular })}>{p.popular ? "Unmark Popular" : "Mark Popular"}</button>
          </div>
        ))}
      </div>
      <button className="btn-outline" onClick={() => setPlans([...plans, { id: "p" + Date.now(), name: "New Plan", metal: "Gold", price: 1000, period: "month", features: ["Feature one"] }])}>Add Plan</button>
    </div>
  );
}

function Faq() {
  const [faq, setFaq] = useStore("faq");
  const upd = (id: string, patch: Partial<(typeof faq)[number]>) => setFaq(faq.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-4">
      {faq.map((f) => (
        <div key={f.id} className="card-lux space-y-3 p-5">
          <div className="flex justify-end"><button className="btn-outline px-3 py-1 text-xs" onClick={() => { setFaq(faq.filter((x) => x.id !== f.id)); toast.success("Question removed"); }}>Delete</button></div>
          <Field label="Question"><input className="input-lux" value={f.q} onChange={(e) => upd(f.id, { q: e.target.value })} /></Field>
          <Field label="Answer"><textarea className="input-lux min-h-20" value={f.a} onChange={(e) => upd(f.id, { a: e.target.value })} /></Field>
        </div>
      ))}
      <button className="btn-outline" onClick={() => setFaq([...faq, { id: "f" + Date.now(), q: "New question?", a: "Answer here." }])}>Add Question</button>
    </div>
  );
}

function News() {
  const [news, setNews] = useStore("news");
  const upd = (id: string, patch: Partial<(typeof news)[number]>) => setNews(news.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  return (
    <div className="space-y-4">
      {news.map((n) => (
        <div key={n.id} className="card-lux space-y-3 p-5">
          <div className="flex justify-end"><button className="btn-outline px-3 py-1 text-xs" onClick={() => { setNews(news.filter((x) => x.id !== n.id)); toast.success("Article removed"); }}>Delete</button></div>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Title"><input className="input-lux" value={n.title} onChange={(e) => upd(n.id, { title: e.target.value })} /></Field>
            <Field label="Category"><input className="input-lux" value={n.category} onChange={(e) => upd(n.id, { category: e.target.value })} /></Field>
            <Field label="Date"><input type="date" className="input-lux" value={n.date} onChange={(e) => upd(n.id, { date: e.target.value })} /></Field>
          </div>
          <Field label="Excerpt"><textarea className="input-lux min-h-20" value={n.excerpt} onChange={(e) => upd(n.id, { excerpt: e.target.value })} /></Field>
        </div>
      ))}
      <button className="btn-outline" onClick={() => setNews([{ id: "n" + Date.now(), title: "New Article", category: "General", date: new Date().toISOString().slice(0, 10), excerpt: "Excerpt here." }, ...news])}>Add Article</button>
    </div>
  );
}

function Testimonials() {
  const [ts, setTs] = useStore("testimonials");
  const upd = (id: string, patch: Partial<(typeof ts)[number]>) => setTs(ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {ts.map((t) => (
          <div key={t.id} className="card-lux space-y-3 p-5">
            <div className="flex justify-end"><button className="btn-outline px-3 py-1 text-xs" onClick={() => { setTs(ts.filter((x) => x.id !== t.id)); toast.success("Testimonial removed"); }}>Delete</button></div>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Name"><input className="input-lux" value={t.name} onChange={(e) => upd(t.id, { name: e.target.value })} /></Field>
              <Field label="City"><input className="input-lux" value={t.city} onChange={(e) => upd(t.id, { city: e.target.value })} /></Field>
              <Field label="Rating (1-5)"><input type="number" min={1} max={5} className="input-lux" value={t.rating} onChange={(e) => upd(t.id, { rating: Math.min(5, Math.max(1, +e.target.value)) })} /></Field>
            </div>
            <Field label="Review"><textarea className="input-lux min-h-20" value={t.review} onChange={(e) => upd(t.id, { review: e.target.value })} /></Field>
          </div>
        ))}
      </div>
      <button className="btn-outline" onClick={() => setTs([...ts, { id: "t" + Date.now(), name: "New Customer", city: "Pune", rating: 5, review: "Great experience.", photo: "https://i.pravatar.cc/150" }])}>Add Testimonial</button>
    </div>
  );
}
